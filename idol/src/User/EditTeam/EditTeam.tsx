import React from 'react';
import styles from './EditTeam.module.css';
import { Card, Loader, Button, Form, Input, Label, Segment } from 'semantic-ui-react';
import ErrorModal from '../../Modals/ErrorModal/ErrorModal';
import { Emitters } from '../../EventEmitter/constant-emitters';
import { APICache } from '../../Cache/Cache';
import { Team, TeamsAPI } from '../../API/TeamsAPI';
import CustomSearch from '../../Common/Search/Search';
import { MembersAPI, Member } from '../../API/MembersAPI';

type EditTeamState = {
  currentSelectedTeam?: Team;
  allTeams?: Team[];
  allMembers?: Member[];
  teamsLoaded: boolean;
  isCreatingTeam: boolean;
}

class EditTeam extends React.Component<any, EditTeamState> {

  constructor(props: any) {
    super(props);
    this.state = {
      currentSelectedTeam: undefined,
      allTeams: undefined,
      allMembers: undefined,
      teamsLoaded: false,
      isCreatingTeam: false,
    };
    TeamsAPI.getAllTeams().then(teams => {
      MembersAPI.getAllMembers().then(mems => {
        this.setState({
          allTeams: teams,
          allMembers: mems,
          currentSelectedTeam: teams.length > 0 ? teams[0] : undefined,
          teamsLoaded: true
        });
      })
    });
  }

  createNewTeam() {
    this.setState({
      currentSelectedTeam: {
        name: '',
        leaders: [],
        members: [],
        uuid: undefined
      },
      isCreatingTeam: true
    });
  }

  async deleteTeam(team: Team): Promise<any> {
    APICache.invalidate("getAllTeams");
    TeamsAPI.deleteTeam(team).then(val => {
      if (val.error) {
        Emitters.teamEditError.emit({
          headerMsg: "Couldn't delete team!",
          contentMsg: val.error
        });
      } else {
        TeamsAPI.getAllTeams().then(teams => {
          this.setState({
            allTeams: teams,
            currentSelectedTeam: teams.length > 0 ? teams[0] : undefined,
            isCreatingTeam: false
          });
        });
      }
    });
  }

  async setTeam(team: Team): Promise<any> {
    APICache.invalidate("getAllTeams");
    TeamsAPI.setTeam(team).then(val => {
      if (val.error) {
        Emitters.teamEditError.emit({
          headerMsg: "Couldn't save team!",
          contentMsg: val.error
        });
      } else {
        TeamsAPI.getAllTeams().then(teams => {
          this.setState({
            allTeams: teams, isCreatingTeam: false,
            currentSelectedTeam: { ...this.state.currentSelectedTeam, uuid: val.team.uuid } as Team
          });
        });
      }
    });
  }

  render = () => {
    if (this.state.teamsLoaded) {
      return (<div className={styles.AddUser} data-testid="EditTeam">
        <ErrorModal onEmitter={Emitters.teamEditError}></ErrorModal>
        <div className={styles.content}>
          <Card.Group>
            <Card style={{
              width: '20vw', height: 'calc(90vh - 7rem)', position: 'relative'
            }}>
              <h2 className={styles.cardHeader}>
                Select a Team
              </h2>
              <div style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-start',
                height: 'calc(100% - 2rem)',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                width: '100%',
                paddingLeft: '1rem',
                overflowY: 'auto',
                position: 'relative'
              }}>
                <Card.Content className={styles.cardContent}>
                  {this.state.allTeams?.map((team, ind) => {
                    return <Card key={ind} style={{
                      marginBottom: '0.25rem', marginTop: '0.5rem',
                      width: 'calc(100% - 1rem)',
                      background:
                        team.name === this.state.currentSelectedTeam?.name ?
                          'var(--offWhite)' : undefined
                    }} onClick={() => {
                      this.setState({
                        currentSelectedTeam: team,
                        isCreatingTeam: false
                      });
                    }}>
                      <Card.Content>
                        <Card.Header style={{ margin: 0 }}>
                          {team.name}
                        </Card.Header>
                        <p style={{ margin: 0, color: 'GrayText' }}>
                          {team.leaders.length + team.members.length + " members"}
                        </p>
                      </Card.Content>
                    </Card>
                  })}
                </Card.Content>
              </div>
              <Card.Content extra>
                <div className='ui one buttons' style={{ width: '100%' }}>
                  <Button basic color='red' onClick={(() => {
                    if (this.state.currentSelectedTeam) {
                      this.deleteTeam(this.state.currentSelectedTeam);
                    }
                  })}>
                    Delete Team
                  </Button>
                  <Button basic color='blue' onClick={(() => {
                    this.createNewTeam();
                  })}>
                    Create Team
                  </Button>
                </div>
              </Card.Content>
            </Card>
            {this.state.currentSelectedTeam !== undefined ?
              <Card style={{ width: 'calc(80vw - 6rem)' }}>
                <Card.Content className={styles.cardContent}>
                  <h2 className={styles.cardHeader}>
                    {this.state.currentSelectedTeam.name}
                  </h2>
                  <Form>
                    <Form.Group widths='equal'>
                      <Form.Field
                        control={Input}
                        label='Name'
                        placeholder='Name'
                        onChange={(event: any, data: any) => {
                          if (this.state.currentSelectedTeam) {
                            this.setState({
                              currentSelectedTeam: { ...this.state.currentSelectedTeam, name: data.value }
                            });
                          }
                        }}
                        value={this.state.currentSelectedTeam?.name}
                      />
                    </Form.Group>
                  </Form>
                  <h4>Leaders</h4>
                  {this.state.allMembers ? <CustomSearch source={this.state.allMembers}
                    resultRenderer={(mem) => {
                      return (<Segment>
                        <h4>{mem.first_name + " " + mem.last_name}</h4>
                        <Label>{mem.email}</Label>
                      </Segment>)
                    }}
                    matchChecker={(query: string, member: Member) => {
                      let queryLower = query.toLowerCase();
                      return member.email.toLowerCase().startsWith(queryLower)
                        || member.first_name.toLowerCase().startsWith(queryLower)
                        || member.last_name.toLowerCase().startsWith(queryLower)
                        || member.role.toLowerCase().startsWith(queryLower)
                        || (member.first_name.toLowerCase() + " "
                          + member.last_name.toLowerCase()).startsWith(queryLower)
                    }}
                    selectCallback={
                      (mem: Member) => {
                        if (this.state.currentSelectedTeam) {
                          this.setState({
                            currentSelectedTeam: {
                              ...this.state.currentSelectedTeam,
                              leaders: this.state.currentSelectedTeam.leaders.concat([mem])
                            }
                          });
                        }
                      }
                    }>
                  </CustomSearch> : undefined}
                  <Card.Group style={{ marginTop: '1rem' }}>
                    {(this.state.currentSelectedTeam
                      ? this.state.currentSelectedTeam.leaders
                      : []).map((member, ind) => {
                        return (<Card key={ind}>
                          <Card.Content>
                            <Card.Header>
                              {member.first_name + " " + member.last_name}
                            </Card.Header>
                            <Card.Description>
                              {member.email}
                            </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            <div className='ui one buttons' style={{ width: '100%' }}>
                              <Button basic color='red' onClick={() => {
                                if (this.state.currentSelectedTeam) {
                                  let newLeaders = this.state.currentSelectedTeam.leaders.filter(mem => mem.email !== member.email);
                                  this.setState({
                                    currentSelectedTeam: {
                                      ...this.state.currentSelectedTeam,
                                      leaders: newLeaders,
                                    }
                                  });
                                }
                              }}>
                                Remove from Team
                  </Button>
                            </div>
                          </Card.Content>
                        </Card>);
                      })}
                  </Card.Group>
                  <h4>Members</h4>
                  {this.state.allMembers ? <CustomSearch source={this.state.allMembers}
                    resultRenderer={(mem) => {
                      return (<Segment>
                        <h4>{mem.first_name + " " + mem.last_name}</h4>
                        <Label>{mem.email}</Label>
                      </Segment>)
                    }}
                    matchChecker={(query: string, member: Member) => {
                      let queryLower = query.toLowerCase();
                      return member.email.toLowerCase().startsWith(queryLower)
                        || member.first_name.toLowerCase().startsWith(queryLower)
                        || member.last_name.toLowerCase().startsWith(queryLower)
                        || member.role.toLowerCase().startsWith(queryLower)
                        || (member.first_name.toLowerCase() + " "
                          + member.last_name.toLowerCase()).startsWith(queryLower)
                    }}
                    selectCallback={
                      (mem: Member) => {
                        if (this.state.currentSelectedTeam) {
                          this.setState({
                            currentSelectedTeam: {
                              ...this.state.currentSelectedTeam,
                              members: this.state.currentSelectedTeam.members.concat([mem])
                            }
                          });
                        }
                      }
                    }>
                  </CustomSearch> : undefined}
                  <Card.Group>
                    {(this.state.currentSelectedTeam
                      ? this.state.currentSelectedTeam.members
                      : []).map((member, ind) => {
                        return (<Card key={ind}>
                          <Card.Content>
                            <Card.Header>
                              {member.first_name + " " + member.last_name}
                            </Card.Header>
                            <Card.Description>
                              {member.email}
                            </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            <div className='ui one buttons' style={{ width: '100%' }}>
                              <Button basic color='red' onClick={() => {
                                if (this.state.currentSelectedTeam) {
                                  let newMembers = this.state.currentSelectedTeam.members.filter(mem => mem.email !== member.email);
                                  this.setState({
                                    currentSelectedTeam: {
                                      ...this.state.currentSelectedTeam,
                                      members: newMembers,
                                    }
                                  });
                                }
                              }}>
                                Remove from Team
                  </Button>
                            </div>
                          </Card.Content>
                        </Card>);
                      })}
                  </Card.Group>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui one buttons' style={{ width: '100%' }}>
                    <Button basic color='green' onClick={() => {
                      if (this.state.currentSelectedTeam) {
                        this.setTeam(this.state.currentSelectedTeam);
                      }
                    }}>
                      Save Team
                  </Button>
                  </div>
                </Card.Content>
              </Card>
              : undefined}
          </Card.Group>
        </div>
      </div >);
    } else {
      return <Loader data-testid="EditTeam" active={true} size="massive" />
    }
  }
}

export default EditTeam;
