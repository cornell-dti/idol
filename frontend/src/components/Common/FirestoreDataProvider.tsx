import { Loader } from 'semantic-ui-react';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { adminsCollection, membersCollection, approvedMembersCollection } from '../../firebase';
import { useUserEmail } from './UserProvider';

type ListenedFirestoreData = {
  readonly adminEmails?: readonly string[];
  readonly members?: readonly IdolMember[];
  readonly approvedMembers?: readonly IdolMember[];
};

const FirestoreDataContext = createContext<ListenedFirestoreData>({});

export const useAdminEmails = (): readonly string[] =>
  useContext(FirestoreDataContext).adminEmails || [];

export const useApprovedMembers = (): readonly IdolMember[] =>
  useContext(FirestoreDataContext).approvedMembers || [];

export const useMembers = (): readonly IdolMember[] =>
  useContext(FirestoreDataContext).members || [];

/** @returns a member with given `email`, or `undefined` if there is no such member. */
export const useMember = (email: string): IdolMember | undefined =>
  useMembers().find((it) => it.email === email);

/** @returns yourself as a member, or `undefined` if data is not properly initialized. */
export const useSelf = (): IdolMember | undefined => useMember(useUserEmail());

/** @returns whether the current user has admin permissions */
export const useHasAdminPermission = (): boolean => {
  const userEmail = useUserEmail();
  const self = useSelf();
  const adminEmails = useAdminEmails();
  return self?.role === 'lead' || adminEmails.includes(userEmail);
};

type Props = { readonly children: ReactNode };

export default function FirestoreDataProvider({ children }: Props): JSX.Element {
  const [adminEmails, setAdminEmails] = useState<readonly string[] | undefined>();
  const [members, setMembers] = useState<readonly IdolMember[] | undefined>();
  const [approvedMembers, setApprovedMembers] = useState<readonly IdolMember[] | undefined>();
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return () => {
        // Do not run firestore listeners in test environment.
      };
    }
    const unsubscriberOfAdminEmails = onSnapshot(adminsCollection, (snapshot) => {
      setAdminEmails(snapshot.docs.map((it) => it.id));
    });
    const unsubscriberOfMembers = onSnapshot(membersCollection, (snapshot) => {
      setMembers(snapshot.docs.map((it) => it.data()));
    });
    const unsubscriberOfApprovedMembers = onSnapshot(approvedMembersCollection, (snapshot) => {
      setApprovedMembers(snapshot.docs.map((it) => it.data()));
    });
    return () => {
      unsubscriberOfAdminEmails();
      unsubscriberOfMembers();
      unsubscriberOfApprovedMembers();
    };
  }, []);

  return (
    <FirestoreDataContext.Provider value={{ adminEmails, members, approvedMembers }}>
      {adminEmails == null || members == null || approvedMembers == null ? (
        <Loader active={true} size="massive" />
      ) : (
        children
      )}
    </FirestoreDataContext.Provider>
  );
}
