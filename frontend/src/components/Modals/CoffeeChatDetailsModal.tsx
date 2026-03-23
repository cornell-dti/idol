import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './CoffeeChatDetailsModal.module.css';
import CoffeeChatAPI from '../../API/CoffeeChatAPI';
import { Emitters, getChattedOtherNetIds } from '../../utils';

type Props = {
  coffeeChat?: CoffeeChat;
  category: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCoffeeChatRequest: (coffeeChat: CoffeeChat) => void;
  userInfo: IdolMember;
  submittedChats: CoffeeChat[];
  approvedArchivedChats: CoffeeChat[];
};

const CoffeeChatModal: React.FC<Props> = ({
  coffeeChat,
  category,
  open,
  setOpen,
  deleteCoffeeChatRequest,
  userInfo,
  submittedChats,
  approvedArchivedChats
}) => {
  const [suggestions, setSuggestions] = useState<CoffeeChatSuggestions>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let membersInCategory: MemberDetails[] = [];
  if (suggestions && category && category in suggestions) {
    membersInCategory = suggestions[category];
  } else {
    membersInCategory = [];
  }

  const netIdsAlreadyChatted = getChattedOtherNetIds(submittedChats, approvedArchivedChats);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        setSuggestions(await CoffeeChatAPI.getCoffeeChatSuggestions(userInfo.email));
      } catch (error) {
        Emitters.generalError.emit({
          headerMsg: 'Something went wrong',
          contentMsg: 'Could not retrieve coffee chat suggestions.'
        });
      }
      setIsLoading(false);
    };

    fetchMembers();
  }, [userInfo.email]);

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
          <Modal.Header>No Coffee Chat Submitted</Modal.Header>
          <Modal.Content>
            <div className={styles.suggestionsList}>
              {isLoading && <div className={styles.suggestionRow}>Loading...</div>}
              {!isLoading && membersInCategory.length === 0 && (
                <div className={styles.suggestionRow}>
                  You have not submitted a coffee chat for this category.
                </div>
              )}
              {!isLoading && membersInCategory.length > 0 && (
                <div>
                  <div>
                    Member(s) in category '{category}'{' '}
                    <span style={{ fontWeight: 'bold' }}>(not including you)</span>
                  </div>
                  {membersInCategory
                    .sort((m1, m2) => `${m1.name}`.localeCompare(`${m2.name}`))
                    .map((member) => {
                      const netidKey = member?.netid?.trim().toLowerCase() ?? '';
                      const alreadyChatted = netidKey !== '' && netIdsAlreadyChatted.has(netidKey);
                      return (
                        <div
                          key={member?.netid}
                          className={
                            alreadyChatted
                              ? `${styles.suggestionRow} ${styles.suggestionRowAlreadyChatted}`
                              : styles.suggestionRow
                          }
                        >
                          {`${member?.name} (${member?.netid})`}
                        </div>
                      );
                    })}
                </div>
              )}
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
