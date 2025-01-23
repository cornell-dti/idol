import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Form, Header } from 'semantic-ui-react';
import styles from './AdminInterviewScheduler.module.css';
import InterviewSchedulerAPI from '../../../API/InterviewSchedulerAPI';

type UploadStatus = {
  readonly status?: 'success' | 'error';
  readonly errs: string[];
};

const InterviewSchedulerCreator = () => {
  const [name, setName] = useState<string>('');
  const [csv, setCsv] = useState<File>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [deadline, setDeadline] = useState<Date>(new Date());
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

    if (errs.length > 0) {
      setUploadStatus({ status: 'error', errs });
      return;
    }

    setApplicants(
      responses.map((response) => ({
        firstName: response[columnHeaders.indexOf('first name')],
        lastName: response[columnHeaders.indexOf('last name')],
        email: response[columnHeaders.indexOf('email')]
      }))
    );

    const uuid = await InterviewSchedulerAPI.createNewInstance({
      name,
      duration,
      membersPerSlot,
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      deadline: deadline.getTime(),
      isOpen: false,
      applicants
    });

    setUploadStatus({
      errs: [uuid],
      status: 'success'
    });
  };

  return (
    <div className={styles.creatorContainer}>
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
            const [start, end] = date as [Date, Date];
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Header as="h4">Deadline</Header>
        <DatePicker
          selected={deadline}
          dateFormat="MMMM do yyyy"
          onChange={(date: Date) => setDeadline(date)}
        />
        <Header as="h4">Duration</Header>
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
          Submit
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

const AdminInterviewSchedulerBase = () => (
  <div>
    <InterviewSchedulerCreator />
  </div>
);

export default AdminInterviewSchedulerBase;
