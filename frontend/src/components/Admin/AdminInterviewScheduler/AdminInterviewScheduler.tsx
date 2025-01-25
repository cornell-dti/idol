import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Card, Checkbox, Form, Header, Loader } from 'semantic-ui-react';
import styles from './AdminInterviewScheduler.module.css';
import InterviewSchedulerAPI from '../../../API/InterviewSchedulerAPI';
import InterviewSchedulerDeleteModal from '../../Modals/InterviewSchedulerDeleteModal';

type UploadStatus = {
  readonly status?: 'success' | 'error';
  readonly errs: string[];
};

const InterviewSchedulerCreator = () => {
  const [name, setName] = useState<string>('');
  const [csv, setCsv] = useState<File>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [membersPerSlot, setMembersPerSlot] = useState<number>(1);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    errs: []
  });

  const onSubmit = async () => {
    setUploadStatus({ status: undefined, errs: [] });

    if (!csv) {
      setUploadStatus({
        status: 'error',
        errs: ['No csv file has been provided.']
      });
      return;
    }

    const text = await csv.text();
    const rows = text.split('\n').map((row) => row.trim());

    const columnHeaders = rows[0].split(',').map((header) => header.toLowerCase());
    const responses = rows.splice(1).map((row) => row.split(','));
    const requiredHeaders = ['first name', 'last name', 'email'];

    const errs = [];

    requiredHeaders.forEach((header) => {
      if (!columnHeaders.includes(header)) {
        errs.push(`The csv file does not contain a column with header: ${header}`);
      }
    });

    if (name === '') {
      errs.push('The name must not be empty.');
    }

    if (duration < 0) {
      errs.push('The duration must be positive.');
    }

    if (membersPerSlot < 0) {
      errs.push('Members per slot must be positive.');
    }

    if (!startDate || !endDate) {
      errs.push('Start date and end date are undefined.');
    }

    if (errs.length > 0) {
      setUploadStatus({ status: 'error', errs });
      return;
    }

    await InterviewSchedulerAPI.createNewInstance({
      name,
      duration,
      membersPerSlot,
      startDate: (startDate as Date).getTime(),
      endDate: (endDate as Date).getTime(),
      isOpen: false,
      uuid: '',
      applicants: responses.map((response) => ({
        firstName: response[columnHeaders.indexOf('first name')],
        lastName: response[columnHeaders.indexOf('last name')],
        email: response[columnHeaders.indexOf('email')]
      }))
    });

    setUploadStatus({
      errs: [],
      status: 'success'
    });
  };

  return (
    <div>
      <Header as="h2">Create a new Interview Scheduler instance</Header>
      <Form>
        <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Header as="h4">Applicants</Header>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files) setCsv(e.target.files[0]);
          }}
        />
        <label>
          {' '}
          Format: .csv with at least a "Email", "First Name", and "Last Name" column.{' '}
          <a href="/sample_interview_scheduler_input.csv">Download sample file here.</a>
        </label>
        <Header as="h4">Start and end date</Header>
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(date) => {
            const [start, end] = date as [Date | null, Date | null];
            if (start) {
              start.setHours(0, 0, 0, 0);
            }
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Header as="h4">Duration (in minutes)</Header>
        <input
          type="number"
          defaultValue={30}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <Header as="h4">Members Per Slot</Header>
        <input
          type="number"
          defaultValue={1}
          onChange={(e) => setMembersPerSlot(Number(e.target.value))}
        />
        <Button onClick={onSubmit} className={styles.submitButton}>
          Create Interview Scheduler Instance
        </Button>
        {uploadStatus.status && (
          <div
            className={
              uploadStatus.status === 'error'
                ? styles.uploadStatusError
                : styles.uploadStatusSuccess
            }
          >
            <p>
              {uploadStatus.status === 'error'
                ? 'A new interview scheduler could not be created.'
                : 'A new interview scheduler has been successfully created.'}
            </p>
            <ul>
              {uploadStatus.errs.map((err) => (
                <li>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </Form>
    </div>
  );
};

const InterviewSchedulerEditor = () => {
  const [instances, setInstances] = useState<InterviewScheduler[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    InterviewSchedulerAPI.getAllInstances(false).then((instances) => {
      setInstances(instances);
      setIsLoading(false);
    });
  }, []);

  const toggleIsOpen = async (uuid: string) => {
    const newInstances = await Promise.all(
      instances.map(async (instance) => {
        if (instance.uuid === uuid) {
          await InterviewSchedulerAPI.updateInstance({
            uuid: instance.uuid,
            isOpen: !instance.isOpen
          });
          return { ...instance, isOpen: !instance.isOpen };
        }
        return instance;
      })
    );
    setInstances(newInstances);
  };

  return (
    <div className={styles.editorContainer}>
      <Header as="h2">All Interview Scheduler Instances</Header>
      {isLoading ? (
        <Loader size="large" />
      ) : (
        <Card.Group>
          {instances.map((instance) => (
            <Card key={instance.uuid}>
              <Card.Content>
                <Card.Header>{instance.name}</Card.Header>
                <Card.Meta>{instance.isOpen ? 'Open' : 'Closed'}</Card.Meta>
                <div>
                  <Checkbox
                    toggle
                    defaultChecked={instance.isOpen}
                    onChange={() => toggleIsOpen(instance.uuid)}
                  />
                  <div>
                    <InterviewSchedulerDeleteModal
                      setInstances={setInstances}
                      uuid={instance.uuid}
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )}
    </div>
  );
};

const AdminInterviewSchedulerBase = () => (
  <div className={styles.creatorContainer}>
    <InterviewSchedulerCreator />
    <InterviewSchedulerEditor />
  </div>
);

export default AdminInterviewSchedulerBase;
