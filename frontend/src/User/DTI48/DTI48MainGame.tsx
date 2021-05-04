import { useState, useContext } from 'react';
import { Dropdown } from 'semantic-ui-react';
import computeDTI48UpgradeChain from './dti48-upgrade-chain';
import { UserContext } from '../../UserProvider/UserProvider';
import DTI48GameCard from './DTI48GameCard';
import styles from './DTI48MainGame.module.css';

type Props = { readonly members: readonly IdolMember[] };

export default function DTI48MainGame({ members }: Props): JSX.Element {
  const userEmail = useContext(UserContext).user?.email ?? '@cornell.edu';
  const netID = userEmail.split('@')[0];
  const [playerNetID, setPlayerNetID] = useState(netID);

  return (
    <div>
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
      />
      <DTI48GameCard
        key={playerNetID}
        chain={computeDTI48UpgradeChain(playerNetID, members)}
      />
    </div>
  );
}
