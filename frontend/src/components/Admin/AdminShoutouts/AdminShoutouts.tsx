import React, { useState, useEffect } from 'react';
import { Item, Card } from 'semantic-ui-react';
import { ShoutoutsAPI, Shoutout } from '../../../API/ShoutoutsAPI';
import styles from './AdminShoutouts.module.css';

const AdminShoutouts: React.FC = () => {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  useEffect(() => {
    ShoutoutsAPI.getAllShoutouts().then((shoutouts) => setShoutouts(shoutouts));
  }, []);

  const fromString = (shoutout: Shoutout): string => {
    const dateString = ` (Date: ${new Date(shoutout.timestamp).toDateString()})`;
    if (!shoutout.isAnon) {
      const { giver } = shoutout;
      return `From: ${giver?.firstName} ${giver?.lastName} ${dateString}`;
    }
    return `From: Anonymous${dateString}`;
  };

  return (
    <div>
      <div className={styles.shoutoutsListContainer}>
        {shoutouts.length === 0 ? (
          <Card className={styles.noShoutoutsContainer}>
            <Card.Content>No shoutouts.</Card.Content>
          </Card>
        ) : (
          <Item.Group divided>
            {shoutouts
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((shoutout, i) => (
                <Item key={i}>
                  <Item.Content>
                    <Item.Header>{`To: ${shoutout.receiver}`}</Item.Header>
                    <Item.Meta>{fromString(shoutout)}</Item.Meta>
                    <Item.Description>{shoutout.message}</Item.Description>
                  </Item.Content>
                </Item>
              ))}
          </Item.Group>
        )}
      </div>
    </div>
  );
};

export default AdminShoutouts;
