import React, { useState, useEffect } from 'react';
import { Button, Form, Loader, Header, Message, Card } from 'semantic-ui-react';
import styles from './AdminCandidateDecider.module.css';
import csv from 'csvtojson';

const mockInstances = [
  {
    name: 'Developer Spring 2022 Recruitment',
    isOpen: true,
    headers: [],
    candidates: [],
    uuid: 'life'
  }
];

const AdminCandidateDeciderBase: React.FC = () => {
  return (
    <div id={styles.adminCandidateDeciderContainer}>
      <CandidateDeciderInstanceCreator />
      <CandidateDeciderInstanceList />
    </div>
  );
};

const CandidateDeciderInstanceCreator: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [responses, setResponses] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = () => {
      const str = reader.result as string;
      const headers = str.slice(0, str.indexOf('\n')).split(',');
      setHeaders(headers);
      csv()
        .fromString(str)
        .then((parsedResponses) => setResponses(parsedResponses));
    };
  };

  const handleSubmit = () => {
    const instance = {
      name,
      headers,
      candidates: responses,
      isOpen: true
    };
    console.log(instance);
    console.log('FORM SUBMITTED');
  };

  return (
    <div>
      <Header as="h2">Create a new Candidate Decider instance</Header>
      <Form success={success}>
        <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <Message
          success
          header="Form Submitted"
          content="Successfully created a new Candidate Decider instance"
        ></Message>
        <Button
          id={styles.submitButton}
          type="submit"
          onClick={handleSubmit}
          disabled={!name || responses.length === 0}
        >
          Create Candidate Decider Instance
        </Button>
      </Form>
    </div>
  );
};

const CandidateDeciderInstanceList: React.FC = () => {
  const [instances, setInstances] = useState<CandidateDeciderInstance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setInstances(mockInstances);
    setIsLoading(false);
  }, []);

  return (
    <div id={styles.listContainer}>
      <Header as="h2">All Candidate Decider Instances</Header>
      {isLoading ? (
        <Loader active size="large" />
      ) : (
        <div id={styles.itemsContainer}>
          <Card.Group>
            {instances.map((instance) => (
              <Card
                color={instance.isOpen ? 'green' : 'red'}
                href={`candidate-decider/${instance.uuid}`}
              >
                <Card.Content>
                  <Card.Header>{instance.name}</Card.Header>
                  <Card.Meta>{instance.isOpen ? 'Open' : 'Closed'}</Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </div>
      )}
    </div>
  );
};

export default AdminCandidateDeciderBase;
