import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './CoffeeChatDetailsModal.module.css';
import CoffeeChatAPI from '../../API/CoffeeChatAPI';

type Props = {
  coffeeChat?: CoffeeChat;
  category: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCoffeeChatRequest: (coffeeChat: CoffeeChat) => void;
  userInfo: IdolMember;
};

const CoffeeChatModal: React.FC<Props> = ({
  coffeeChat,
  category,
  open,
  setOpen,
  deleteCoffeeChatRequest,
  userInfo
}) => {
  const [membersInCategory, setMembersInCategory] = useState<MemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      let suggestions: CoffeeChatSuggestions = {};
      try {
        suggestions = await CoffeeChatAPI.getCoffeeChatSuggestions(userInfo.email);
      } catch (error) {
        suggestions = {};
      }
      // const categoryMap = new Map<string, MemberDetails[]>(Object.entries(result || {}));
      setMembersInCategory(suggestions[category] || []);
      setIsLoading(false);
    };

    fetchMembers();
  }, [category, userInfo.email]);

  return (
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

          {coffeeChat.status !== 'rejected' && (
            <Modal.Actions>
              <Button color="red" onClick={() => deleteCoffeeChatRequest(coffeeChat)}>
                Delete
              </Button>
            </Modal.Actions>
          )}
        </>
      ) : (
        <>
          <Modal.Header>No Submission For Category '{category}'</Modal.Header>
          <Modal.Content>
            <div>
              Member(s) in this category you haven't coffee chatted yet:
              {isLoading && <div style={{ marginTop: '5px' }}>Loading...</div>}
              {!isLoading && membersInCategory.length === 0 && (
                <div style={{ marginTop: '5px' }}>
                  There are no active members who certainly meet this category.
                </div>
              )}
              {!isLoading &&
                membersInCategory.length > 0 &&
                membersInCategory.map((member) => (
                  <div key={member?.netid} style={{ marginTop: '5px' }}>
                    {`${member?.name} (${member?.netid})`}
                  </div>
                ))}
            </div>
          </Modal.Content>
        </>
      )}
    </Modal>
  );
};

const ChatDetail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <p>
    <b>{label}:</b> {value}
  </p>
);

export default CoffeeChatModal;
