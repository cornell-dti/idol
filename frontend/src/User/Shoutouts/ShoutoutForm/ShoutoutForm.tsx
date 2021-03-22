import React, { useState } from 'react';
import { Form, TextArea } from 'semantic-ui-react';

const ShoutoutForm: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const sendShoutout = () => {
    if (recipient !== '' && message !== '') {
      console.log('send shoutout');
    }
  };

  return (
    <Form
      style={{
        width: '50%',
        alignSelf: 'center',
        margin: 'auto',
        marginTop: '10vh'
      }}
    >
      <h2 style={{ fontFamily: 'var(--mainFontFamily)', marginBottom: '2vh' }}>
        Give someone a shoutout!
      </h2>

      <Form.Input
        fluid
        label="Who is awesome?"
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
        required
      />

      <Form.Input
        label="Why are they awesome?"
        name="message"
        value={message}
        control={TextArea}
        onChange={(event) => setMessage(event.target.value)}
        style={{ minHeight: '25vh' }}
        required
      />

      <Form.Button floated="right" onClick={sendShoutout}>
        Send
      </Form.Button>
    </Form>
  );
};

export default ShoutoutForm;
