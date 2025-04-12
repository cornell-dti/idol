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

  const roundOptions = [
    { key: 'resume', text: 'Resume', value: 'Resume' },
    { key: 'behavioral', text: 'Behavioral', value: 'Behavioral' },
    { key: 'technical', text: 'Technical', value: 'Technical' },
  ];

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

  const handleSubmit = async () => {
    if (!name || !netid || !round || !role || !status) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await InterviewStatusAPI.createInterviewStatus({
        name,
        netid,
        round,
        role,
        status: status as 'Accepted' | 'Rejected' | 'Waitlisted' | 'Undecided',
      });
      alert('Interview status added successfully!');
      onSuccess();
    } catch (error) {
      alert('Failed to add interview status of applicant.');
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
      <Form.Field>
        <label>Round</label>
        <Dropdown
          placeholder="Select round"
          fluid
          selection
          options={roundOptions}
          value={round}
          onChange={(e, data: DropdownProps) =>
            setRound(data.value as string)
          }
        />
      </Form.Field>
      <Form.Field>
        <label>Role</label>
        <Dropdown
          placeholder="Select role"
          fluid
          selection
          options={roleOptions}
          value={role}
          onChange={(e, data: DropdownProps) =>
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
          onChange={(e, data: DropdownProps) =>
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
