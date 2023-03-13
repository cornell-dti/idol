import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Item, Card, Modal, Header, SemanticCOLORS } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Emitters } from '../../../utils';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import styles from './AdminShoutouts.module.css';

const AdminShoutouts: React.FC = () => {
  const [allShoutouts, setAllShoutouts] = useState<Shoutout[]>([]);
  const [displayShoutouts, setDisplayShoutouts] = useState<Shoutout[]>([]);
  const [earlyDate, setEarlyDate] = useState<Date>(new Date(Date.now() - 12096e5));
  const [lastDate, setLastDate] = useState<Date>(new Date());
  const [hide, setHide] = useState(false);

  type ViewMode = 'ALL' | 'PRESENT' | 'HIDDEN';
  const [view, setView] = useState<ViewMode>('ALL');

  const updateShoutouts = useCallback(() => {
    if (lastDate < earlyDate) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Date Range',
        contentMsg: 'Please make sure the latest shoutout date is after the earliest shoutout date.'
      });
    }
    if (allShoutouts.length === 0) {
      ShoutoutsAPI.getAllShoutouts().then((shoutouts) => {
        setAllShoutouts(shoutouts);
      });
    } else {
      const filteredShoutouts = allShoutouts
        .filter((shoutout) => {
          const shoutoutDate = new Date(shoutout.timestamp);
          return shoutoutDate >= earlyDate && shoutoutDate <= lastDate;
        })
        .sort((a, b) => a.timestamp - b.timestamp);
      if (view === 'PRESENT')
        setDisplayShoutouts(filteredShoutouts.filter((shoutout) => !shoutout.hidden));
      else if (view === 'HIDDEN')
        setDisplayShoutouts(filteredShoutouts.filter((shoutout) => shoutout.hidden));
      else setDisplayShoutouts(filteredShoutouts);
      setHide(false);
    }
  }, [allShoutouts, earlyDate, lastDate, view]);

  useEffect(() => {
    updateShoutouts();
  }, [earlyDate, lastDate, hide, updateShoutouts]);

  const ListTitle = (): JSX.Element => {
    let title = 'All Shoutouts';
    if (view === 'HIDDEN') title = 'Hidden Shoutouts';
    if (view === 'PRESENT') title = '';
    return <Header className={styles.formTitle} content={title}></Header>;
  };

  const fromString = (shoutout: Shoutout): string => {
    if (!shoutout.isAnon) {
      const { giver } = shoutout;
      return ` (From: ${giver?.firstName} ${giver?.lastName})`;
    }
    return ` (From: Anonymous)`;
  };

  const dateString = (shoutout: Shoutout): string =>
    `${new Date(shoutout.timestamp).toDateString()}`;

  const onHide = (shoutout: Shoutout) => {
    setHide(true);
    const oppHide = !shoutout.hidden;
    ShoutoutsAPI.hideShoutout(shoutout.uuid, oppHide).then(() => {
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

  const HideModal = (props: { shoutout: Shoutout }): JSX.Element => {
    const { shoutout } = props;
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

  const DisplayList = (): JSX.Element => {
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
                <Item.Header className={styles.presentShoutoutTo}>
                  {`${shoutout.receiver}`}{' '}
                  <span className={styles.presentShoutoutFrom}>{` ${fromString(shoutout)}`}</span>
                </Item.Header>
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
                <HideModal shoutout={shoutout} />
              </Item.Group>
              <Item.Description className={styles.shoutoutMessage} content={shoutout.message} />
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    );
  };

  const ButtonPiece = (props: { shoutoutList: Shoutout[]; buttonText: ViewMode }): JSX.Element => {
    const { shoutoutList, buttonText } = props;
    let currColor: SemanticCOLORS = 'grey';
    if (buttonText === view) currColor = 'blue';
    return (
      <Button
        color={currColor}
        onClick={() => {
          setView(buttonText);
          setDisplayShoutouts(shoutoutList);
        }}
        content={buttonText}
      />
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

  return (
    <div>
      <Form className={styles.shoutoutForm}>
        <h2>Filter shoutouts:</h2>
        <Form.Group width="equals">
          <ChooseDate dateField={earlyDate} dateFunction={setEarlyDate} />
          <ChooseDate dateField={lastDate} dateFunction={setLastDate} />
          <Button.Group className={styles.buttonGroup}>
            <ButtonPiece shoutoutList={allShoutouts} buttonText={'ALL'} />
            <ButtonPiece
              shoutoutList={allShoutouts.filter((shoutout) => shoutout.hidden)}
              buttonText={'HIDDEN'}
            />
            <ButtonPiece
              shoutoutList={allShoutouts.filter((shoutout) => !shoutout.hidden)}
              buttonText={'PRESENT'}
            />
          </Button.Group>
        </Form.Group>
      </Form>
      <div className={styles.shoutoutsListContainer}>
        <ListTitle />
        <DisplayList />
      </div>
    </div>
  );
};

export default AdminShoutouts;
