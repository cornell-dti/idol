import { Button, Modal } from 'semantic-ui-react';
import { useState } from 'react';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';
import { Emitters } from '../../utils';

const InterviewSchedulerDeleteModal: React.FC<{
  uuid: string;
  setInstances: React.Dispatch<React.SetStateAction<InterviewScheduler[]>>;
}> = ({ uuid, setInstances }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      trigger={<Button negative>Delete</Button>}
    >
      <Modal.Header>
        Are you sure you want to delete this Interview Scheduler instance?
      </Modal.Header>
      <Modal.Content>
        Deleting this instance will delete all time slots associated with this instance.
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setIsOpen(false)}>
          No
        </Button>
        <Button
          positive
          onClick={() => {
            InterviewSchedulerAPI.deleteInstance(uuid).then(() => {
              setInstances((instances) => instances.filter((inst) => inst.uuid !== uuid));
            });
            setIsOpen(false);
            Emitters.generalSuccess.emit({
              headerMsg: 'Success.',
              contentMsg: 'Successfully deleted interview scheduler instance.'
            });
          }}
        >
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InterviewSchedulerDeleteModal;
