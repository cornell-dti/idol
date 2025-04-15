import { Button, Modal } from 'semantic-ui-react';
import { Dispatch, SetStateAction, useState } from 'react';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';
import { useSetSlotsContext } from '../Interview-Scheduler/SlotHooks';

const InterviewSlotDeleteModal: React.FC<{
  slot: InterviewSlot;
  setSlots: Dispatch<SetStateAction<InterviewSlot[]>>;
}> = ({ slot, setSlots }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedSlot } = useSetSlotsContext();

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      trigger={<Button negative>Delete</Button>}
    >
      <Modal.Header>Are you sure you want to delete this time slot?</Modal.Header>
      <Modal.Actions>
        <Button negative onClick={() => setIsOpen(false)}>
          No
        </Button>
        <Button
          positive
          onClick={() => {
            InterviewSchedulerAPI.deleteSlot(slot.uuid).then(() => {
              setSelectedSlot(undefined);
              setIsOpen(false);
              setSlots((slots) => slots.filter((sl) => sl.uuid !== slot.uuid));
            });
          }}
        >
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InterviewSlotDeleteModal;
