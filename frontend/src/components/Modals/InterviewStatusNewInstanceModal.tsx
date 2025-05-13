import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'semantic-ui-react';
import { Emitters } from '../../utils';

export interface NewInstanceModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  existingNames: string[];
}

const InterviewStatusNewInstanceModal: React.FC<NewInstanceModalProps> = ({
  open,
  onClose,
  onCreate,
  existingNames,
}) => {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (existingNames.includes(trimmed)) {
      Emitters.generalError.emit({
        headerMsg: `${trimmed} Instance Already Exists`,
        contentMsg: `Please choose a different name to proceed.`,
      });
      return;
    }
    onCreate(trimmed);
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      closeIcon
    >
      <Modal.Header>Create New Instance</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          placeholder="Enter instance name..."
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button positive onClick={handleCreate}>Create</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InterviewStatusNewInstanceModal;