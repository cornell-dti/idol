import { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';

type Props = {
  uuid: string;
  getAllInstances: () => Promise<void>;
};

const CandidateDeciderDeleteModal: React.FC<Props> = ({ uuid, getAllInstances }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      trigger={<Button negative>Delete</Button>}
    >
      <Modal.Header>Are you sure you want to delete this Candidate Decider Instance?</Modal.Header>
      <Modal.Description>
        Deleting this instance will delete all candidate data as well as the associated ratings and
        comments
      </Modal.Description>
      <Modal.Actions>
        <Button negative onClick={() => setIsOpen(false)}>
          No
        </Button>
        <Button
          positive
          onClick={() => {
            CandidateDeciderAPI.deleteInstance(uuid).then(() => getAllInstances());
            setIsOpen(false);
          }}
        >
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CandidateDeciderDeleteModal;
