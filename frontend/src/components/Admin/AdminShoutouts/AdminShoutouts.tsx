import React, { useState, useEffect } from 'react';
import { Item, Card } from 'semantic-ui-react';
import { Member } from '../../../API/MembersAPI';
import { ShoutoutsAPI, Shoutout } from '../../../API/ShoutoutsAPI';
import styles from './AdminShoutouts.module.css';

type Props =
  | {
      readonly giver: Member;
      readonly receiver: Member;
      readonly message: string;
      readonly isAnon: false;
    }
  | {
      readonly receiver: Member;
      readonly message: string;
      readonly isAnon: true;
    };

const AdminShoutouts: React.FC = () => {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  useEffect(() => {
    ShoutoutsAPI.getAllShoutouts().then((shoutouts) => setShoutouts(shoutouts));
  }, []);

  const fromString = (shoutout: Shoutout): string => {
    if (!shoutout.isAnon) {
      const { giver } = shoutout;
      return `From: ${giver?.firstName} ${giver?.lastName} (${giver.email})`;
    }
    return 'From: Anonymous';
  };

  return (
    <div className={styles.shoutoutsContainer}>
      {shoutouts.length === 0 ? (
        <Card className={styles.noShoutoutsContainer}>
          <Card.Content>No shoutouts.</Card.Content>
        </Card>
      ) : (
        <Item.Group divided>
          {shoutouts.map((shoutout, i) => (
            <Item key={i}>
              <Item.Content>
                <Item.Header>
                  {shoutout.receiver
                    ? `${shoutout.receiver.firstName} ${shoutout.receiver.lastName}`
                    : '(Former member)'}
                </Item.Header>
                <Item.Meta>{fromString(shoutout)}</Item.Meta>
                <Item.Description>{shoutout.message}</Item.Description>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      )}
    </div>
  );
};

export default AdminShoutouts;
