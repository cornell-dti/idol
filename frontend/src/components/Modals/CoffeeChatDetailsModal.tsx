import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './CoffeeChatDetailsModal.module.css';

type Props = {
  coffeeChat: CoffeeChat | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCoffeeChatRequest: (coffeeChat: CoffeeChat) => void;
};

const CoffeeChatModal: React.FC<Props> = ({
  coffeeChat,
  open,
  setOpen,
  deleteCoffeeChatRequest
}): JSX.Element => (
  <Modal closeIcon open={open} onClose={() => setOpen(false)} size="small">
    {coffeeChat ? (
      <>
        <Modal.Header>
          Coffee Chat with {coffeeChat.otherMember.firstName} {coffeeChat.otherMember.lastName} (
          {coffeeChat.otherMember.netid})
        </Modal.Header>
        <Modal.Content className={styles.modal_content}>
          <p>
            <b>Category:</b> {coffeeChat.category}
          </p>
          <p>
            <b>Image Link:</b>{' '}
            <a href={coffeeChat.slackLink} target="_blank" rel="noopener noreferrer">
              {coffeeChat.slackLink}
            </a>
          </p>
          <p>
            <b>Status:</b> {coffeeChat.status}
          </p>
        </Modal.Content>
        {coffeeChat.status === 'pending' ? (
          <Modal.Actions>
            <Button color="red" onClick={() => deleteCoffeeChatRequest(coffeeChat)}>
              Delete
            </Button>
          </Modal.Actions>
        ) : (
          <></>
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

export default CoffeeChatModal;
