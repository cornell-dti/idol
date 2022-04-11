import React, { useState, useEffect } from 'react';
import { Item, Card } from 'semantic-ui-react';
import { ShoutoutsAPI, Shoutout } from '../../../API/ShoutoutsAPI';
import styles from './AdminShoutouts.module.css';

const AdminShoutouts: React.FC = () => {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);

  useEffect(() => {
    ShoutoutsAPI.getAllShoutouts().then((shoutouts) => setShoutouts(shoutouts));
  }, []);

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
                  {`${shoutout.receiver.firstName} ${shoutout.receiver.lastName}`}
                </Item.Header>
                <Item.Meta>{`From: ${shoutout.giver.firstName} ${shoutout.giver.lastName}`}</Item.Meta>
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
