interface EmailChanges {
  readonly cancelled: string[];
  readonly signedUp: string[];
}

export default function detectEmailChanges(
  oldSlot: InterviewSlot,
  newSlot: InterviewSlot
): EmailChanges {
  const oldEmails = new Set<string>();

  if (oldSlot.applicant?.email) {
    oldEmails.add(oldSlot.applicant.email);
  }

  if (oldSlot.lead?.email) {
    oldEmails.add(oldSlot.lead.email);
  }

  oldSlot.members
    .filter((member) => member?.email)
    .forEach((member) => oldEmails.add(member!.email));

  const newEmails = new Set<string>();

  if (newSlot.applicant?.email) {
    newEmails.add(newSlot.applicant.email);
  }

  if (newSlot.lead?.email) {
    newEmails.add(newSlot.lead.email);
  }

  newSlot.members
    .filter((member) => member?.email)
    .forEach((member) => newEmails.add(member!.email));

  const cancelled = Array.from(oldEmails).filter((email) => !newEmails.has(email));
  const signedUp = Array.from(newEmails).filter((email) => !oldEmails.has(email));

  return { cancelled, signedUp };
}
