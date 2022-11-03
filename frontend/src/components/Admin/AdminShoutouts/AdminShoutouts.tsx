import React, { useState, useEffect } from 'react';
import { Form, Item, Card } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Emitters } from '../../../utils';
import { ShoutoutsAPI, Shoutout } from '../../../API/ShoutoutsAPI';
import styles from './AdminShoutouts.module.css';

const AdminShoutouts: React.FC = () => {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [displayShoutouts, setDisplayShoutouts] = useState<Shoutout[]>([]);
  useEffect(() => {
    ShoutoutsAPI.getAllShoutouts().then((shoutouts) => {
      setShoutouts(shoutouts);
      setDisplayShoutouts(shoutouts);
    });
  }, []);
  const [earlyDate, setEarlyDate] = useState<Date>(new Date('2022/01/01'));
  const [lastDate, setLastDate] = useState<Date>(new Date());

  const fromString = (shoutout: Shoutout): string => {
    const dateString = ` (Date: ${new Date(shoutout.timestamp).toDateString()})`;
    if (!shoutout.isAnon) {
      const { giver } = shoutout;
      return `From: ${giver?.firstName} ${giver?.lastName} ${dateString}`;
    }
    return `From: Anonymous${dateString}`;
  };

  const updateShoutouts = () => {
    if (lastDate < earlyDate) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Date Range',
        contentMsg: 'Please make sure the latest shoutout date is after the earliest shoutout date.'
      });
    } else {
      setDisplayShoutouts(
        shoutouts.filter(
          (shoutout) =>
            new Date(shoutout.timestamp) >= earlyDate && new Date(shoutout.timestamp) <= lastDate
        )
      );
    }
  };

  return (
    <div>
      <Form className={styles.shoutoutForm}>
        <h2 className={styles.formTitle}>Select date range to display shoutouts:</h2>
        <Form.Group width="equals">
          <DatePicker
            selected={earlyDate}
            dateFormat="MMMM do yyyy"
            onChange={(date: Date) => setEarlyDate(date)}
          />
          <DatePicker
            selected={lastDate}
            dateFormat="MMMM do yyyy"
            onChange={(date: Date) => setLastDate(date)}
          />
        </Form.Group>

        <Form.Button onClick={updateShoutouts} floated="right" className={styles.updateButton}>
          Update
        </Form.Button>
      </Form>

      <div className={styles.shoutoutsListContainer}>
        <h2 className={styles.formTitle}>Shoutouts List! 📣</h2>
        {displayShoutouts.length === 0 ? (
          <Card className={styles.noShoutoutsContainer}>
            <Card.Content>No shoutouts in this date range.</Card.Content>
          </Card>
        ) : (
          <Item.Group divided>
            {displayShoutouts
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
