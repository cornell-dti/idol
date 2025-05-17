import React, { useState } from 'react';
import { Form, Dropdown, Message } from 'semantic-ui-react';
import csv from 'csvtojson';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import { Emitters } from '../../../utils';
import { DISPLAY_TO_ROLE_MAP, ROUND_OPTIONS } from '../../../consts';
import styles from './CSVUploadInterviewStatus.module.css';
import Button from '../../Common/Button/Button';

interface CSVUploadProps {
  instanceName: string;
  onDone: () => void;
}

export default function CSVUploadInterviewStatus({ instanceName, onDone }: CSVUploadProps) {
  const [fileKey, setFileKey] = useState(Date.now().toString());
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [selectedRound, setSelectedRound] = useState<Round | ''>('');
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      csv({ output: 'csv', noheader: true })
        .fromString(reader.result as string)
        .then((parsed) => {
          /* strip quotes and trim whitespace */
          const cleanHeaders = parsed[0].map((h: string) =>
            h.trim().replace(/^[\u201C\u201D"'`]+|[\u201C\u201D"'`]+$/g, '')
          );
          setHeaders(cleanHeaders);
          setRows(parsed.slice(1));
        });
    };
  };

  const handleSubmit = async () => {
    if (!selectedRound) {
      Emitters.generalError.emit({
        headerMsg: 'No round selected',
        contentMsg: 'Please choose a round before uploading'
      });
      return;
    }
    if (rows.length === 0) {
      Emitters.generalError.emit({
        headerMsg: 'No data to upload',
        contentMsg: 'Please upload a valid CSV'
      });
      return;
    }

    const required = ['NetID', 'First Name', 'Last Name', 'Role'];
    const missing = required.filter((h) => !headers.includes(h));
    if (missing.length) {
      Emitters.generalError.emit({
        headerMsg: `Missing column${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`,
        contentMsg: 'Please include all required headers before uploading.'
      });
      return;
    }

    await Promise.all(
      rows.map((row) => {
        const record = headers.reduce<Record<string, string>>(
          (obj, h, i) => ({ ...obj, [h]: row[i] }),
          {}
        );
        const { NetID, 'First Name': first, 'Last Name': last, Role } = record;
        return InterviewStatusAPI.createInterviewStatus({
          instance: instanceName,
          name: `${first} ${last}`,
          netid: NetID,
          round: selectedRound,
          role: DISPLAY_TO_ROLE_MAP[Role],
          status: 'Undecided' as IntStatus
        });
      })
    );

    setSuccess(true);
    Emitters.generalSuccess.emit({
      headerMsg: 'CSV upload successful',
      contentMsg: `All candidates have been added for ${selectedRound}`
    });

    onDone();
    setHeaders([]);
    setRows([]);
    setSelectedRound('');
    setFileKey(Date.now().toString());
  };

  return (
    <Form success={success}>
      <h3>Upload applicants with a CSV</h3>
      <p>
        CSV must have at least columns: <code>NetID</code>, <code>First Name</code>,{' '}
        <code>Last Name</code>, <code>Role</code>
      </p>
      <Form.Field>
        <form action="/Interview Status Input.csv" method="get">
          <Button label="Download Sample CSV" />
        </form>
      </Form.Field>
      <p>Please select the current interview round and then proceed to upload.</p>
      <Form.Field>
        <label>Round</label>
        <Dropdown
          placeholder="Select round"
          fluid
          selection
          options={ROUND_OPTIONS}
          value={selectedRound}
          onChange={(_, { value }) => setSelectedRound(value as Round)}
        />
      </Form.Field>
      <Form.Field>
        <input type="file" accept=".csv" onChange={handleFileUpload} key={fileKey} />
      </Form.Field>
      <Message
        success
        header="Upload complete"
        content={`All candidates created with status "undecided".`}
      />
      <div className={styles.csvButton}>
        <Button variant="primary" label="Upload Interview Statuses" onClick={handleSubmit} />
        {!selectedRound && rows.length !== 0 && (
          <p className={styles.notSelected}>No round selected!</p>
        )}
      </div>
    </Form>
  );
}
