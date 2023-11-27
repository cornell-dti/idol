import React, { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';

type Props = {
  title: string;
  text: string;
  member: IdolMember;
  otherPRs: PullRequestSubmission[] | undefined;
};

type TextProps = {
  text: string;
  member: IdolMember;
  otherPRs: PullRequestSubmission[] | undefined;
};

const DevPortfolioTextModal: React.FC<Props> = ({ title, text, member, otherPRs }) => {
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
        <Modal.Description>
          <Text text={text} member={member} otherPRs={otherPRs} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setViewText(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const Text: React.FC<TextProps> = ({ text, member, otherPRs }) => {
  if (member.role === 'tpm') {
    return <p>{text}</p>;
  }
  return (
    <p>
      <div>
        {member.firstName} {member.lastName} has requested an exception to the normal dev portfolio
        PR requirements. <br />
        These are the PRs submitted for their exception:
      </div>{' '}
      <br />
      {otherPRs ? (
        otherPRs.map((pr) => (
          <a>
            {pr.url} <br />
          </a>
        ))
      ) : (
        <div>No PRs submitted.</div>
      )}
      <br />
      <div>Explanation: {text}</div>
    </p>
  );
};

export default DevPortfolioTextModal;
