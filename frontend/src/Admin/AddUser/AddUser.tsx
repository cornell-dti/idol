import React from 'react';
import { Card, Loader, Button, Form, Input, Select, TextArea } from 'semantic-ui-react';
import styles from './AddUser.module.css';
import { Member, MembersAPI } from '../../API/MembersAPI';
import ErrorModal from '../../Modals/ErrorModal/ErrorModal';
import Emitters from '../../EventEmitter/constant-emitters';
import RolesAPI from '../../API/RolesAPI';
import APICache from '../../Cache/Cache';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID } from '../../utils';

type AddUserState = {
  currentSelectedMember?: Omit<Member, 'netid' | 'roleDescription'>;
  allMembers?: Member[];
  allRoles?: Role[];
  membersLoaded: boolean;
  isCreatingUser: boolean;
};

class AddUser extends React.Component<Record<string, unknown>, AddUserState> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      currentSelectedMember: undefined,
      allMembers: undefined,
      allRoles: undefined,
      membersLoaded: false,
      isCreatingUser: false
    };
    MembersAPI.getAllMembers().then((mems) => {
      RolesAPI.getAllRoles().then((roles) => {
        this.setState({
          allMembers: mems,
          allRoles: roles,
          currentSelectedMember: mems.length > 0 ? mems[0] : undefined,
          membersLoaded: true
        });
      });
    });
  }

  createNewUser(): void {
    this.setState({
      currentSelectedMember: {
        firstName: '',
        lastName: '',
        email: '',
        role: '' as Role,
        graduation: '',
        major: '',
        doubleMajor: '',
        minor: '',
        website: '',
        linkedin: '',
        github: '',
        hometown: '',
        about: '',
        subteams: [],
        formerSubteams: []
      },
      isCreatingUser: true
    });
  }

  async deleteUser(memberEmail: string): Promise<void> {
    APICache.invalidate('getAllMembers');
    MembersAPI.deleteMember(memberEmail).then((val) => {
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't delete user!",
          contentMsg: val.error
        });
      } else {
        MembersAPI.getAllMembers().then((mems) => {
          this.setState({
            allMembers: mems,
            currentSelectedMember: mems.length > 0 ? mems[0] : undefined,
            isCreatingUser: false
          });
        });
      }
    });
  }

  async setUser(member: Member): Promise<void> {
    APICache.invalidate('getAllMembers');
    MembersAPI.setMember(member).then((val) => {
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't save user!",
          contentMsg: val.error
        });
      } else {
        MembersAPI.getAllMembers().then((mems) => {
          this.setState({ allMembers: mems, isCreatingUser: false });
        });
      }
    });
  }

  render = (): JSX.Element => {
    if (this.state.membersLoaded) {
      return (
        <div className={styles.AddUser} data-testid="AddUser">
          <ErrorModal onEmitter={Emitters.userEditError}></ErrorModal>
          <div className={styles.content}>
            <Card.Group>
              <Card
                style={{
                  width: '20vw',
                  height: 'calc(100vh - 80px - 7rem)',
                  position: 'relative'
                }}
              >
                <h2 className={styles.cardHeader}>Select a User</h2>
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
                    {this.state.allMembers?.map((mem, ind) => (
                      <Card
                        key={ind}
                        style={{
                          marginBottom: '0.25rem',
                          marginTop: '0.5rem',
                          width: 'calc(100% - 1rem)',
                          background:
                            mem.email === this.state.currentSelectedMember?.email
                              ? 'var(--offWhite)'
                              : undefined
                        }}
                        onClick={() => {
                          this.setState({
                            currentSelectedMember: mem,
                            isCreatingUser: false
                          });
                        }}
                      >
                        <Card.Content>
                          <Card.Header style={{ margin: 0}}>
                            {`${mem.firstName} ${mem.lastName}`}
                          </Card.Header>
                          <p
                            style={{
                              margin: 0,
                              color: 'GrayText',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {mem.email}
                          </p>
                        </Card.Content>
                      </Card>
                    ))}
                  </Card.Content>
                </div>
                <Card.Content extra>
                  <div
                    className="ui one buttons"
                    style={{
                      width: '100%'
                    }}
                  >
                    <Button
                      basic
                      color="red"
                      style={{ width: '50%'}}
                      onClick={() => {
                        if (this.state.currentSelectedMember) {
                          this.deleteUser(this.state.currentSelectedMember.email);
                        }
                      }}
                    >
                      Delete User
                    </Button>
                    <Button
                      basic
                      color="blue"
                      style={{ width: '50%' }}
                      onClick={() => {
                        this.createNewUser();
                      }}
                    >
                      Create User
                    </Button>
                  </div>
                </Card.Content>
              </Card>
              {this.state.currentSelectedMember !== undefined ? (
                <Card
                  style={{
                    width: 'calc(80vw - 6rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    position: 'relative'
                  }}
                >
                  <Card.Content className={styles.cardContent}>
                    <h2 className={styles.cardHeader}>
                      {`${this.state.currentSelectedMember.firstName} ${this.state.currentSelectedMember.lastName}`}
                    </h2>
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={Input}
                          label="First Name"
                          placeholder="First Name"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  firstName: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.firstName}
                        />
                        <Form.Field
                          control={Input}
                          label="Last Name"
                          placeholder="Last Name"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  lastName: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.lastName}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        {this.state.isCreatingUser ? (
                          <Form.Field
                            control={Input}
                            label="Email"
                            placeholder="Email"
                            fluid
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              if (this.state.currentSelectedMember) {
                                this.setState({
                                  currentSelectedMember: {
                                    ...this.state.currentSelectedMember,
                                    email: event.target.value
                                  }
                                });
                              }
                            }}
                            value={this.state.currentSelectedMember?.email}
                          />
                        ) : (
                          <Form.Field
                            control={Input}
                            label="Email"
                            placeholder="Email"
                            readOnly
                            fluid
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              if (this.state.currentSelectedMember) {
                                this.setState({
                                  currentSelectedMember: {
                                    ...this.state.currentSelectedMember,
                                    email: event.target.value
                                  }
                                });
                              }
                            }}
                            value={this.state.currentSelectedMember?.email}
                          />
                        )}
                        <Form.Field
                          control={Select}
                          label="Role"
                          options={this.state.allRoles?.map((val) => ({
                            key: val,
                            text: val,
                            value: val
                          }))}
                          placeholder="Role"
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                            data: HTMLInputElement
                          ) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  role: data.value as Role
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember.role || ''}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={Input}
                          label="Graduation"
                          placeholder="Graduation"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  graduation: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.graduation}
                        />
                        <Form.Field
                          control={Input}
                          label="Hometown"
                          placeholder="Hometown"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  hometown: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.hometown}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={Input}
                          label="Major"
                          placeholder="Major"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  major: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.major}
                        />
                        <Form.Field
                          control={Input}
                          label="Double Major"
                          placeholder="Double Major"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  doubleMajor: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember.doubleMajor || ''}
                        />
                        <Form.Field
                          control={Input}
                          label="Minor"
                          placeholder="Minor"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  minor: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember.minor || ''}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={TextArea}
                          label="About"
                          placeholder="About"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  about: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.about}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={Input}
                          label="Website"
                          placeholder="Website"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  website: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember.website || ''}
                        />
                        <Form.Field
                          control={Input}
                          label="LinkedIn"
                          placeholder="LinkedIn"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  linkedin: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember.linkedin || ''}
                        />
                        <Form.Field
                          control={Input}
                          label="GitHub"
                          placeholder="GitHub"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  github: event.target.value
                                }
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember.github || ''}
                        />
                      </Form.Group>
                    </Form>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui one buttons" style={{ width: '100%' }}>
                      <Button
                        basic
                        color="green"
                        onClick={() => {
                          if (this.state.currentSelectedMember) {
                            const partialMember = this.state.currentSelectedMember;
                            this.setUser({
                              ...partialMember,
                              netid: getNetIDFromEmail(partialMember.email),
                              roleDescription: getRoleDescriptionFromRoleID(partialMember.role)
                            });
                          }
                        }}
                      >
                        Save User
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
    return <Loader data-testid="AddUser" active={true} size="massive" />;
  };
}

export default AddUser;
