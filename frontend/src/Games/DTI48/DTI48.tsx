import { useState, useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import { MembersAPI } from '../../API/MembersAPI';
import DTI48MainGame, { MembersFromAllSemesters } from './DTI48MainGame';
import styles from './DTI48.module.css';

async function getMembers(semester?: string): Promise<readonly IdolMember[]> {
  if (semester == null) return MembersAPI.getAllMembers(true);
  return fetch(`/members-archive/members-${semester}.json`)
    .then((response) => response.json())
    .then((json) => json.members);
}

async function getMembersFromAllSemesters(): Promise<MembersFromAllSemesters> {
  const [currentSemesterMembers, sp21Members] = await Promise.all([
    getMembers(),
    getMembers('sp21')
  ]);
  return {
    'Current Semester': currentSemesterMembers,
    'Spring 2021': sp21Members
  };
}

export default function DTI48(): JSX.Element {
  const [allMembers, setAllMembers] = useState<MembersFromAllSemesters | null>(null);

  useEffect(() => {
    getMembersFromAllSemesters().then((allMembers) => setAllMembers(allMembers));
  }, []);

  return (
    <div className={styles.Container}>
      {allMembers == null && <Loader active={true} size="massive" />}
      {allMembers != null && <DTI48MainGame membersFromAllSemesters={allMembers} />}
    </div>
  );
}
