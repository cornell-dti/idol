import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Button, Form, Item, Card, Modal, Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { db } from '../../../firebase';
import 'react-datepicker/dist/react-datepicker.css';
import { Emitters } from '../../../utils';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import styles from './AdminShoutouts.module.css';

type ViewMode = 'ALL' | 'PRESENT' | 'HIDDEN';

const fromString = (shoutout: Shoutout): string => {
  if (!shoutout.isAnon) {
    const { giver } = shoutout;
    return ` (From: ${giver?.firstName} ${giver?.lastName})`;
  }
  return ` (From: Anonymous)`;
};

const dateString = (shoutout: Shoutout): string => `${new Date(shoutout.timestamp).toDateString()}`;

const getListTitle = (view: ViewMode): string => {
  switch (view) {
    case 'ALL':
      return 'All Shoutouts';
    case 'HIDDEN':
      return 'Hidden Shoutouts';
    default:
      return '';
  }
};

const HideModal = (props: {
  shoutout: Shoutout;
  setAllShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
}): JSX.Element => {
  const { shoutout, setAllShoutouts } = props;

  const onHide = (shoutout: Shoutout) => {
    const oppHide = !shoutout.hidden;
    ShoutoutsAPI.hideShoutout(shoutout.uuid, oppHide).then(() => {
      setAllShoutouts((shoutouts) =>
        shoutouts.map((s) => (s.uuid === shoutout.uuid ? { ...s, hidden: oppHide } : s))
      );
      if (oppHide) {
        Emitters.generalSuccess.emit({
          headerMsg: 'Shoutout Hidden',
          contentMsg: 'This shoutout was successfully hidden.'
        });
      } else {
        Emitters.generalSuccess.emit({
          headerMsg: 'Shoutout Unhidden',
          contentMsg: 'This shoutout was successfully unhidden.'
        });
      }
    });
  };

  if (!shoutout.hidden)
    return (
      <Modal
        trigger={<Button icon="eye" size="tiny" />}
        header="Hide Shoutout"
        content="Are you sure that you want to hide this shoutout?"
        actions={[
          'Cancel',
          {
            key: 'hideShoutouts',
            content: 'Hide Shoutout',
            color: 'red',
            onClick: () => onHide(shoutout)
          }
        ]}
      />
    );
  return (
    <Modal
      trigger={<Button icon="eye slash" size="tiny" />}
      header="Unhide Shoutout"
      content="Are you sure that you want to show this shoutout?"
      actions={[
        'Cancel',
        {
          key: 'unhideShoutouts',
          content: 'Unhide Shoutout',
          color: 'red',
          onClick: () => onHide(shoutout)
        }
      ]}
    />
  );
};

const DisplayList = ({
  displayShoutouts,
  view,
  setAllShoutouts
}: {
  displayShoutouts: Shoutout[];
  view: ViewMode;
  setAllShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
}): JSX.Element => {
  if (displayShoutouts.length === 0)
    return (
      <Card className={styles.noShoutoutsContainer}>
        <Card.Content>No shoutouts in this date range.</Card.Content>
      </Card>
    );
  if (view === 'PRESENT')
    return (
      <Item.Group divided>
        {displayShoutouts.map((shoutout, i) => (
          <Item key={i}>
            <Item.Content>
              <Item.Header
                className={styles.presentShoutoutTo}
              >{`${shoutout.receiver}`}</Item.Header>
              <Item.Meta
                className={styles.presentShoutoutFrom}
                content={` ${fromString(shoutout)}`}
              />
              <Item.Description
                className={styles.presentShoutoutMessage}
                content={shoutout.message}
              />
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    );
  return (
    <Item.Group divided>
      {displayShoutouts.map((shoutout, i) => (
        <Item key={i}>
          <Item.Content>
            <Item.Group widths="equal" className={styles.shoutoutDetails}>
              <Item.Header className={styles.shoutoutTo}>{`${shoutout.receiver}`}</Item.Header>
              <Item.Meta className={styles.shoutoutDate} content={dateString(shoutout)} />
            </Item.Group>
            <Item.Group widths="equal" className={styles.shoutoutHide}>
              <Item.Meta className={styles.shoutoutFrom} content={fromString(shoutout)} />
              <HideModal shoutout={shoutout} setAllShoutouts={setAllShoutouts} />
            </Item.Group>
            <Item.Description className={styles.shoutoutMessage} content={shoutout.message} />
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  );
};

const ChooseDate = (props: {
  dateField: Date;
  dateFunction: (value: React.SetStateAction<Date>) => void;
}): JSX.Element => {
  const { dateField, dateFunction } = props;
  return (
    <DatePicker
      selected={dateField}
      dateFormat="MMMM do yyyy"
      onChange={(date: Date) => dateFunction(date)}
    />
  );
};

const AdminShoutouts: React.FC = () => {
  const [allShoutouts, setAllShoutouts] = useState<Shoutout[] | undefined>(undefined);
  const [earlyDate, setEarlyDate] = useState<Date>(new Date(Date.now() - 86400000 * 13.5));
  const [lastDate, setLastDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewMode>('ALL');

  useEffect(() => {
    ShoutoutsAPI.getAllShoutouts().then((shoutouts) => setAllShoutouts(shoutouts));

    const shoutoutCollection = collection(db, 'shoutouts');
    const unsubscribe = onSnapshot(shoutoutCollection, (snapshot) => {
      snapshot.docChanges().forEach((document) => {
        if (document.type === 'added') {
          const newShoutout = document.doc.data() as Shoutout;
          setAllShoutouts((oldShoutouts = []) => [...oldShoutouts, newShoutout]);
        }
        if (document.type === 'removed') {
          const removedShoutout = document.doc.data() as Shoutout;
          setAllShoutouts((updatedList = []) =>
            updatedList.filter((x) => x.uuid !== removedShoutout.uuid)
          );
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, [setAllShoutouts]);

  if (lastDate < earlyDate) {
    Emitters.generalError.emit({
      headerMsg: 'Invalid Date Range',
      contentMsg: 'Please make sure the latest shoutout date is after the earliest shoutout date.'
    });
  }

  // const displayShoutouts = allShoutouts
  // ?.filter((shoutout) => {
  //   const shoutoutDate = new Date(shoutout.timestamp);
  //   return (
  //     (view === 'ALL' ||
  //       (view === 'PRESENT' && !shoutout.hidden) ||
  //       (view === 'HIDDEN' && shoutout.hidden)) &&
  //     shoutoutDate >= earlyDate &&
  //     shoutoutDate <= lastDate
  //   );
  // })
  // .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div>
      <Form className={styles.shoutoutForm}>
        <h2>Filter shoutouts:</h2>
        <Form.Group width="equals">
          <ChooseDate dateField={earlyDate} dateFunction={setEarlyDate} />
          <ChooseDate dateField={lastDate} dateFunction={setLastDate} />
          <Button.Group className={styles.buttonGroup}>
            <Button color={view === 'ALL' ? 'blue' : 'grey'} onClick={() => setView('ALL')}>
              ALL
            </Button>
            <Button color={view === 'HIDDEN' ? 'blue' : 'grey'} onClick={() => setView('HIDDEN')}>
              HIDDEN
            </Button>
            <Button color={view === 'PRESENT' ? 'blue' : 'grey'} onClick={() => setView('PRESENT')}>
              PRESENT
            </Button>
          </Button.Group>
        </Form.Group>
      </Form>
      <div className={styles.shoutoutsListContainer}>
        <Header className={styles.formTitle} content={getListTitle(view)}></Header>
        <DisplayList
          displayShoutouts={allShoutouts?.length ? allShoutouts : []}
          view={view}
          setAllShoutouts={(shoutouts) => {
            if (shoutouts) {
              setAllShoutouts((shoutouts = []) => shoutouts);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AdminShoutouts;
