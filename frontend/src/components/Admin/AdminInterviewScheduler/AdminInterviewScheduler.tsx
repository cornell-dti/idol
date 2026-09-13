import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Card, Checkbox, Form, Header, Loader, Message, Modal } from 'semantic-ui-react';
import csvToJson from 'csvtojson';
import styles from './AdminInterviewScheduler.module.css';
import InterviewSchedulerAPI from '../../../API/InterviewSchedulerAPI';
import InterviewSchedulerDeleteModal from '../../Modals/InterviewSchedulerDeleteModal';
import { Emitters } from '../../../utils';

const csvCell = (value: string | undefined) => `"${(value ?? '').replace(/"/g, '""')}"`;

const parseApplicantsCsv = async (csv: File): Promise<[string[], string[][]]> => {
  const rows = await csvToJson({ output: 'csv', noheader: true }).fromString(await csv.text());
  const [rawHeaders = [], ...responses] = rows;
  const headers = rawHeaders.map((header: string) => header.trim().toLowerCase());
  return [headers, responses];
};

const downloadApplicantsCsv = (instance: InterviewScheduler) => {
  const csv = [
    ['Email', 'First Name', 'Last Name', 'NetID'],
    ...instance.applicants.map((applicant) => [
      applicant.email,
      applicant.firstName,
      applicant.lastName,
      applicant.netid
    ])
  ]
    .map((row) => row.map(csvCell).join(','))
    .join('\n');
  const downloadUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${instance.name.replace(/[^a-z0-9-_]/gi, '_')}_applicants.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};

type CreatorProps = {
  setInstances: Dispatch<SetStateAction<InterviewScheduler[]>>;
  formType: 'create' | 'edit';
  instance?: InterviewScheduler;
  onComplete?: () => void;
};

export const InterviewSchedulerCreator: React.FC<CreatorProps> = ({
  setInstances,
  formType,
  instance,
  onComplete
}) => {
  const [name, setName] = useState(instance?.name ?? '');
  const [csv, setCsv] = useState<File>();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    instance ? new Date(instance.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(instance ? new Date(instance.endDate) : null);
  const [duration, setDuration] = useState(instance ? instance.duration / 60000 : 30);
  const [membersPerSlot, setMembersPerSlot] = useState(instance?.membersPerSlot ?? 1);

  useEffect(() => {
    setName(instance?.name ?? '');
    setCsv(undefined);
    if (csvInputRef.current) csvInputRef.current.value = '';
    setStartDate(instance ? new Date(instance.startDate) : null);
    setEndDate(instance ? new Date(instance.endDate) : null);
    setDuration(instance ? instance.duration / 60000 : 30);
    setMembersPerSlot(instance?.membersPerSlot ?? 1);
  }, [instance]);

  const onSubmit = async () => {
    const selectedCsv = csv ?? csvInputRef.current?.files?.[0];
    if (!selectedCsv) {
      Emitters.generalError.emit({
        headerMsg: 'Submission Error',
        contentMsg: 'No CSV file was provided.'
      });
      return;
    }
    const [headers, responses] = await parseApplicantsCsv(selectedCsv);
    const requiredHeaders = ['first name', 'last name', 'email', 'netid'];
    const missingHeader = requiredHeaders.find((header) => !headers.includes(header));
    if (missingHeader) {
      Emitters.generalError.emit({
        headerMsg: 'CSV Parsing Error',
        contentMsg: `The CSV file does not contain a column with header: ${missingHeader}`
      });
      return;
    }
    if (name === '') {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Input',
        contentMsg: 'The name must not be empty.'
      });
      return;
    }
    if (duration <= 0 || membersPerSlot <= 0) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Input',
        contentMsg: 'Duration and members per slot must be positive.'
      });
      return;
    }
    if (!startDate || !endDate) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Date',
        contentMsg: 'Start date and end date are required.'
      });
      return;
    }
    const applicants = responses.map((response) => ({
      firstName: response[headers.indexOf('first name')],
      lastName: response[headers.indexOf('last name')],
      email: response[headers.indexOf('email')],
      netid: response[headers.indexOf('netid')]
    }));
    const schedulerFields = {
      name,
      duration: duration * 60000,
      membersPerSlot,
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      applicants
    };

    if (formType === 'edit' && instance) {
      const updatedInstance = await InterviewSchedulerAPI.updateInstance({
        uuid: instance.uuid,
        ...schedulerFields
      });
      setInstances((instances) =>
        instances.map((current) =>
          current.uuid === updatedInstance.uuid ? updatedInstance : current
        )
      );
      Emitters.generalSuccess.emit({
        headerMsg: 'Interview scheduler updated',
        contentMsg: `Updated interview scheduler instance: ${name}`
      });
      onComplete?.();
      return;
    }

    const newInstance: InterviewScheduler = { ...schedulerFields, isOpen: false, uuid: '' };
    const uuid = await InterviewSchedulerAPI.createNewInstance(newInstance);
    setInstances((instances) => [...instances, { ...newInstance, uuid }]);
    Emitters.generalSuccess.emit({
      headerMsg: 'Interview scheduler created',
      contentMsg: `Created interview scheduler instance: ${name}`
    });
    setName('');
    setStartDate(null);
    setEndDate(null);
    setCsv(undefined);
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  return (
    <div>
      <Header as="h2">
        {formType === 'edit'
          ? 'Edit interview scheduler instance'
          : 'Create a new Interview Scheduler instance'}
      </Header>
      <Form>
        <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Header as="h4">Applicants</Header>
        {formType === 'edit' && (
          <Message info>
            Uploading a CSV replaces this instance&apos;s applicant list.
            <Button
              basic
              type="button"
              style={{ marginLeft: '1rem' }}
              onClick={() => instance && downloadApplicantsCsv(instance)}
            >
              Download current applicant CSV
            </Button>
          </Message>
        )}
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => setCsv(e.currentTarget.files?.[0])}
        />
        <label style={{ display: 'block', marginTop: '1rem' }}>
          Format: .csv with at least an &quot;Email&quot;, &quot;NetID&quot;, &quot;First
          Name&quot;, and &quot;Last Name&quot; column (case insensitive).
          <a href="/sample_interview_scheduler_input.csv"> Download sample file</a>
        </label>
        <Header as="h4">Start and end date</Header>
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(date) => {
            const [start, end] = date as [Date | null, Date | null];
            if (start) start.setHours(0, 0, 0, 0);
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Message info>
          <Message.Header>Please note</Message.Header>For non-consecutive days, use the tightest
          range possible. Days with no slots will not be displayed on the applicant side.
        </Message>
        <Header as="h4">Duration (in minutes)</Header>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <Header as="h4">Members Per Slot</Header>
        <input
          type="number"
          value={membersPerSlot}
          onChange={(e) => setMembersPerSlot(Number(e.target.value))}
        />
        <Button type="button" onClick={onSubmit} className={styles.submitButton}>
          {formType === 'edit'
            ? 'Save Interview Scheduler Instance'
            : 'Create Interview Scheduler Instance'}
        </Button>
      </Form>
    </div>
  );
};

type EditorProps = {
  instances: InterviewScheduler[];
  setInstances: Dispatch<SetStateAction<InterviewScheduler[]>>;
};

export const InterviewSchedulerEditor = ({ instances, setInstances }: EditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [editingInstance, setEditingInstance] = useState<InterviewScheduler>();
  useEffect(() => {
    InterviewSchedulerAPI.getAllInstances(false).then((loadedInstances) => {
      setInstances(loadedInstances);
      setIsLoading(false);
    });
  }, [setInstances]);

  const toggleIsOpen = async (uuid: string) => {
    const instance = instances.find((current) => current.uuid === uuid);
    if (!instance) return;
    const updatedInstance = await InterviewSchedulerAPI.updateInstance({
      uuid,
      isOpen: !instance.isOpen
    });
    setInstances((currentInstances) =>
      currentInstances.map((current) =>
        current.uuid === updatedInstance.uuid ? updatedInstance : current
      )
    );
  };

  if (isLoading) return <Loader size="large" />;
  return (
    <div className={styles.editorContainer}>
      <Header as="h2">All Interview Scheduler Instances</Header>
      {instances.length === 0 ? (
        <p>No interview scheduler instances found.</p>
      ) : (
        <Card.Group>
          {instances.map((instance) => (
            <Card key={instance.uuid}>
              <Card.Content>
                <Card.Header>{instance.name}</Card.Header>
                <Card.Meta>{instance.isOpen ? 'Open' : 'Closed'}</Card.Meta>
                <Checkbox
                  toggle
                  checked={instance.isOpen}
                  onChange={() => toggleIsOpen(instance.uuid)}
                />
                <div>
                  <InterviewSchedulerDeleteModal setInstances={setInstances} uuid={instance.uuid} />
                  <Button onClick={() => setEditingInstance(instance)}>Edit</Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )}
      <Modal open={Boolean(editingInstance)} onClose={() => setEditingInstance(undefined)}>
        <Modal.Header>Edit {editingInstance?.name}</Modal.Header>
        <Modal.Content scrolling>
          {editingInstance && (
            <InterviewSchedulerCreator
              setInstances={setInstances}
              formType="edit"
              instance={editingInstance}
              onComplete={() => setEditingInstance(undefined)}
            />
          )}
        </Modal.Content>
      </Modal>
    </div>
  );
};

const AdminInterviewSchedulerBase = () => {
  const [instances, setInstances] = useState<InterviewScheduler[]>([]);
  return (
    <div className={styles.creatorContainer}>
      <InterviewSchedulerCreator setInstances={setInstances} formType="create" />
      <InterviewSchedulerEditor instances={instances} setInstances={setInstances} />
    </div>
  );
};

export default AdminInterviewSchedulerBase;
