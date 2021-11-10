import { Loader } from 'semantic-ui-react';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { membersCollection, approvedMembersCollection } from '../../firebase';
import { useUserEmail } from './UserProvider';

type ListenedFirestoreData = {
  readonly members?: readonly IdolMember[];
  readonly approvedMembers?: readonly IdolMember[];
};

const FirestoreDataContext = createContext<ListenedFirestoreData>({});

export const useApprovedMembers = (): readonly IdolMember[] =>
  useContext(FirestoreDataContext).approvedMembers || [];

export const useMembers = (): readonly IdolMember[] =>
  useContext(FirestoreDataContext).members || [];

/** @returns a member with given `email`, or `undefined` if there is no such member. */
export const useMember = (email: string): IdolMember | undefined =>
  useMembers().find((it) => it.email === email);

/** @returns yourself as a member, or `undefined` if data is not properly initialized. */
export const useSelf = (): IdolMember | undefined => useMember(useUserEmail());

type Props = { readonly children: ReactNode };

export default function FirestoreDataProvider({ children }: Props): JSX.Element {
  const [members, setMembers] = useState<readonly IdolMember[] | undefined>();
  const [approvedMembers, setApprovedMembers] = useState<readonly IdolMember[] | undefined>();
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return () => {
        // Do not run firestore listeners in test environment.
      };
    }
    const unsubscriberOfMembers = onSnapshot(membersCollection, (snapshot) => {
      console.log(
        'members',
        snapshot.docs.map((it) => it.data())
      );
      setMembers(snapshot.docs.map((it) => it.data()));
    });
    const unsubscriberOfApprovedMembers = onSnapshot(approvedMembersCollection, (snapshot) => {
      console.log(
        'approved-members',
        snapshot.docs.map((it) => it.data())
      );
      setApprovedMembers(snapshot.docs.map((it) => it.data()));
    });
    return () => {
      unsubscriberOfMembers();
      unsubscriberOfApprovedMembers();
    };
  }, []);

  return (
    <FirestoreDataContext.Provider value={{ members, approvedMembers }}>
      {members == null || approvedMembers == null ? (
        <Loader active={true} size="massive" />
      ) : (
        children
      )}
    </FirestoreDataContext.Provider>
  );
}
