import React, { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';

type Props = {
  title: string;
  text: string;
};

const DevPortfolioTextModal: React.FC<Props> = ({ title, text }) => {
  const [viewText, setViewText] = useState(false);
  return (
    <Modal
      onClose={() => setViewText(false)}
      onOpen={() => setViewText(true)}
      open={viewText}
      trigger={<Button fluid>Show Text</Button>}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content image>
        <p>{text}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setViewText(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DevPortfolioTextModal;
