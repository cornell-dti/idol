import { useEffect, useState } from 'react';
import { Modal, Button, Card, Header, Form, Message } from 'semantic-ui-react';
import ALL_ROLES from 'common-types/constants';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import { MemberSearch, RoleSearch } from '../Common/Search/Search';
import styles from './CandidateDeciderEditModal.module.css';

const allNonleadRoles: { role: Role }[] = ALL_ROLES.filter((role) => role !== 'lead').map(
  (role) => ({ role })
);

type Props = {
  uuid: string;
  setInstances: React.Dispatch<React.SetStateAction<CandidateDeciderInfo[]>>;
};

const CandidateDeciderEditModal: React.FC<Props> = ({ uuid, setInstances }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [instance, setInstance] = useState<CandidateDeciderInstance>();
  const [authorizedMembers, setAuthorizedMembers] = useState<Array<IdolMember>>([]);
  const [authorizedRoles, setAuthorizedRoles] = useState<Array<Role>>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      CandidateDeciderAPI.getInstance(uuid).then((candidateDeciderInstance) => {
        setInstance(candidateDeciderInstance);
        setAuthorizedMembers(candidateDeciderInstance.authorizedMembers);
        setAuthorizedRoles(candidateDeciderInstance.authorizedRoles);
        setName(candidateDeciderInstance.name);
      });
    }
  }, [isOpen, uuid]);

  const handleSubmit = () => {
    if (instance) {
      const updatedInstance: CandidateDeciderEdit = {
        ...instance,
        name,
        authorizedMembers,
        authorizedRoles,
        isOpen: true
      };
      CandidateDeciderAPI.updateInstance(updatedInstance).then((instance) =>
        setInstances((instances) =>
          instances.map((currInstance) =>
            currInstance.uuid === instance.uuid ? instance : currInstance
          )
        )
      );
      setIsOpen(false);
    }
  };

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      trigger={<Button>Edit</Button>}
    >
      <Modal.Header>{instance ? `Edit ${instance.name}` : ''}</Modal.Header>
      <Modal.Content>
        {instance ? (
          <Form>
            <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
                      onClick={() =>
                        setAuthorizedRoles((roles) => roles.filter((rl) => rl !== role))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </Form>
        ) : (
          <></>
        )}
      </Modal.Content>

      <Modal.Actions>
        <Button negative onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button id={styles.submitButton} type="submit" onClick={handleSubmit} disabled={!name}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CandidateDeciderEditModal;
