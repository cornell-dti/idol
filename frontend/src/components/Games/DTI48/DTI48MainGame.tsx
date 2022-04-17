import { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import computeDTI48UpgradeChain from './dti48-upgrade-chain';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import DTI48GameCard from './DTI48GameCard';
import styles from './DTI48MainGame.module.css';

export interface MembersFromAllSemesters {
  readonly [semesterName: string]: readonly IdolMember[];
}

type Props = { readonly membersFromAllSemesters: MembersFromAllSemesters };

export default function DTI48MainGame({ membersFromAllSemesters }: Props): JSX.Element {
  const userEmail = useUserEmail();
  const netID = userEmail.split('@')[0];
  const [semester, setSemester] = useState('Current Semester');
  const [changeIndex, setChangeIndex] = useState(0);
  const [playerNetID, setPlayerNetID] = useState(netID);
  const [searchTyping, setSearchTyping] = useState(false);

  const members = membersFromAllSemesters[semester];

  return (
    <div key={`${playerNetID}-${changeIndex}`}>
      <Dropdown
        placeholder="Select a semester to browse members"
        className={styles.Dropdown}
        fluid
        selection
        options={Object.keys(membersFromAllSemesters).map((semesterId) => ({
          key: semesterId,
          value: semesterId,
          text: semesterId
        }))}
        onChange={(_, data) => setSemester(data.value as string)}
        value={semester}
      />
      <Dropdown
        placeholder="Select a DTI member to play as"
        className={styles.Dropdown}
        fluid
        selection
        search
        options={members.map((member) => ({
          key: member.netid,
          value: member.netid,
          text: `${member.firstName} ${member.lastName} (${member.netid})`
        }))}
        onChange={(_, data) => setPlayerNetID(data.value as string)}
        onClose={() => {
          setChangeIndex((i) => i + 1);
          setSearchTyping(false);
        }}
        value={playerNetID}
        onFocus={() => setSearchTyping(true)}
        onBlur={() => setSearchTyping(false)}
      />
      <DTI48GameCard
        chain={computeDTI48UpgradeChain(playerNetID, members)}
        searchTyping={searchTyping}
      />
    </div>
  );
}
