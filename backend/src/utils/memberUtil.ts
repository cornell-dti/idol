// This file contains common operations that will need to be performed often.
import { createPatch } from 'diff';
import { firestore } from 'firebase-admin';
import { archivedMembersByEmail } from '../members-archive';

/**
 * Get the netID of a member from their Cornell email.
 * @param email - the email of the member.
 * @returns the netID of the member.
 */
export const getNetIDFromEmail = (email: string): string => email.split('@')[0];

/**
 * Filters the response from Google Cloud Storage to only include the filename
 * of the image.
 * @param images - a list of image filenmaes and their URLs.
 * @returns a list of profile images.
 */
export const filterImagesResponse = (
  images: readonly { readonly fileName: string; readonly url: string }[]
): ProfileImage[] =>
  images
    .filter((image) => image.fileName.length > 7)
    .map((image) => ({
      ...image,
      fileName: image.fileName.slice(image.fileName.indexOf('/') + 1)
    }));

/**
 * Serialize an `IdolMember` from a Firestore document reference.
 * @param docRef - the Firestore document reference.
 * @returns an `IdolMember` object of the member.
 */
export const getMemberFromDocumentReference = async (
  docRef: firestore.DocumentReference
): Promise<IdolMember> => {
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return archivedMembersByEmail[docRef.id];
  }
  return snapshot.data() as IdolMember;
};

type SimplifiedMember = { readonly email: string };

/**
 * Computes the differences between the currently approved members and the
 * members who've submitted changes to their profiles.
 * @param allApprovedMembersList - the list of all approved members.
 * @param allLatestMembersList - the list of all members who've submitted changes.
 * @returns a list of `IdolMemberDiff` objects that contain all the differences
 * to each members' profiles.
 */
export const computeMembersDiff = <M extends SimplifiedMember>(
  allApprovedMembersList: readonly M[],
  allLatestMembersList: readonly M[]
): readonly IdolMemberDiff[] => {
  const approvedMemberMap = new Map(allApprovedMembersList.map((it) => [it.email, it]));

  const diffs: IdolMemberDiff[] = [];

  const jsonToString = (json: unknown): string => {
    if (typeof json !== 'object' || json == null) return '';
    return Object.entries(json)
      .sort(([n1], [n2]) => n1.localeCompare(n2))
      .map(([name, value]) => {
        if (Array.isArray(value)) {
          value.sort((a, b) => a.localeCompare(b));
          return ` ${name}: [${value.join(', ')}]`;
        }
        return ` ${name}: ${value}`;
      })
      .join('\n');
  };

  const diff = (oldString: string, newString: string) => {
    const rawDiff = createPatch(
      '',
      `${oldString}\n`,
      `${newString}\n`,
      undefined,
      undefined,
      // Show full context for member json
      { context: 20 }
    );
    // Remove some irrelevant junk
    return rawDiff.substr(rawDiff.indexOf('@@')).trim();
  };

  // First pass: check difference between new data and old data (i.e. changed/added since last approve)
  allLatestMembersList.forEach((latestData) => {
    const approvedData = approvedMemberMap.get(latestData.email);
    const oldString = jsonToString(approvedData);
    const newString = jsonToString(latestData);
    if (oldString !== newString) {
      diffs.push({
        email: latestData.email,
        diffString: diff(oldString, newString)
      });
    }
    // Delete the matched data from map. Therefore, after this pass ends, we know what's unmatched.
    approvedMemberMap.delete(latestData.email);
  });

  // Second pass: report missing members from the new data (i.e. deleted since last approve)
  approvedMemberMap.forEach((leftOverApprovedMember) => {
    diffs.push({
      email: leftOverApprovedMember.email,
      diffString: diff(jsonToString(leftOverApprovedMember), '')
    });
  });

  return diffs.sort((a, b) => a.email.localeCompare(b.email));
};
