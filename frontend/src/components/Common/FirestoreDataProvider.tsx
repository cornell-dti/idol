import { Loader } from 'semantic-ui-react';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { adminsCollection, membersCollection, approvedMembersCollection } from '../../firebase';
import { useUserEmail } from './UserProvider';
import { Team } from '../../API/TeamsAPI';
import { allowAdmin } from '../../environment';

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
  return allowAdmin && (self?.role === 'lead' || adminEmails.includes(userEmail));
};

export const useTeamNames = (): readonly string[] => {
  const teamsSet = new Set<string>();
  useMembers().forEach((member) => {
    member.formerSubteams?.forEach((name) => teamsSet.add(name));
    member.subteams?.forEach((name) => teamsSet.add(name));
  });
  return Array.from(teamsSet);
};

export const useTeams = (): readonly Team[] => {
  const allMembers = useMembers();
  const teamsMap = new Map<string, Team>();

  function getTeam(name: string) {
    let team = teamsMap.get(name);
    if (team != null) return team;
    team = { uuid: name, name, leaders: [], members: [], formerMembers: [] };
    teamsMap.set(name, team);
    return team;
  }

  allMembers.forEach((member) => {
    (member.formerSubteams || []).forEach((name) => {
      getTeam(name).formerMembers.push(member);
    });
    (member.subteams || []).forEach((name) => {
      const team = getTeam(name);
      if (member.role === 'pm' || member.role === 'tpm') {
        team.leaders.push(member);
      } else {
        team.members.push(member);
      }
    });
  });

  return Array.from(teamsMap.values());
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
      {
        /* Always render children under test environment */
        process.env.NODE_ENV === 'test' && children
      }
      {adminEmails == null || members == null || approvedMembers == null ? (
        <Loader active={true} size="massive" />
      ) : (
        children
      )}
    </FirestoreDataContext.Provider>
  );
}
