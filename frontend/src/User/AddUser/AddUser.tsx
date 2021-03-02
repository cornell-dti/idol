import React from 'react';
import { Card, Loader, Button, Form, Input, Select } from 'semantic-ui-react';
import styles from './AddUser.module.css';
import { Member, MembersAPI } from '../../API/MembersAPI';
import ErrorModal from '../../Modals/ErrorModal/ErrorModal';
import Emitters from '../../EventEmitter/constant-emitters';
import RolesAPI from '../../API/RolesAPI';
import APICache from '../../Cache/Cache';

type AddUserState = {
  currentSelectedMember?: Member;
  allMembers?: Member[];
  allRoles?: string[];
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
      isCreatingUser: false,
    };
    MembersAPI.getAllMembers().then((mems) => {
      RolesAPI.getAllRoles().then((roles) => {
        this.setState({
          allMembers: mems,
          allRoles: roles,
          currentSelectedMember: mems.length > 0 ? mems[0] : undefined,
          membersLoaded: true,
        });
      });
    });
  }

  createNewUser(): void {
    this.setState({
      currentSelectedMember: {
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        graduation: '',
        major: '',
        double_major: '',
        minor: '',
        website: '',
        linkedin_link: '',
        github_link: '',
        hometown: '',
        about: '',
        subteam: '',
        other_subteams: [],
      },
      isCreatingUser: true,
    });
  }

  async deleteUser(member: Member): Promise<void> {
    APICache.invalidate('getAllMembers');
    MembersAPI.deleteMember(member).then((val) => {
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't delete user!",
          contentMsg: val.error,
        });
      } else {
        MembersAPI.getAllMembers().then((mems) => {
          this.setState({
            allMembers: mems,
            currentSelectedMember: mems.length > 0 ? mems[0] : undefined,
            isCreatingUser: false,
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
          contentMsg: val.error,
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
                  height: 'calc(90vh - 7rem)',
                  position: 'relative',
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
                    position: 'relative',
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
                              : undefined,
                        }}
                        onClick={() => {
                          this.setState({
                            currentSelectedMember: mem,
                            isCreatingUser: false,
                          });
                        }}
                      >
                        <Card.Content>
                          <Card.Header style={{ margin: 0 }}>
                            {`${mem.first_name} ${mem.last_name}`}
                          </Card.Header>
                          <p style={{ margin: 0, color: 'GrayText' }}>{mem.email}</p>
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
                      onClick={() => {
                        if (this.state.currentSelectedMember) {
                          this.deleteUser(this.state.currentSelectedMember);
                        }
                      }}
                    >
                      Delete User
                    </Button>
                    <Button
                      basic
                      color="blue"
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
                <Card style={{ width: 'calc(80vw - 6rem)' }}>
                  <Card.Content className={styles.cardContent}>
                    <h2 className={styles.cardHeader}>
                      {`${this.state.currentSelectedMember.first_name} ${this.state.currentSelectedMember.last_name}`}
                    </h2>
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={Input}
                          label="First name"
                          placeholder="First name"
                          onChange={(event: any) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  first_name: event.target.value,
                                },
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.first_name}
                        />
                        <Form.Field
                          control={Input}
                          label="Last name"
                          placeholder="Last name"
                          onChange={(event: any) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  last_name: event.target.value,
                                },
                              });
                            }
                          }}
                          value={this.state.currentSelectedMember?.last_name}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        {this.state.isCreatingUser ? (
                          <Form.Field
                            control={Input}
                            label="Email"
                            placeholder="Email"
                            fluid
                            onChange={(event: any) => {
                              if (this.state.currentSelectedMember) {
                                this.setState({
                                  currentSelectedMember: {
                                    ...this.state.currentSelectedMember,
                                    email: event.target.value,
                                  },
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
                            onChange={(event: any) => {
                              if (this.state.currentSelectedMember) {
                                this.setState({
                                  currentSelectedMember: {
                                    ...this.state.currentSelectedMember,
                                    email: event.target.value,
                                  },
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
                            value: val,
                          }))}
                          placeholder="Role"
                          onChange={(event: any, data: any) => {
                            if (this.state.currentSelectedMember) {
                              this.setState({
                                currentSelectedMember: {
                                  ...this.state.currentSelectedMember,
                                  role: data.value,
                                },
                              });
                            }
                          }}
                          value={
                            this.state.currentSelectedMember?.role
                              ? this.state.currentSelectedMember?.role
                              : ''
                          }
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
                            this.setUser(this.state.currentSelectedMember);
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
