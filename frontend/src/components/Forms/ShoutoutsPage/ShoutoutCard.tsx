import { Card } from 'semantic-ui-react';
import ShoutoutDeleteModal from '../../Modals/ShoutoutDeleteModal';
// import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
// import { Emitters } from '../../../utils';
import styles from './ShoutoutCard.module.css';

const ShoutoutCard = (props: {
  shoutout: Shoutout;
  setGivenShoutouts: React.Dispatch<React.SetStateAction<Shoutout[]>>;
}): JSX.Element => {
  const { shoutout, setGivenShoutouts } = props;

  const fromString = shoutout.isAnon
    ? 'From: Anonymous'
    : `From: ${shoutout.giver?.firstName} ${shoutout.giver?.lastName}`;
  const dateString = `${new Date(shoutout.timestamp).toDateString()}`;

  // const onDelete = (shoutout: Shoutout) => {
  //   ShoutoutsAPI.deleteShoutout(shoutout.uuid).then(() => {
  //     Emitters.generalSuccess.emit({
  //       headerMsg: 'Shoutout Deleted',
  //       contentMsg: 'This shoutout was successfully deleted.'
  //     });
  //   });
  // };

  // const DeleteModal = (props: { shoutout: Shoutout }): JSX.Element => {
  //   const { shoutout } = props;
  //   return (
  //     <Modal
  //       trigger={<Button icon="trash" size="tiny" />}
  //       header="Delete Shoutout"
  //       content="Are you sure that you want to delete this shoutout?"
  //       actions={[
  //         'Cancel',
  //         {
  //           key: 'deleteShoutouts',
  //           content: 'Delete Shoutout',
  //           color: 'red',
  //           onClick: () => onDelete(shoutout)
  //         }
  //       ]}
  //     />
  //   );
  // };

  return (
    <Card className={styles.shoutoutCardContainer}>
      <Card.Group widths="equal" className={styles.shoutoutCardDetails}>
        <Card.Content header={`To: ${shoutout.receiver}`} className={styles.shoutoutTo} />
        <Card.Content className={styles.shoutoutDate} content={dateString} />
      </Card.Group>
      <Card.Group widths="equal" className={styles.shoutoutDelete}>
        <Card.Meta className={styles.shoutoutFrom} content={fromString} />
        <ShoutoutDeleteModal uuid={shoutout.uuid} setGivenShoutouts={setGivenShoutouts} />
      </Card.Group>
      <Card.Content description={shoutout.message} />
    </Card>
  );
};
export default ShoutoutCard;
