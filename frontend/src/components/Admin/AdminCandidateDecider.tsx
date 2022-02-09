import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

const parseCSV = (str: string, delimiter: string): any[] => {
  return [];
};

const AdminCandidateDeciderBase: React.FC = () => {
  return <CandidateDeciderInstanceCreator />;
};

const CandidateDeciderInstanceCreator: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [responses, setResponses] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = () => {
      setResponses(parseCSV(reader.result as string, ','));
    };
  };

  const handleSubmit = () => {
    console.log('FORM SUBMISSION');
  };

  return (
    <Form>
      <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <Button type="submit" onClick={handleSubmit} disabled={!name || responses.length === 0}>
        Create Candidate Decider Instance
      </Button>
    </Form>
  );
};

export default AdminCandidateDeciderBase;
