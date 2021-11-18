import React, { useState } from 'react';
import { Card, Button, Form, Input } from 'semantic-ui-react';
import styles from './EditTeam.module.css';
import ErrorModal from '../Modals/ErrorModal';
import { Emitters } from '../../utils';
import { Team, TeamsAPI } from '../../API/TeamsAPI';
import { MemberSearch } from '../Common/Search';
import { Member } from '../../API/MembersAPI';
import { useTeams } from '../Common/FirestoreDataProvider';

type TeamMemberEditorProps = {
  readonly title: string;
  readonly membersKey: 'leaders' | 'members' | 'formerMembers';
  readonly currentSelectedTeam: Team;
  readonly setCurrentSelectedTeam: (updater: (team: Team) => Team) => void;
};

function TeamMemberEditor({
  title,
  membersKey,
  currentSelectedTeam,
  setCurrentSelectedTeam
}: TeamMemberEditorProps): JSX.Element {
  return (
    <>
      <h4>{title}</h4>
      <MemberSearch
        onSelect={(mem: Member) => {
          setCurrentSelectedTeam((team) => ({
            ...team,
            [membersKey]: team[membersKey].concat([mem])
          }));
        }}
      />
      <Card.Group style={{ marginTop: '1rem' }}>
        {currentSelectedTeam[membersKey].map((member, ind) => (
          <Card key={ind}>
            <Card.Content>
              <Card.Header>{`${member.firstName} ${member.lastName}`}</Card.Header>
              <Card.Description>{member.email}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui one buttons" style={{ width: '100%' }}>
                <Button
                  basic
                  color="red"
                  onClick={() => {
                    setCurrentSelectedTeam((team) => ({
                      ...team,
                      [membersKey]: team[membersKey].filter((mem) => mem.email !== member.email)
                    }));
                  }}
                >
                  Remove from Team
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
}

export default function EditTeam(): JSX.Element {
  const [currentSelectedTeam, setCurrentSelectedTeamAllowUndefined] = useState<Team | undefined>();
  const allTeams = useTeams();

  function createNewTeam(): void {
    setCurrentSelectedTeamAllowUndefined({
      name: '',
      leaders: [],
      members: [],
      uuid: undefined,
      formerMembers: []
    });
  }

  async function deleteTeam(team: Team): Promise<void> {
    TeamsAPI.deleteTeam(team).then((val) => {
      if (val.error) {
        Emitters.teamEditError.emit({
          headerMsg: "Couldn't delete team!",
          contentMsg: val.error
        });
      } else {
        setCurrentSelectedTeamAllowUndefined(undefined);
      }
    });
  }

  async function setTeam(team: Team): Promise<void> {
    TeamsAPI.setTeam(team).then((val) => {
      if (val.error) {
        Emitters.teamEditError.emit({
          headerMsg: "Couldn't save team!",
          contentMsg: val.error
        });
      }
    });
  }

  function setCurrentSelectedTeam(updater: (team: Team) => Team) {
    setCurrentSelectedTeamAllowUndefined((team) => (team ? updater(team) : team));
  }

  return (
    <div className={styles.AddUser} data-testid="EditTeam">
      <ErrorModal onEmitter={Emitters.teamEditError}></ErrorModal>
      <div className={styles.content}>
        <Card.Group>
          <Card
            style={{ width: '20vw', height: 'calc(100vh - 80px - 7rem)', position: 'relative' }}
          >
            <h2 className={styles.cardHeader}>Select a Team</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                height: 'calc(100% - 2rem)',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                width: '100%',
                paddingLeft: '1rem',
                overflowY: 'auto',
                position: 'relative'
              }}
            >
              <Card.Content className={styles.cardContent}>
                {allTeams.map((team, ind) => (
                  <Card
                    key={ind}
                    style={{
                      marginBottom: '0.25rem',
                      marginTop: '0.5rem',
                      width: 'calc(100% - 1rem)',
                      background:
                        team.name === currentSelectedTeam?.name ? 'var(--offWhite)' : undefined
                    }}
                    onClick={() => setCurrentSelectedTeamAllowUndefined(team)}
                  >
                    <Card.Content>
                      <Card.Header style={{ margin: 0 }}>{team.name}</Card.Header>
                      <p style={{ margin: 0, color: 'GrayText' }}>
                        {`${team.leaders.length + team.members.length} members`}
                      </p>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Content>
            </div>
            <Card.Content extra>
              <div className="ui one buttons" style={{ width: '100%' }}>
                <Button
                  basic
                  color="red"
                  style={{ width: '50%' }}
                  onClick={() => {
                    if (currentSelectedTeam) deleteTeam(currentSelectedTeam);
                  }}
                >
                  Delete Team
                </Button>
                <Button basic color="blue" style={{ width: '50%' }} onClick={createNewTeam}>
                  Create Team
                </Button>
              </div>
            </Card.Content>
          </Card>
          {currentSelectedTeam !== undefined ? (
            <Card style={{ width: 'calc(80vw - 6rem)' }}>
              <Card.Content className={styles.cardContent}>
                <h2 className={styles.cardHeader}>{currentSelectedTeam.name}</h2>
                <Form>
                  <Form.Group widths="equal">
                    <Form.Field
                      control={Input}
                      label="Name"
                      placeholder="Name"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: HTMLInputElement
                      ) => setCurrentSelectedTeam((team) => ({ ...team, name: data.value }))}
                      value={currentSelectedTeam.name}
                    />
                  </Form.Group>
                </Form>
                <TeamMemberEditor
                  title="Leaders"
                  membersKey="leaders"
                  currentSelectedTeam={currentSelectedTeam}
                  setCurrentSelectedTeam={setCurrentSelectedTeam}
                />
                <TeamMemberEditor
                  title="Members"
                  membersKey="members"
                  currentSelectedTeam={currentSelectedTeam}
                  setCurrentSelectedTeam={setCurrentSelectedTeam}
                />
                <TeamMemberEditor
                  title="Former Members"
                  membersKey="formerMembers"
                  currentSelectedTeam={currentSelectedTeam}
                  setCurrentSelectedTeam={setCurrentSelectedTeam}
                />
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons" style={{ width: '100%' }}>
                  <Button basic color="green" onClick={() => setTeam(currentSelectedTeam)}>
                    Save Team
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ) : undefined}
        </Card.Group>
      </div>
    </div>
  );
}
