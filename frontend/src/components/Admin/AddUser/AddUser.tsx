import React, { useState } from 'react';
import { Card, Button, Form, Input, Select, TextArea } from 'semantic-ui-react';
import ALL_ROLES from 'common-types/constants';
import csvtojson from 'csvtojson';
import styles from './AddUser.module.css';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import ErrorModal from '../../Modals/ErrorModal';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, Emitters } from '../../../utils';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { TeamSearch } from '../../Common/Search/Search';

type CurrentSelectedMember = Omit<Member, 'netid' | 'roleDescription'>;

type MemberSubteamEditorProps = {
  readonly title: string;
  readonly subteamKey: 'subteams' | 'formerSubteams';
  readonly member: CurrentSelectedMember;
  readonly setMember: (updater: (m: CurrentSelectedMember) => CurrentSelectedMember) => void;
};

function MemberSubteamEditor({
  title,
  subteamKey,
  member,
  setMember
}: MemberSubteamEditorProps): JSX.Element {
  return (
    <>
      <h4>{title}</h4>
      <TeamSearch
        onSelect={(team) => {
          setMember((m) => ({
            ...m,
            [subteamKey]: [...(m[subteamKey] ?? []), team]
          }));
        }}
      />
      <Card.Group className={styles.subteamEditorCardGroup}>
        {(member[subteamKey] ?? []).map((subteam, ind) => (
          <Card key={ind}>
            <Card.Content>
              <Card.Header>{subteam}</Card.Header>
            </Card.Content>
            <Card.Content extra>
              <div className={`ui one buttons ${styles.fullWidth}`}>
                <Button
                  basic
                  color="red"
                  onClick={() => {
                    setMember((m) => ({
                      ...m,
                      [subteamKey]: (m[subteamKey] ?? []).filter((t) => t !== subteam)
                    }));
                  }}
                >
                  Remove Subteam
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
}

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
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [uploadStatus, setUploadStatus] = useState<string>('');

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

  async function uploadUsersCsv(csvFile: File | undefined): Promise<void> {
    if (csvFile) {
      const csv = await csvFile.text();
      const json = await csvtojson().fromString(csv);
      const allNetIds = allMembers.map((m) => m.netid);
      const members: IdolMember[] = [];
      if (json[0].email) {
        json.forEach((m) => {
          const currMember = allMembers.find((mem) => mem.netid === getNetIDFromEmail(m.email));
          members.push({
            netid: getNetIDFromEmail(m.email),
            email: m.email,
            firstName: m.firstName || currMember?.firstName,
            lastName: m.lastName || currMember?.lastName,
            pronouns: m.pronouns || currMember?.pronouns,
            graduation: m.graduation || currMember?.graduation,
            major: m.major || currMember?.major,
            doubleMajor: m.doubleMajor || currMember?.doubleMajor,
            minor: m.minor || currMember?.minor,
            website: m.website || currMember?.website,
            linkedin: m.linkedin || currMember?.linkedin,
            github: m.github || currMember?.github,
            hometown: m.hometown || currMember?.hometown,
            about: m.about || currMember?.about,
            subteams: [m.subteam] || currMember?.subteams,
            formerSubteams: m.formerSubteams || currMember?.formerSubteams,
            role: m.role || currMember?.role,
            roleDescription: getRoleDescriptionFromRoleID(m.role)
          } as IdolMember);
        });
        members.forEach((m) => {
          if (allNetIds.includes(m.netid)) {
            MembersAPI.updateMember(m);
          } else {
            MembersAPI.setMember(m);
          }
        });
        setUploadStatus(`Uploaded ${members.length} members`);
      } else {
        setUploadStatus('Error: No email field!');
      }
    } else {
      setUploadStatus('Error: No file selected!');
    }
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
          <Card className={styles.userSelector}>
            <h2 className={styles.cardHeader}>Select a User</h2>
            <div className={styles.userSelectorChoices}>
              <Card.Content>
                {allMembers.map((mem, ind) => (
                  <Card
                    key={ind}
                    style={{
                      background:
                        mem.email === state.currentSelectedMember?.email
                          ? 'var(--offWhite)'
                          : undefined
                    }}
                    onClick={() => setState({ currentSelectedMember: mem, isCreatingUser: false })}
                  >
                    <Card.Content>
                      <Card.Header>{`${mem.firstName} ${mem.lastName}`}</Card.Header>
                      <p className={styles.userEmail}>{mem.email}</p>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Content>
            </div>
            <Card.Content>
              <div className={`ui one buttons ${styles.fullWidth}`}>
                <Button
                  basic
                  color="red"
                  className={styles.halfWidth}
                  onClick={() => {
                    if (state.currentSelectedMember) deleteUser(state.currentSelectedMember.email);
                  }}
                >
                  Delete User
                </Button>
                <Button
                  basic
                  color="blue"
                  className={styles.halfWidth}
                  onClick={() => createNewUser()}
                >
                  Create User
                </Button>
              </div>
            </Card.Content>
            <Card.Content>
              <div className={`ui one buttons ${styles.fullWidth}`}>
                <Button
                  basic
                  color="green"
                  className={styles.fullWidth}
                  onClick={() => {
                    uploadUsersCsv(csvFile);
                  }}
                >
                  {csvFile ? `Upload ${csvFile.name}` : 'Choose a CSV file'}
                </Button>
              </div>
              <input
                className={styles.fileUpload}
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0])}
              />
              {uploadStatus ? <p>{uploadStatus}</p> : undefined}
            </Card.Content>
          </Card>
          {state.currentSelectedMember !== undefined ? (
            <Card className={styles.userEditor}>
              <Card.Content>
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
              <Card.Content>
                <MemberSubteamEditor
                  title="Subteams"
                  subteamKey="subteams"
                  member={state.currentSelectedMember}
                  setMember={setCurrentlySelectedMember}
                />
                <MemberSubteamEditor
                  title="Former Subteams"
                  subteamKey="formerSubteams"
                  member={state.currentSelectedMember}
                  setMember={setCurrentlySelectedMember}
                />
              </Card.Content>
              <Card.Content extra>
                <div className={`ui one buttons ${styles.fullWidth}`}>
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
