import { useState, useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import { MembersAPI } from '../../API/MembersAPI';
import DTI48MainGame from './DTI48MainGame';
import styles from './DTI48.module.css';

export default function DTI48(): JSX.Element {
  const [allMembers, setAllMembers] = useState<readonly IdolMember[] | null>(
    null
  );

  useEffect(() => {
    MembersAPI.getAllMembers(true).then((result) => {
      setAllMembers(result);
    });
  }, []);

  return (
    <div className={styles.Container}>
      {allMembers == null && <Loader active={true} size="massive" />}
      {allMembers != null && <DTI48MainGame members={allMembers} />}
    </div>
  );
}
