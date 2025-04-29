import React, { useState } from 'react';
import { Form, Button, Dropdown, DropdownProps } from 'semantic-ui-react';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import { Emitters } from '../../../utils';
import { ROLE_OPTIONS, ROUND_OPTIONS, STATUS_OPTIONS } from '../../../consts';

interface AddInterviewStatusFormProps {
  onAddApplicant: (applicant: InterviewStatus) => void;
}

const AddInterviewStatusForm: React.FC<AddInterviewStatusFormProps> = ({ onAddApplicant }) => {
  const [name, setName] = useState('');
  const [netid, setNetid] = useState('');
  const [round, setRound] = useState<Round | ''>('');
  const [role, setRole] = useState<GeneralRole | ''>('');
  const [status, setStatus] = useState<IntStatus | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !netid || !round || !role || !status) {
      Emitters.generalError.emit({
        headerMsg: 'Missing fields!',
        contentMsg: 'Please fill out all of the fields before adding an Interview Status.'
      });
      return;
    }

    setIsSubmitting(true);
    await InterviewStatusAPI.createInterviewStatus({
      name,
      netid,
      round: round as Round,
      role: role as GeneralRole,
      status: status as IntStatus
    });
    const createdApplicant: InterviewStatus = {
      name,
      netid,
      round: round as Round,
      role: role as GeneralRole,
      status: status as IntStatus
    };
    Emitters.generalSuccess.emit({
      headerMsg: 'Interview Status added sucessfully!',
      contentMsg: 'Proceed to Dashboard to view and update their status.'
    });
    setName('');
    setNetid('');
    setRound('');
    setRole('');
    setStatus('');
    onAddApplicant(createdApplicant);
    setIsSubmitting(false);
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
          options={ROUND_OPTIONS}
          value={round}
          onChange={(e, data: DropdownProps) => setRound(data.value as Round)}
        />
      </Form.Field>
      <Form.Field>
        <label>Role</label>
        <Dropdown
          placeholder="Select role"
          fluid
          selection
          options={ROLE_OPTIONS}
          value={role}
          onChange={(e, data: DropdownProps) => setRole(data.value as GeneralRole)}
        />
      </Form.Field>
      <Form.Field>
        <label>Status</label>
        <Dropdown
          placeholder="Select status"
          fluid
          selection
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e, data: DropdownProps) => setStatus(data.value as IntStatus)}
        />
      </Form.Field>
      <Button primary loading={isSubmitting} disabled={isSubmitting} onClick={handleSubmit}>
        Add Interview Status
      </Button>
    </Form>
  );
};

export default AddInterviewStatusForm;
