import React, { useEffect, useMemo, useState } from 'react';
import { Card, Message, Button, Loader, Dropdown } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CoffeeChatReview from './CoffeeChatReview';
import styles from './CoffeeChatDetails.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';
import { ALL_STATUS } from '../../../consts';

type CoffeeChatDisplayProps = {
  status: Status;
  coffeeChats: CoffeeChat[];
};

const CoffeeChatDisplay: React.FC<CoffeeChatDisplayProps> = ({ status, coffeeChats }) => {
  const filteredChats = coffeeChats.filter((res) => res.status === status);

  return (
    <>
      {filteredChats && filteredChats.length !== 0 ? (
        <Card.Group className={styles.cards}>
          {filteredChats.map((chat, i) => (
            <Card className={styles.memberCard} key={i}>
              <Card.Content>
                <Card.Header>
                  {chat.submitter.firstName} {chat.submitter.lastName} ({chat.submitter.netid})
                </Card.Header>
                <Card.Meta>
                  Coffee Chat with {chat.otherMember.firstName} {chat.otherMember.lastName}{' '}
                  {!chat.isNonIDOLMember ? `(${chat.otherMember.netid})` : ''}
                </Card.Meta>
                <a href={chat.slackLink} target="_blank" rel="noopener noreferrer">
                  Slack link
                </a>
                {status === 'rejected' && chat.reason && (
                  <Card.Description>
                    <strong>Rejection Reason:</strong> {chat.reason}
                  </Card.Description>
                )}
              </Card.Content>
              <Card.Content extra>
                <CoffeeChatReview coffeeChat={chat} currentStatus={status}></CoffeeChatReview>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      ) : (
        <Message>There are currently no {status} members for this event.</Message>
      )}
    </>
  );
};

const CoffeeChatDetails: React.FC = () => {
  const router = useRouter();
  const category = Array.isArray(router.query.category)
    ? router.query.category[0]
    : router.query.category;

  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status | string>();
  const [coffeeChats, setCoffeeChats] = useState<CoffeeChat[]>([]);

  useEffect(() => {
    CoffeeChatAPI.getAllCoffeeChats().then((chats) => setCoffeeChats(chats));
  }, []);

  const categoryToChats = useMemo(() => {
    const map = new Map<string, CoffeeChat[]>([['default', []]]);

    coffeeChats.forEach((chat) => {
      if (!map.has(chat.category)) {
        map.set(chat.category, []);
      }
      map.get(chat.category)!.push(chat);
    });

    return map;
  }, [coffeeChats]);

  useEffect(() => {
    const cb = () => {
      setLoading(true);
    };
    Emitters.coffeeChatsUpdated.subscribe(cb);
    return () => {
      Emitters.coffeeChatsUpdated.unsubscribe(cb);
    };
  });

  useEffect(() => {
    if (isLoading) {
      CoffeeChatAPI.getAllCoffeeChats().then((chats) => {
        setCoffeeChats(chats);
        setLoading(false);
      });
    }
  }, [isLoading, category]);

  if (isLoading) return <Loader active />;

  return (
    <div className={styles.container}>
      <div className={styles.arrowAndButtons}>
        <Link href="/admin/coffee-chats">
          <span className={styles.arrow}>&#8592;</span>
        </Link>
      </div>

      <h1 className={styles.categoryName}>Category: {category}</h1>

      <div className={styles.listsContainer}>
        <div className={styles.listContainer}>
          <div className={styles.rowDirection}>
            <div className={styles.dropdown}>
              <label className={styles.bold}>Select Status:</label>
              <Dropdown
                placeholder="Select Status"
                fluid
                selection
                value={status || ''}
                options={ALL_STATUS.map((status) => ({
                  text: status,
                  value: status
                }))}
                onChange={(_, data) => {
                  setStatus(data.value as Status);
                }}
              />
            </div>

            {status && (
              <div className={styles.inline}>
                <Button
                  onClick={() => {
                    setStatus(undefined);
                  }}
                >
                  View All
                </Button>
              </div>
            )}
          </div>
        </div>

        {status ? (
          <div className={styles.listContainer}>
            <h2 className={styles.memberTitle}>
              Members {status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            <CoffeeChatDisplay
              status={status as Status}
              coffeeChats={categoryToChats.get(category || 'default') || []}
            />
          </div>
        ) : (
          <>
            <div className={styles.listContainer}>
              <h2 className={styles.memberTitle}>Members Pending</h2>
              <CoffeeChatDisplay
                status={'pending' as Status}
                coffeeChats={categoryToChats.get(category || 'default') || []}
              />
            </div>

            <div className={styles.listContainer}>
              <h2 className={styles.memberTitle}>Members Approved</h2>
              <CoffeeChatDisplay
                status={'approved' as Status}
                coffeeChats={categoryToChats.get(category || 'default') || []}
              />
              <h2 className={styles.memberTitle}>Members Rejected</h2>
              <CoffeeChatDisplay
                status={'rejected' as Status}
                coffeeChats={categoryToChats.get(category || 'default') || []}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CoffeeChatDetails;