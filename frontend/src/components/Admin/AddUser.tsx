import React, { useState } from 'react';
import { Card, Button, Form, Input, Select, TextArea } from 'semantic-ui-react';
import ALL_ROLES from 'common-types/constants';
import styles from './AddUser.module.css';
import { Member, MembersAPI } from '../../API/MembersAPI';
import ErrorModal from '../Modals/ErrorModal';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, APICache, Emitters } from '../../utils';
import { useMembers } from '../Common/FirestoreDataProvider';

type CurrentSelectedMember = Omit<Member, 'netid' | 'roleDescription'>;
type State = {
  readonly currentSelectedMember?: CurrentSelectedMember;
  readonly isCreatingUser: boolean;
};

export default function AddUser(): JSX.Element {
  const allMembers = useMembers();
  const [state, setState] = useState<State>({
    currentSelectedMember: allMembers[0],
    isCreatingUser: false
  });

  function createNewUser(): void {
    setState({
      currentSelectedMember: {
        firstName: '',
        lastName: '',
        pronouns: '',
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

  async function deleteUser(memberEmail: string): Promise<void> {
    MembersAPI.deleteMember(memberEmail).then((val) => {
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't delete user!",
          contentMsg: val.error
        });
      } else {
        setState({ currentSelectedMember: undefined, isCreatingUser: false });
      }
    });
  }

  async function setUser(member: Member): Promise<void> {
    APICache.invalidate('getAllMembers');
    MembersAPI.setMember(member).then((val) => {
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't save user!",
          contentMsg: val.error
        });
      } else {
        setState((s) => ({ ...s, isCreatingUser: false }));
      }
    });
  }

  function setCurrentlySelectedMember(setter: (m: CurrentSelectedMember) => CurrentSelectedMember) {
    setState((s) => {
      if (!s.currentSelectedMember) return s;
      return { ...s, currentSelectedMember: setter(s.currentSelectedMember) };
    });
  }

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
                {allMembers.map((mem, ind) => (
                  <Card
                    key={ind}
                    style={{
                      marginBottom: '0.25rem',
                      marginTop: '0.5rem',
                      width: 'calc(100% - 1rem)',
                      background:
                        mem.email === state.currentSelectedMember?.email
                          ? 'var(--offWhite)'
                          : undefined
                    }}
                    onClick={() => setState({ currentSelectedMember: mem, isCreatingUser: false })}
                  >
                    <Card.Content>
                      <Card.Header style={{ margin: 0 }}>
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
              <div className="ui one buttons" style={{ width: '100%' }}>
                <Button
                  basic
                  color="red"
                  style={{ width: '50%' }}
                  onClick={() => {
                    if (state.currentSelectedMember) deleteUser(state.currentSelectedMember.email);
                  }}
                >
                  Delete User
                </Button>
                <Button basic color="blue" style={{ width: '50%' }} onClick={() => createNewUser()}>
                  Create User
                </Button>
              </div>
            </Card.Content>
          </Card>
          {state.currentSelectedMember !== undefined ? (
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
                  {`${state.currentSelectedMember.firstName} ${state.currentSelectedMember.lastName}`}
                </h2>
                <Form>
                  <Form.Group widths="equal">
                    <Form.Field
                      control={Input}
                      label="First Name"
                      placeholder="First Name"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          firstName: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember?.firstName}
                    />
                    <Form.Field
                      control={Input}
                      label="Last Name"
                      placeholder="Last Name"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          lastName: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember?.lastName}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field
                      control={Input}
                      label="Email"
                      placeholder="Email"
                      readOnly={!state.isCreatingUser}
                      fluid
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          email: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember?.email}
                    />
                    <Form.Field
                      control={Select}
                      label="Role"
                      options={ALL_ROLES.map((val) => ({ key: val, text: val, value: val }))}
                      placeholder="Role"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: HTMLInputElement
                      ) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          role: data.value as Role
                        }));
                      }}
                      value={state.currentSelectedMember.role || ''}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field
                      control={Input}
                      label="Graduation"
                      placeholder="Graduation"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          graduation: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember?.graduation}
                    />
                    <Form.Field
                      control={Input}
                      label="Hometown"
                      placeholder="Hometown"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          hometown: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember?.hometown}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field
                      control={Input}
                      label="Major"
                      placeholder="Major"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          major: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember?.major}
                    />
                    <Form.Field
                      control={Input}
                      label="Double Major"
                      placeholder="Double Major"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          doubleMajor: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember.doubleMajor || ''}
                    />
                    <Form.Field
                      control={Input}
                      label="Minor"
                      placeholder="Minor"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          minor: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember.minor || ''}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field
                      control={TextArea}
                      label="About"
                      placeholder="About"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          about: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember?.about}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Field
                      control={Input}
                      label="Website"
                      placeholder="Website"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          website: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember.website || ''}
                    />
                    <Form.Field
                      control={Input}
                      label="LinkedIn"
                      placeholder="LinkedIn"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          linkedin: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember.linkedin || ''}
                    />
                    <Form.Field
                      control={Input}
                      label="GitHub"
                      placeholder="GitHub"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          github: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember.github || ''}
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
                      if (state.currentSelectedMember) {
                        const partialMember = state.currentSelectedMember;
                        setUser({
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
