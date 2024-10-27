import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './CoffeeChatDetailsModal.module.css';

type Props = {
  coffeeChat?: CoffeeChat;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCoffeeChatRequest: (coffeeChat: CoffeeChat) => void;
};

const CoffeeChatModal: React.FC<Props> = ({
  coffeeChat,
  open,
  setOpen,
  deleteCoffeeChatRequest
}) => (
  <Modal closeIcon open={open} onClose={() => setOpen(false)} size="small">
    {coffeeChat ? (
      <>
        <Modal.Header>
          Coffee Chat with {coffeeChat.otherMember.firstName} {coffeeChat.otherMember.lastName}{' '}
          {!coffeeChat.isNonIDOLMember ? `(${coffeeChat.otherMember.netid})` : ''}
        </Modal.Header>

        <Modal.Content className={styles.modal_content}>
          <ChatDetail label="Category" value={coffeeChat.category} />
          <ChatDetail
            label="Slack Link"
            value={
              <a href={coffeeChat.slackLink} target="_blank" rel="noopener noreferrer">
                {coffeeChat.slackLink}
              </a>
            }
          />
          <ChatDetail label="Status" value={coffeeChat.status} />
          {coffeeChat.reason && <ChatDetail label="Reason" value={coffeeChat.reason} />}
        </Modal.Content>

        {coffeeChat.status === 'pending' && (
          <Modal.Actions>
            <Button color="red" onClick={() => deleteCoffeeChatRequest(coffeeChat)}>
              Delete
            </Button>
          </Modal.Actions>
        )}
      </>
    ) : (
      <>
        <Modal.Header>No Coffee Chat Submitted</Modal.Header>
        <Modal.Content>
          <p>You have not submitted a coffee chat for this category.</p>
        </Modal.Content>
      </>
    )}
  </Modal>
);

const ChatDetail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <p>
    <b>{label}:</b> {value}
  </p>
);

export default CoffeeChatModal;
