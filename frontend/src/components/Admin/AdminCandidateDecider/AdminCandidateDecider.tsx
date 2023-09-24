import React, { useState, useEffect } from 'react';
import { Button, Form, Loader, Header, Message, Card, Checkbox } from 'semantic-ui-react';
import csv from 'csvtojson';
import ALL_ROLES from 'common-types/constants';
import { MemberSearch, RoleSearch } from '../../Common/Search/Search';
import CandidateDeciderAPI from '../../../API/CandidateDeciderAPI';
import CandidateDeciderDeleteModal from '../../Modals/CandidateDeciderDeleteModal';
import styles from './AdminCandidateDecider.module.css';
import CandidateDeciderEditModal from '../../Modals/CandidateDeciderEditModal';
import Link from 'next/link';

const allNonleadRoles: { role: Role }[] = ALL_ROLES.filter((role) => role !== 'lead').map(
  (role) => ({ role })
);

type CandidateDeciderInstancelistProps = {
  instances: CandidateDeciderInfo[];
  setInstances: React.Dispatch<React.SetStateAction<CandidateDeciderInfo[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getAllInstances: () => Promise<void>;
};

type CandidateDeciderInstanceCreatorProps = {
  setInstances: React.Dispatch<React.SetStateAction<CandidateDeciderInfo[]>>;
};

const AdminCandidateDeciderBase: React.FC = () => {
  const [instances, setInstances] = useState<CandidateDeciderInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAllInstances = (): Promise<void> =>
    CandidateDeciderAPI.getAllInstances().then((instances) => setInstances(instances));

  return (
    <div id={styles.adminCandidateDeciderContainer}>
      <CandidateDeciderInstanceCreator setInstances={setInstances} />
      <CandidateDeciderInstanceList
        instances={instances}
        setInstances={setInstances}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        getAllInstances={getAllInstances}
      />
    </div>
  );
};

const CandidateDeciderInstanceCreator = ({
  setInstances
}: CandidateDeciderInstanceCreatorProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[][]>([[]]);
  const [authorizedMembers, setAuthorizedMembers] = useState<IdolMember[]>([]);
  const [authorizedRoles, setAuthorizedRoles] = useState<Role[]>([]);
  const [fileInKey, setFileInKey] = useState('0');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = () => {
      const str = reader.result as string;
      csv({
        output: 'csv',
        noheader: true
      })
        .fromString(str)
        .then((parsedRows) => {
          setResponses(parsedRows.splice(1));
          setHeaders(parsedRows[0]);
        });
    };
  };

  const handleSubmit = () => {
    const instance = {
      uuid: '',
      name,
      headers,
      authorizedMembers,
      authorizedRoles,
      candidates: responses.map((res, i) => ({ id: i, responses: res, comments: [], ratings: [] })),
      isOpen: true
    };
    CandidateDeciderAPI.createNewInstance(instance)
      .then((newInstance) => setInstances((instances) => [...instances, newInstance]))
      .then(() => setSuccess(true))
      .then(() => {
        setName('');
        setHeaders([]);
        setResponses([[]]);
        setAuthorizedMembers([]);
        setAuthorizedRoles([]);
        setFileInKey(Date.now().toString());
      });
  };

  return (
    <div>
      <Header as="h2">Create a new Candidate Decider instance</Header>
      <Form success={success}>
        <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="file" accept=".csv" onChange={handleFileUpload} key={fileInKey || ''} />
        <label>
          {' '}
          Format: .csv with at least a "NetID", "First Name", and "Last Name" column.{' '}
          <a href="/sample_candidate_decider_input.csv">Download sample file here.</a>
        </label>
        <Message>
          All leads and IDOL admins have permission to all Candidate Decider instances
        </Message>
        <Header as="h4">Add authorized members</Header>
        <MemberSearch
          onSelect={(mem: IdolMember) => setAuthorizedMembers((mems) => [...mems, mem])}
        />
        {authorizedMembers.map((member) => (
          <Card key={member.netid}>
            <Card.Content>
              <Card.Header centered>{`${member.firstName} ${member.lastName}`}</Card.Header>
              <Card.Description>{member.email}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className={`ui one buttons ${styles.fullWidth}`}>
                <Button
                  basic
                  color="red"
                  onClick={() => {
                    setAuthorizedMembers((members) =>
                      members.filter((mem) => mem.email !== member.email)
                    );
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
        <Header as="h4">Add authorized roles</Header>
        <RoleSearch
          roles={allNonleadRoles}
          onSelect={(role) => setAuthorizedRoles((roles) => [...roles, role.role])}
        />
        {authorizedRoles.map((role, i) => (
          <Card key={i}>
            <Card.Content>
              <Card.Header>{role}</Card.Header>
            </Card.Content>
            <Card.Content extra>
              <div className={`ui one buttons ${styles.fullWidth}`}>
                <Button
                  basic
                  color="red"
                  onClick={() => setAuthorizedRoles((roles) => roles.filter((rl) => rl !== role))}
                >
                  Remove
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
        <Message
          success
          header="Form Submitted"
          content="Successfully created a new Candidate Decider instance"
        ></Message>
        <Button
          id={styles.submitButton}
          type="submit"
          onClick={handleSubmit}
          disabled={!name || responses.length === 0}
        >
          Create Candidate Decider Instance
        </Button>
      </Form>
    </div>
  );
};

const CandidateDeciderInstanceList = ({
  instances,
  setInstances,
  isLoading,
  setIsLoading,
  getAllInstances
}: CandidateDeciderInstancelistProps): JSX.Element => {
  useEffect(() => {
    getAllInstances().then(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleIsOpen = async (uuid: string) => {
    const newInstances = await Promise.all(
      instances.map(async (instance) => {
        if (instance.uuid === uuid) {
          await CandidateDeciderAPI.updateInstance({
            isOpen: !instance.isOpen,
            uuid: instance.uuid
          });
          return { ...instance, isOpen: !instance.isOpen };
        }
        return instance;
      })
    );
    setInstances(newInstances);
  };

  return (
    <div id={styles.listContainer}>
      <Header as="h2">All Candidate Decider Instances</Header>
      {isLoading ? (
        <Loader active size="large" />
      ) : (
        <div id={styles.itemsContainer}>
          <Card.Group>
            {instances.map((instance) => (
              <Card color={instance.isOpen ? 'green' : 'red'} key={instance.uuid}>
                <Card.Content>
                  <Card.Header>{instance.name}</Card.Header>
                  <Card.Meta>{instance.isOpen ? 'Open' : 'Closed'}</Card.Meta>
                  <div id={styles.cardButtonContainer}>
                    <Checkbox
                      toggle
                      defaultChecked={instance.isOpen}
                      onChange={() => toggleIsOpen(instance.uuid)}
                    />
                    <div>
                      <CandidateDeciderEditModal uuid={instance.uuid} setInstances={setInstances} />
                      <CandidateDeciderDeleteModal
                        uuid={instance.uuid}
                        setInstances={setInstances}
                      />
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </div>
      )}
    </div>
  );
};

export default AdminCandidateDeciderBase;
