/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Button, Form, Input, Select, TextArea, Dropdown } from 'semantic-ui-react';
import { ALL_COLLEGES, ALL_ROLES, ALL_MAJORS, ALL_MINORS } from 'common-types/constants';
import csvtojson from 'csvtojson';
import styles from './AddUser.module.css';
import { Member, MembersAPI } from '../../../API/MembersAPI';
import ErrorModal from '../../Modals/ErrorModal';
import { getNetIDFromEmail, getRoleDescriptionFromRoleID, Emitters } from '../../../utils';
import { useMembers, useTeams } from '../../Common/FirestoreDataProvider';
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

type UploadStatus = {
  readonly status: 'success' | 'error';
  readonly msg: string;
  readonly errs?: string[];
};

export default function AddUser(): JSX.Element {
  const allMembers = useMembers();
  const validSubteams = useTeams().map((t) => t.name);
  const [state, setState] = useState<State>({
    currentSelectedMember: allMembers[0],
    isCreatingUser: false
  });
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>();
  const [archiveCsvFile, setArchiveCsvFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  function createNewUser(): void {
    setState({
      currentSelectedMember: {
        firstName: '',
        lastName: '',
        pronouns: '',
        email: '',
        role: '' as Role,
        semesterJoined: '',
        graduation: '',
        major: '',
        doubleMajor: '',
        minor: '',
        college: '' as College,
        website: '',
        linkedin: '',
        github: '',
        coffeeChatLink: '',
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
        Emitters.generalSuccess.emit({
          headerMsg: 'Deleting User',
          contentMsg: `You have successfully deleted user with email ${memberEmail}`
        });
      }
    });
  }

  async function setUser(member?: CurrentSelectedMember): Promise<void> {
    if (!member) return;

    // Check that role is selected
    if (!member.role) {
      Emitters.generalError.emit({
        headerMsg: 'Role not selected!',
        contentMsg: 'Please select a role from the dropdown.'
      });
      return;
    }

    // Check that member email is Cornell email
    if (!member.email.includes('@cornell.edu')) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Cornell email!',
        contentMsg:
          'Please enter a valid Cornell email (i.e. abc123@cornell.edu) in the email field.'
      });
      return;
    }

    // Check that college is selected
    if (!member.semesterJoined) {
      Emitters.generalError.emit({
        headerMsg: 'Semester joined not filled in!',
        contentMsg: 'Please fill in the "Semester Joined" field.'
      });
      return;
    }

    MembersAPI.setMember({
      ...member,
      netid: getNetIDFromEmail(member.email),
      roleDescription: getRoleDescriptionFromRoleID(member.role)
    }).then((val) => {
      if (val.error) {
        Emitters.userEditError.emit({
          headerMsg: "Couldn't save user!",
          contentMsg: val.error
        });
      } else {
        setState((s) => ({ ...s, isCreatingUser: false }));
        Emitters.generalSuccess.emit({
          headerMsg: 'Saving User',
          contentMsg: `You have successfully saved ${member.firstName} ${member.lastName}.`
        });
      }
    });
  }

  function processJson(json: any[]): void {
    for (const m of json) {
      const netId = getNetIDFromEmail(m.email);
      const currMember = allMembers.find((mem) => mem.netid === netId);
      if (currMember) {
        const updatedMember = {
          netid: netId,
          email: m.email,
          firstName: m.firstName || currMember.firstName,
          lastName: m.lastName || currMember.lastName,
          pronouns: m.pronouns || currMember.pronouns,
          semesterJoined: m.semesterJoined || currMember.semesterJoined,
          graduation: m.graduation || currMember.graduation,
          major: m.major || currMember.major,
          doubleMajor: m.doubleMajor || currMember.doubleMajor,
          minor: m.minor || currMember.minor,
          college: m.college || currMember.college,
          website: m.website || currMember.website,
          linkedin: m.linkedin || currMember.linkedin,
          github: m.github || currMember.github,
          coffeeChatLink: m.coffeeChatLink || currMember.coffeeChatLink,
          hometown: m.hometown || currMember.hometown,
          about: m.about || currMember.about,
          subteams: m.subteam ? [m.subteam] : currMember.subteams,
          formerSubteams: m.formerSubteams
            ? m.formerSubteams.split(', ')
            : currMember.formerSubteams,
          role: m.role || currMember.role,
          roleDescription: getRoleDescriptionFromRoleID(m.role)
        } as IdolMember;
        MembersAPI.updateMember(updatedMember);
      } else {
        const updatedMember = {
          netid: netId,
          email: m.email,
          firstName: m.firstName || '',
          lastName: m.lastName || '',
          pronouns: m.pronouns || '',
          semesterJoined: m.semesterJoined || '',
          graduation: m.graduation || '',
          major: m.major || '',
          doubleMajor: m.doubleMajor || '',
          minor: m.minor || '',
          college: m.college || ('' as College),
          website: m.website || '',
          linkedin: m.linkedin || '',
          github: m.github || '',
          coffeeChatLink: m.coffeeChatLink || '',
          hometown: m.hometown || '',
          about: m.about || '',
          subteams: m.subteam ? [m.subteam] : [],
          formerSubteams: m.formerSubteams ? m.formerSubteams.split(', ') : [],
          role: m.role || ('' as Role),
          roleDescription: getRoleDescriptionFromRoleID(m.role)
        } as IdolMember;
        MembersAPI.setMember(updatedMember);
      }
    }
  }

  async function uploadUsersCsv(csvFile: File | undefined): Promise<void> {
    if (csvFile) {
      const csv = await csvFile.text();
      const columnHeaders = csv.split('\n')[0].split(',');
      if (!columnHeaders.includes('email')) {
        setUploadStatus({
          status: 'error',
          msg: 'Error: CSV must contain an email column'
        });
        return;
      }
      if (!columnHeaders.includes('role')) {
        setUploadStatus({
          status: 'error',
          msg: 'Error: CSV must contain a role column'
        });
        return;
      }
      const json = await csvtojson().fromString(csv);
      const errors = json
        .map((m) => {
          const [email, role, subteam] = [m.email, m.role, m.subteam];
          const formerSubteams: string[] = m.formerSubteams ? m.formerSubteams.split(', ') : [];
          const err = [];
          if (!email) {
            err.push('missing email');
          }
          if (!role) {
            err.push('missing role');
          }
          if (role && !ALL_ROLES.includes(role as Role)) {
            err.push('invalid role');
          }
          if (subteam && !validSubteams.includes(subteam)) {
            err.push('invalid subteam');
          }
          if (formerSubteams.some((t) => !validSubteams.includes(t))) {
            err.push('at least one invalid former subteam');
          }
          if (formerSubteams.includes(subteam)) {
            err.push('subteam cannot be in former subteams');
          }
          return err.length > 0 ? `Row ${json.indexOf(m) + 1}: ${err.join(', ')}` : '';
        })
        .filter((err) => err.length > 0);
      if (errors.length > 0) {
        setUploadStatus({
          status: 'error',
          msg: `Error: ${errors.length} ${errors.length === 1 ? 'row is' : 'rows are'} invalid!`,
          errs: errors
        });
      } else {
        processJson(json);
        setUploadStatus({
          status: 'success',
          msg: `Successfully uploaded ${json.length} members!`
        });
      }
    }
  }

  function setCurrentlySelectedMember(setter: (m: CurrentSelectedMember) => CurrentSelectedMember) {
    setState((s) => {
      if (!s.currentSelectedMember) return s;
      return { ...s, currentSelectedMember: setter(s.currentSelectedMember) };
    });
  }

  async function processSurvey(survey: File) {
    const fields = ['NetID', 'Returning'];
    const rows = (await survey.text()).split('\n');
    const tokens = rows.map((row) => {
      const words = row.split(',');
      return words.map((word, index) =>
        index === words.length - 1 ? word.substring(0, word.length - 1) : word
      );
    });

    const [netID, returning] = fields.map((field) => tokens[0].indexOf(field));

    if (netID === -1 || returning === -1) {
      return;
    }

    setLoading(true);

    const json: { [key: string]: string[] } = { returning: [], leaving: [] };
    tokens.forEach((row, index) => {
      if (index === 0 || index === rows.length - 1) return;
      if (row[returning].toLowerCase() === 'yes') {
        json.returning.push(row[netID]);
      } else {
        json.leaving.push(row[netID]);
      }
    });

    const archive = await MembersAPI.getArchive(json);

    const download = document.createElement('a');
    download.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(archive))}`;
    download.download = 'archive.json';
    download.click();

    setLoading(false);
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
              <h3>Update Members</h3>
              {csvFile ? (
                <div className={`ui one buttons ${styles.fullWidth}`}>
                  <Button
                    basic
                    color="green"
                    className={styles.fullWidth}
                    onClick={() => {
                      uploadUsersCsv(csvFile);
                    }}
                  >
                    {`Upload ${csvFile.name}`}
                  </Button>
                </div>
              ) : undefined}
              <input
                className={styles.wrap}
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0])}
              />
              <a href="/sample_csv.zip">Download sample .csv file</a>
              {uploadStatus ? (
                <div
                  className={
                    uploadStatus.status === 'error' ? styles.errorMessage : styles.successMessage
                  }
                >
                  <p>{`${uploadStatus.msg}`}</p>
                  {uploadStatus.errs ? (
                    <div>
                      {uploadStatus.errs.map((err) => (
                        <p>{err}</p>
                      ))}
                    </div>
                  ) : undefined}
                </div>
              ) : undefined}
            </Card.Content>
            <Card.Content>
              <h3>Generate Archive</h3>
              {archiveCsvFile ? (
                <div className={`ui one buttons ${styles.fullWidth}`}>
                  <Button
                    basic
                    color="green"
                    className={styles.fullWidth}
                    onClick={() => {
                      processSurvey(archiveCsvFile);
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : `Download Archive: ${archiveCsvFile.name}`}
                  </Button>
                </div>
              ) : undefined}
              <input
                className={styles.wrap}
                type="file"
                accept=".csv"
                onChange={(e) => setArchiveCsvFile(e.target.files?.[0])}
              />
              <a href="/sample_returning_members.csv">Download sample .csv file</a>
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
                      label="Semester Joined"
                      placeholder="Semester Joined"
                      value={state.currentSelectedMember?.semesterJoined}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          semesterJoined: event.target.value
                        }));
                      }}
                    />
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
                      control={Dropdown}
                      label="Major"
                      search
                      selection
                      options={ALL_MAJORS.map((val) => ({ key: val, text: val, value: val }))}
                      placeholder="Search majors..."
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: HTMLInputElement
                      ) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          major: data.value as Major
                        }));
                        setTimeout(() => {
                          const inputElement = (event.target as HTMLInputElement)
                            .closest('.ui.dropdown')
                            ?.querySelector('input.search') as HTMLInputElement | null;
                          if (inputElement) {
                            inputElement.blur();
                          }
                        }, 0);
                      }}
                      value={state.currentSelectedMember?.major}
                    />
                    <Form.Field
                      control={Dropdown}
                      label="Double Major"
                      search
                      selection
                      options={[
                        { key: 'none', text: 'N/A', value: '' },
                        ...ALL_MAJORS.map((val) => ({ key: val, text: val, value: val }))
                      ]}
                      placeholder="Search double majors..."
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: HTMLInputElement
                      ) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          doubleMajor: data.value as Major
                        }));
                        setTimeout(() => {
                          const inputEl = (event.target as HTMLInputElement)
                            .closest('.ui.dropdown')
                            ?.querySelector('input.search') as HTMLInputElement | null;
                          if (inputEl) {
                            inputEl.blur();
                          }
                        }, 0);
                      }}
                      value={state.currentSelectedMember.doubleMajor || ''}
                    />
                    <Form.Field
                      control={Dropdown}
                      search
                      selection
                      label="Minor"
                      options={[
                        { key: 'none', text: 'N/A', value: '' },
                        ...ALL_MINORS.map((val) => ({ key: val, text: val, value: val }))
                      ]}
                      placeholder="Search minors..."
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: HTMLInputElement
                      ) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          minor: data.value as Minor
                        }));
                        setTimeout(() => {
                          const inputEl = (event.target as HTMLInputElement)
                            .closest('.ui.dropdown')
                            ?.querySelector('input.search') as HTMLInputElement | null;
                          if (inputEl) {
                            inputEl.blur();
                          }
                        }, 0);
                      }}
                      value={state.currentSelectedMember.minor || ''}
                    />
                    <Form.Field
                      control={Select}
                      label="College"
                      value={state.currentSelectedMember.college || ''}
                      options={ALL_COLLEGES.map((val) => ({ key: val, text: val, value: val }))}
                      placeholder="College"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: HTMLInputElement
                      ) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          college: data.value as College
                        }));
                      }}
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
                    <Form.Field
                      control={Input}
                      label="Coffee Chat Calendly"
                      placeholder="Coffee Chat Calendly"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentlySelectedMember((currentSelectedMember) => ({
                          ...currentSelectedMember,
                          coffeeChatLink: event.target.value
                        }));
                      }}
                      value={state.currentSelectedMember.coffeeChatLink || ''}
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
                  <Button basic color="green" onClick={() => setUser(state.currentSelectedMember)}>
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
