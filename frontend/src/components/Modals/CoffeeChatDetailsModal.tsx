import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './CoffeeChatDetailsModal.module.css';
import CoffeeChatAPI from '../../API/CoffeeChatAPI';
import { useSelf } from '../Common/FirestoreDataProvider';
import { MembersAPI } from '../../API/MembersAPI';

type Props = {
  coffeeChat?: CoffeeChat;
  category: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCoffeeChatRequest: (coffeeChat: CoffeeChat) => void;
  approvedChats: CoffeeChat[];
  pendingChats: CoffeeChat[];
};

const CoffeeChatModal: React.FC<Props> = ({
  coffeeChat,
  category,
  open,
  setOpen,
  deleteCoffeeChatRequest,
  approvedChats,
  pendingChats
}) => {
  const userInfo = useSelf()!;
  const [members, setMembers] = useState<IdolMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [membersInCategory, setMembersInCategory] = useState<(IdolMember | undefined)[]>([]);

  useEffect(() => {
    MembersAPI.getAllMembers().then((mem) => {
      setMembers(mem);
    });
  }, []);

  useEffect(() => {
    if (category) {
      setIsLoading(true);

      const filterMembers = async () => {
        const filteredMembers = await Promise.all(
          members.map(async (member) => {
            const result = await CoffeeChatAPI.checkMemberMeetsCategory(member, userInfo, category);
            return result.status === 'pass' ? member : undefined;
          })
        );

        const membersToCategory = filteredMembers.filter((member) => member !== null);

        const getValidMembers = (
          existingChats: CoffeeChat[],
          members: (IdolMember | undefined)[]
        ): (IdolMember | undefined)[] =>
          members.filter(
            (member) =>
              !existingChats.some((chat) => chat.otherMember.netid === member?.netid) &&
              !(member?.netid === userInfo.netid)
          );

        const remainingMembers = getValidMembers(
          [...pendingChats, ...approvedChats],
          membersToCategory
        );
        setMembersInCategory(remainingMembers);

        setIsLoading(false);
      };

      filterMembers();
    }
  }, [members, userInfo, category, pendingChats, approvedChats]);

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
              Members in this category you haven't coffee chatted yet:
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
                    {`${member?.firstName} ${member?.lastName} (${member?.netid})`}
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
