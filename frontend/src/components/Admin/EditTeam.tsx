import React from 'react';
import {
  Card,
  Loader,
  Button,
  Form,
  Input,
  Label,
  Segment,
  StrictRatingIconProps
} from 'semantic-ui-react';
import styles from './EditTeam.module.css';
import ErrorModal from '../Modals/ErrorModal';
import { APICache, Emitters } from '../../utils';
import { Team, TeamsAPI } from '../../API/TeamsAPI';
import CustomSearch from '../Common/Search';
import { MembersAPI, Member } from '../../API/MembersAPI';

type EditTeamState = {
  currentSelectedTeam?: Team;
  allTeams?: Team[];
  allMembers?: Member[];
  teamsLoaded: boolean;
  isCreatingTeam: boolean;
};

class EditTeam extends React.Component<Record<string, unknown>, EditTeamState> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      currentSelectedTeam: undefined,
      allTeams: undefined,
      allMembers: undefined,
      teamsLoaded: false,
      isCreatingTeam: false
    };
    TeamsAPI.getAllTeams().then((teams) => {
      MembersAPI.getAllMembers().then((mems) => {
        this.setState({
          allTeams: teams,
          allMembers: mems,
          currentSelectedTeam: teams.length > 0 ? teams[0] : undefined,
          teamsLoaded: true
        });
      });
    });
  }

  checkMembers(queryLower: string, member: Member): boolean {
    return (
      (member.email && member.email.toLowerCase().startsWith(queryLower)) ||
      (member.firstName && member.firstName.toLowerCase().startsWith(queryLower)) ||
      (member.lastName && member.lastName.toLowerCase().startsWith(queryLower)) ||
      (member.role && member.role.toLowerCase().startsWith(queryLower)) ||
      ((member.firstName &&
        member.lastName &&
        `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}`.startsWith(
          queryLower
        )) as boolean)
    );
  }

  createNewTeam(): void {
    this.setState({
      currentSelectedTeam: {
        name: '',
        leaders: [],
        members: [],
        uuid: undefined,
        formerMembers: []
      },
      isCreatingTeam: true
    });
  }

  async deleteTeam(team: Team): Promise<void> {
    APICache.invalidate('getAllTeams');
    TeamsAPI.deleteTeam(team).then((val) => {
      if (val.error) {
        Emitters.teamEditError.emit({
          headerMsg: "Couldn't delete team!",
          contentMsg: val.error
        });
      } else {
        TeamsAPI.getAllTeams().then((teams) => {
          this.setState({
            allTeams: teams,
            currentSelectedTeam: teams.length > 0 ? teams[0] : undefined,
            isCreatingTeam: false
          });
        });
      }
    });
  }

  async setTeam(team: Team): Promise<void> {
    APICache.invalidate('getAllTeams');
    TeamsAPI.setTeam(team).then((val) => {
      if (val.error) {
        Emitters.teamEditError.emit({
          headerMsg: "Couldn't save team!",
          contentMsg: val.error
        });
      } else {
        TeamsAPI.getAllTeams().then((teams) => {
          this.setState({
            allTeams: teams,
            isCreatingTeam: false,
            currentSelectedTeam: {
              ...this.state.currentSelectedTeam,
              uuid: val.team.uuid
            } as Team
          });
        });
      }
    });
  }

  render = (): JSX.Element => {
    if (this.state.teamsLoaded) {
      return (
        <div className={styles.AddUser} data-testid="EditTeam">
          <ErrorModal onEmitter={Emitters.teamEditError}></ErrorModal>
          <div className={styles.content}>
            <Card.Group>
              <Card
                style={{
                  width: '20vw',
                  height: 'calc(100vh - 80px - 7rem)',
                  position: 'relative'
                }}
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
                    {this.state.allTeams?.map((team, ind) => (
                      <Card
                        key={ind}
                        style={{
                          marginBottom: '0.25rem',
                          marginTop: '0.5rem',
                          width: 'calc(100% - 1rem)',
                          background:
                            team.name === this.state.currentSelectedTeam?.name
                              ? 'var(--offWhite)'
                              : undefined
                        }}
                        onClick={() => {
                          this.setState({
                            currentSelectedTeam: team,
                            isCreatingTeam: false
                          });
                        }}
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
                        if (this.state.currentSelectedTeam) {
                          this.deleteTeam(this.state.currentSelectedTeam);
                        }
                      }}
                    >
                      Delete Team
                    </Button>
                    <Button
                      basic
                      color="blue"
                      style={{ width: '50%' }}
                      onClick={() => {
                        this.createNewTeam();
                      }}
                    >
                      Create Team
                    </Button>
                  </div>
                </Card.Content>
              </Card>
              {this.state.currentSelectedTeam !== undefined ? (
                <Card style={{ width: 'calc(80vw - 6rem)' }}>
                  <Card.Content className={styles.cardContent}>
                    <h2 className={styles.cardHeader}>{this.state.currentSelectedTeam.name}</h2>
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={Input}
                          label="Name"
                          placeholder="Name"
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                            data: HTMLInputElement
                          ) => {
                            if (this.state.currentSelectedTeam) {
                              this.setState({
                                currentSelectedTeam: {
                                  ...this.state.currentSelectedTeam,
                                  name: data.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedTeam?.name}
                        />
                      </Form.Group>
                    </Form>
                    <h4>Leaders</h4>
                    {this.state.allMembers ? (
                      <CustomSearch
                        source={this.state.allMembers}
                        resultRenderer={(mem) => (
                          <Segment>
                            <h4>{`${mem.firstName} ${mem.lastName}`}</h4>
                            <Label>{mem.email}</Label>
                          </Segment>
                        )}
                        matchChecker={(query: string, member: Member) => {
                          const queryLower = query.toLowerCase();
                          return this.checkMembers(queryLower, member);
                        }}
                        selectCallback={(mem: Member) => {
                          if (this.state.currentSelectedTeam) {
                            this.setState({
                              currentSelectedTeam: {
                                ...this.state.currentSelectedTeam,
                                leaders: this.state.currentSelectedTeam.leaders.concat([mem])
                              }
                            });
                          }
                        }}
                      ></CustomSearch>
                    ) : undefined}
                    <Card.Group style={{ marginTop: '1rem' }}>
                      {(this.state.currentSelectedTeam
                        ? this.state.currentSelectedTeam.leaders
                        : []
                      ).map((member, ind) => (
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
                                  if (this.state.currentSelectedTeam) {
                                    const newLeaders =
                                      this.state.currentSelectedTeam.leaders.filter(
                                        (mem) => mem.email !== member.email
                                      );
                                    this.setState({
                                      currentSelectedTeam: {
                                        ...this.state.currentSelectedTeam,
                                        leaders: newLeaders
                                      }
                                    });
                                  }
                                }}
                              >
                                Remove from Team
                              </Button>
                            </div>
                          </Card.Content>
                        </Card>
                      ))}
                    </Card.Group>
                    <h4>Members</h4>
                    {this.state.allMembers ? (
                      <CustomSearch
                        source={this.state.allMembers}
                        resultRenderer={(mem) => (
                          <Segment>
                            <h4>{`${mem.firstName} ${mem.lastName}`}</h4>
                            <Label>{mem.email}</Label>
                          </Segment>
                        )}
                        matchChecker={(query: string, member: Member) => {
                          const queryLower = query.toLowerCase();
                          return this.checkMembers(queryLower, member);
                        }}
                        selectCallback={(mem: Member) => {
                          if (this.state.currentSelectedTeam) {
                            this.setState({
                              currentSelectedTeam: {
                                ...this.state.currentSelectedTeam,
                                members: this.state.currentSelectedTeam.members.concat([mem])
                              }
                            });
                          }
                        }}
                      ></CustomSearch>
                    ) : undefined}
                    <Card.Group>
                      {(this.state.currentSelectedTeam
                        ? this.state.currentSelectedTeam.members
                        : []
                      ).map((member, ind) => (
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
                                  if (this.state.currentSelectedTeam) {
                                    const newMembers =
                                      this.state.currentSelectedTeam.members.filter(
                                        (mem) => mem.email !== member.email
                                      );
                                    this.setState({
                                      currentSelectedTeam: {
                                        ...this.state.currentSelectedTeam,
                                        members: newMembers
                                      }
                                    });
                                  }
                                }}
                              >
                                Remove from Team
                              </Button>
                            </div>
                          </Card.Content>
                        </Card>
                      ))}
                    </Card.Group>
                    <h4>Former Members</h4>
                    {this.state.allMembers ? (
                      <CustomSearch
                        source={this.state.allMembers}
                        resultRenderer={(mem) => (
                          <Segment>
                            <h4>{`${mem.firstName} ${mem.lastName}`}</h4>
                            <Label>{mem.email}</Label>
                          </Segment>
                        )}
                        matchChecker={(query: string, member: Member) => {
                          const queryLower = query.toLowerCase();
                          return this.checkMembers(queryLower, member);
                        }}
                        selectCallback={(mem: Member) => {
                          if (this.state.currentSelectedTeam) {
                            this.setState({
                              currentSelectedTeam: {
                                ...this.state.currentSelectedTeam,
                                formerMembers: this.state.currentSelectedTeam.formerMembers.concat([
                                  mem
                                ])
                              }
                            });
                          }
                        }}
                      ></CustomSearch>
                    ) : undefined}
                    <Card.Group style={{ marginTop: '1rem' }}>
                      {(this.state.currentSelectedTeam
                        ? this.state.currentSelectedTeam.formerMembers
                        : []
                      ).map((member, ind) => (
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
                                  if (this.state.currentSelectedTeam) {
                                    const newFormerMembers =
                                      this.state.currentSelectedTeam.formerMembers.filter(
                                        (mem) => mem.email !== member.email
                                      );
                                    this.setState({
                                      currentSelectedTeam: {
                                        ...this.state.currentSelectedTeam,
                                        formerMembers: newFormerMembers
                                      }
                                    });
                                  }
                                }}
                              >
                                Remove from Team
                              </Button>
                            </div>
                          </Card.Content>
                        </Card>
                      ))}
                    </Card.Group>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui one buttons" style={{ width: '100%' }}>
                      <Button
                        basic
                        color="green"
                        onClick={() => {
                          if (this.state.currentSelectedTeam) {
                            this.setTeam(this.state.currentSelectedTeam);
                          }
                        }}
                      >
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
    return <Loader data-testid="EditTeam" active={true} size="massive" />;
  };
}

export default EditTeam;
