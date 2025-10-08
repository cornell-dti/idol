import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Form,
  Item,
  Card,
  Modal,
  Header,
  SemanticCOLORS,
  Image,
  Loader
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DocumentReference, collection, getDoc, onSnapshot } from 'firebase/firestore';
import { Emitters } from '../../../utils';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ImagesAPI from '../../../API/ImagesAPI';
import styles from './AdminShoutouts.module.css';
import catEmoji from '../../../static/images/meow_attention.gif';
import { db } from '../../../firebase';

type DBShoutout = {
  giver: DocumentReference;
  receiver: string;
  message: string;
  isAnon: boolean;
  timestamp: number;
  hidden: boolean;
  uuid: string;
  images?: string[];
};

const AdminShoutouts: React.FC = () => {
  const [allShoutouts, setAllShoutouts] = useState<Shoutout[]>([]);
  const [displayShoutouts, setDisplayShoutouts] = useState<Shoutout[]>([]);
  const [earlyDate, setEarlyDate] = useState<Date>(new Date(Date.now() - 86400000 * 13.5));
  const [lastDate, setLastDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [imageCache, setImageCache] = useState<{ [key: string]: string }>({});

  type ViewMode = 'ALL' | 'PRESENT' | 'HIDDEN';
  const [view, setView] = useState<ViewMode>('ALL');

  const updateShoutouts = useCallback(() => {
    setLoading(true);
    if (lastDate < earlyDate) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid Date Range',
        contentMsg: 'Please make sure the latest shoutout date is after the earliest shoutout date.'
      });
    }
    if (allShoutouts.length === 0) {
      ShoutoutsAPI.getAllShoutouts().then((shoutouts) => {
        setAllShoutouts(shoutouts);
        setLoading(false);
      });
    } else {
      const filteredShoutouts = allShoutouts
        .filter((shoutout) => {
          const shoutoutDate = new Date(shoutout.timestamp);
          // Set time to be 4:59:59AM UTC/11:59PM EST/12:59AM EDT
          const lastDateAdjusted = new Date(
            new Date(lastDate.getTime() - lastDate.getTimezoneOffset() * 60 * 1000).setUTCHours(
              4,
              59,
              59,
              59
            ) +
              60 * 60 * 1000 * 24
          );

          // Set time to be 5AM UTC/12AM EST/1AM EDT
          const earlyDateAdjusted = new Date(new Date(earlyDate).setUTCHours(5, 0, 0, 0));
          return shoutoutDate >= earlyDateAdjusted && shoutoutDate <= lastDateAdjusted;
        })
        .sort((a, b) => a.timestamp - b.timestamp);
      if (view === 'PRESENT')
        setDisplayShoutouts(filteredShoutouts.filter((shoutout) => !shoutout.hidden));
      else if (view === 'HIDDEN')
        setDisplayShoutouts(filteredShoutouts.filter((shoutout) => shoutout.hidden));
      else setDisplayShoutouts(filteredShoutouts);
      setLoading(false);
    }
  }, [allShoutouts, earlyDate, lastDate, view]);

  const fetchImages = useCallback(
    (shoutouts: Shoutout[]) => {
      shoutouts.forEach((shoutout) => {
        if (shoutout.images?.length && !imageCache[shoutout.uuid]) {
          ImagesAPI.getImage(shoutout.images[0]).then((url) => {
            setImageCache((prev) => ({ ...prev, [shoutout.uuid]: url }));
          });
        }
      });
    },
    [imageCache]
  );

  useEffect(() => {
    updateShoutouts();
  }, [earlyDate, lastDate, view, updateShoutouts]);

  useEffect(() => {
    fetchImages(displayShoutouts);
  }, [displayShoutouts, fetchImages]);

  useEffect(() => {
    const shoutoutCollection = collection(db, 'shoutouts');
    const unsubscribe = onSnapshot(shoutoutCollection, async (snapshot) => {
      const newShoutouts = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data() as DBShoutout;
          return {
            ...data,
            giver: (await getDoc(data.giver)).data() as IdolMember
          };
        })
      );
      setAllShoutouts(newShoutouts);
    });
    return unsubscribe;
  }, [setAllShoutouts]);

  const ListTitle = (): JSX.Element => {
    let title = `All Shoutouts (${displayShoutouts.length})`;
    if (view === 'HIDDEN') title = `Hidden Shoutouts (${displayShoutouts.length})`;
    if (view === 'PRESENT') title = '';
    return (
      <div className={styles.formHeader}>
        <Header className={styles.formTitle} content={title} />
      </div>
    );
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

  const HideModal = ({ shoutout }: { shoutout: Shoutout }): JSX.Element => (
    <Modal
      trigger={<Button icon={shoutout.hidden ? 'eye slash' : 'eye'} size="tiny" />}
      header={shoutout.hidden ? 'Unhide Shoutout' : 'Hide Shoutout'}
      content={`Are you sure you want to ${shoutout.hidden ? 'unhide' : 'hide'} this shoutout?`}
      actions={[
        'Cancel',
        {
          key: 'toggleHide',
          content: shoutout.hidden ? 'Unhide Shoutout' : 'Hide Shoutout',
          color: 'red',
          onClick: () => onHide(shoutout)
        }
      ]}
    />
  );

  const ShoutoutImage = ({ shoutout }: { shoutout: Shoutout }) => {
    const imageUrl = imageCache[shoutout.uuid];

    if (imageUrl) {
      return (
        <Item.Image>
          <Image src={imageUrl} size="small" />
        </Item.Image>
      );
    }
    if (shoutout.images && shoutout.images.length > 0) return <Loader active inline="centered" />;
    return null;
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
          <Header className={styles.presentCount}>
            <Image className={styles.presentCountImg} src={catEmoji.src} alt="cat gif" />
            {` ${displayShoutouts.length} Shoutouts `}
            <Image className={styles.presentCountImg} src={catEmoji.src} alt="cat gif" />
          </Header>
          {displayShoutouts.map((shoutout, i) => (
            <Item key={i}>
              <div className={styles.displayCount}>{i + 1}</div>
              <Item.Content>
                <Item.Header className={styles.presentShoutoutTo}>
                  {`${shoutout.receiver}`}{' '}
                  <span className={styles.presentShoutoutFrom}>{` ${fromString(shoutout)}`}</span>
                </Item.Header>
                <Item.Description
                  className={styles.presentShoutoutMessage}
                  content={shoutout.message}
                />
                <ShoutoutImage shoutout={shoutout} />
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
              <ShoutoutImage shoutout={shoutout} />
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    );
  };

  const ButtonPiece = (props: { buttonText: ViewMode }): JSX.Element => {
    const { buttonText } = props;
    let currColor: SemanticCOLORS = 'grey';
    if (buttonText === view) currColor = 'blue';

    const handleButtonClick = () => {
      setView(buttonText);
      setDisplayShoutouts(() => {
        if (buttonText === 'ALL') return allShoutouts;
        if (buttonText === 'HIDDEN') return allShoutouts.filter((s) => s.hidden);
        return allShoutouts.filter((s) => !s.hidden);
      });
    };

    return <Button color={currColor} onClick={handleButtonClick} content={buttonText} />;
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
            <ButtonPiece buttonText={'ALL'} />
            <ButtonPiece buttonText={'HIDDEN'} />
            <ButtonPiece buttonText={'PRESENT'} />
          </Button.Group>
        </Form.Group>
      </Form>
      <div className={styles.shoutoutsListContainer}>
        {loading ? (
          <Loader active inline="centered" />
        ) : (
          <>
            <ListTitle />
            <DisplayList />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminShoutouts;
