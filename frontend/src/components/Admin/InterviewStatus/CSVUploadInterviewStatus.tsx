import React, { useState } from 'react';
import { Button, Form, Dropdown, Message } from 'semantic-ui-react';
import csv from 'csvtojson';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import { Emitters } from '../../../utils';
import { DISPLAY_TO_ROLE_MAP, ROUND_OPTIONS } from '../../../consts';

interface CSVUploadProps {
  instanceName: string;
  onDone: () => void;
}

export default function CSVUploadInterviewStatus({ instanceName, onDone }: CSVUploadProps) {
  const [fileKey, setFileKey] = useState(Date.now().toString());
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [selectedRound, setSelectedRound] = useState<Round | ''>('');
  const [loading, setLoading] = useState(false);
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
          setHeaders(parsed[0]);
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

    setLoading(true);
    await Promise.all(
      rows.map((row) => {
        // match headers and values : obj -> accumulator, h -> current element in headers array, i -> index of element
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
    setLoading(false);
  };

  return (
    <Form success={success}>
      <h1>Upload Applicants with a CSV</h1>
      <p>
        CSV must have at least columns: <code>NetID</code>, <code>First Name</code>,{' '}
        <code>Last Name</code>, <code>Role</code>
      </p>
      <Form.Field>
        <Button as="a" href="/Interview Status Input.csv" download>
          Download Sample CSV
        </Button>
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

      <Button onClick={handleSubmit} disabled={loading || rows.length === 0 || !selectedRound}>
        Upload Interview Statuses
      </Button>
    </Form>
  );
}
