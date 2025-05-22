import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Card, Checkbox, Form, Header, Loader, Message } from 'semantic-ui-react';
import styles from './AdminInterviewScheduler.module.css';
import InterviewSchedulerAPI from '../../../API/InterviewSchedulerAPI';
import InterviewSchedulerDeleteModal from '../../Modals/InterviewSchedulerDeleteModal';
import { Emitters, parseCsv } from '../../../utils';

const InterviewSchedulerCreator = ({
  setInstances
}: {
  setInstances: Dispatch<SetStateAction<InterviewScheduler[]>>;
}) => {
  const [name, setName] = useState<string>('');
  const [csv, setCsv] = useState<File>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [membersPerSlot, setMembersPerSlot] = useState<number>(1);

  const onSubmit = async () => {
    if (!csv) {
      Emitters.generalError.emit({
        headerMsg: 'Submission Error',
        contentMsg: 'No csv file was provided.'
      });
      return;
    }

    const [columnHeaders, responses] = await parseCsv(csv);
    const requiredHeaders = ['first name', 'last name', 'email', 'netid'];

    const missingHeader = requiredHeaders.some((header) => {
      if (!columnHeaders.includes(header)) {
        Emitters.generalError.emit({
          headerMsg: 'CSV Parsing Error',
          contentMsg: `The csv file does not contain a column with header: ${header}`
        });
        return true;
      }
      return false;
    });

    if (missingHeader) return;

    if (name === '') {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Input',
        contentMsg: 'The name must not be empty.'
      });
    } else if (duration < 0) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Duration',
        contentMsg: 'The duration must be positive.'
      });
    } else if (membersPerSlot < 0) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Members per Slot',
        contentMsg: 'Members per slot must be positive.'
      });
    } else if (!startDate || !endDate) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Date',
        contentMsg: 'Start date and end date are undefined.'
      });
    } else {
      const newInstance = {
        name,
        duration: duration * 60000, // convert to milliseconds
        membersPerSlot,
        startDate: (startDate as Date).getTime(),
        endDate: (endDate as Date).getTime(),
        isOpen: false,
        uuid: '',
        applicants: responses.map((response) => ({
          firstName: response[columnHeaders.indexOf('first name')],
          lastName: response[columnHeaders.indexOf('last name')],
          email: response[columnHeaders.indexOf('email')],
          netid: response[columnHeaders.indexOf('netid')]
        }))
      };
      const uuid = await InterviewSchedulerAPI.createNewInstance(newInstance);
      Emitters.generalSuccess.emit({
        headerMsg: 'Successfully created interview scheduler',
        contentMsg: `Created interview scheduler instance: ${name}`
      });
      setName('');
      setStartDate(null);
      setEndDate(null);
      setCsv(undefined);
      setInstances((prev) => [...prev, { ...newInstance, uuid }]);
    }
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
          Format: .csv with at least a "Email", "NetID", "First Name", and "Last Name" column (case
          insensitive).{' '}
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
        <Message info>
          <Message.Header>Please note</Message.Header>
          For non-consecutive days, please use the tightest range possible, such that the start date
          is the first possible interview day. Days with no slots will not be displayed on the
          applicant side.
        </Message>
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
      </Form>
    </div>
  );
};

type InterviewSchedulerEditorProps = {
  instances: InterviewScheduler[];
  setInstances: Dispatch<SetStateAction<InterviewScheduler[]>>;
};

const InterviewSchedulerEditor = ({ instances, setInstances }: InterviewSchedulerEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    InterviewSchedulerAPI.getAllInstances(false).then((instances) => {
      setInstances(instances);
      setIsLoading(false);
    });
  }, [setInstances]);

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

  if (isLoading) {
    return <Loader size="large" />;
  }

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

const AdminInterviewSchedulerBase = () => {
  const [instances, setInstances] = useState<InterviewScheduler[]>([]);

  return (
    <div className={styles.creatorContainer}>
      <InterviewSchedulerCreator setInstances={setInstances} />
      <InterviewSchedulerEditor instances={instances} setInstances={setInstances} />
    </div>
  );
};

export default AdminInterviewSchedulerBase;
