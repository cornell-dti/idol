import { Button, Modal } from 'semantic-ui-react';
import { useState } from 'react';
import { InterviewStatusAPI } from '../../API/InterviewStatusAPI';

export interface DeleteInstanceModalProps {
  instanceName: string;
  open: boolean;
  onClose: () => void;
  onDeleted: (name: string) => void;
}

const InterviewStatusDeleteInstanceModal: React.FC<DeleteInstanceModalProps> = ({
  instanceName,
  open,
  onClose,
  onDeleted
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await InterviewStatusAPI.deleteInterviewStatusInstance(instanceName);
    onDeleted(instanceName);
    setIsDeleting(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="small" closeIcon>
      <Modal.Header>Confirm Delete</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete instance “{instanceName}” and all its statuses?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button negative onClick={handleDelete} loading={isDeleting}>
          Delete instance
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InterviewStatusDeleteInstanceModal;
