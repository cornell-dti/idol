import React, { useState } from 'react';
import { Form, Button, Dropdown, DropdownProps } from 'semantic-ui-react';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';

interface AddInterviewStatusFormProps {
  onSuccess: () => void;
}

const AddInterviewStatusForm: React.FC<AddInterviewStatusFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [netid, setNetid] = useState('');
  const [round, setRound] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { key: 'accepted', text: 'Accepted', value: 'Accepted' },
    { key: 'rejected', text: 'Rejected', value: 'Rejected' },
    { key: 'waitlisted', text: 'Waitlisted', value: 'Waitlisted' },
    { key: 'undecided', text: 'Undecided', value: 'Undecided' },
  ];

  const roleOptions = [
    { key: 'developer', text: 'Developer', value: 'Developer' },
    { key: 'product_manager', text: 'Product Manager', value: 'Product Manager' },
    { key: 'business', text: 'Business', value: 'Business' },
    { key: 'design', text: 'Design', value: 'Design' },
  ];

  const capitalizeWords = (input: string): string => input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const handleSubmit = async () => {
    if (!name || !netid || !round || !role || !status) {
      alert('Please fill out all fields.');
      return;
    }

    const normalizedRound = capitalizeWords(round);

    setIsSubmitting(true);
    try {
      await InterviewStatusAPI.createInterviewStatus({
        name,
        netid,
        round: normalizedRound,
        role,
        status: status as 'Accepted' | 'Rejected' | 'Waitlisted' | 'Undecided', // Ensure correct type
      });
      alert('Interview status added successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error adding interview status:', error);
      alert('Failed to add interview status.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Form>
      <Form.Input
        label="Name"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Form.Input
        label="NetID"
        placeholder="Enter NetID"
        value={netid}
        onChange={(e) => setNetid(e.target.value)}
      />
      <Form.Input
        label="Round"
        placeholder="Enter round (e.g., Technical)"
        value={round}
        onChange={(e) => setRound(e.target.value)}
      />
      <Form.Field>
        <label>Role</label>
        <Dropdown
          placeholder="Select role"
          fluid
          selection
          options={roleOptions}
          value={role}
          onChange={(_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) =>
            setRole(data.value as string)
          }
        />
      </Form.Field>
      <Form.Field>
        <label>Status</label>
        <Dropdown
          placeholder="Select status"
          fluid
          selection
          options={statusOptions}
          value={status}
          onChange={(_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) =>
            setStatus(data.value as string)
          }
        />
      </Form.Field>
      <Button
        primary
        loading={isSubmitting}
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        Add Interview Status
      </Button>
    </Form>
  );
};

export default AddInterviewStatusForm;
