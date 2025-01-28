import { useEffect, useState } from 'react';
import { Card, Header } from 'semantic-ui-react';
import Link from 'next/link';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';
import { useHasMemberPermission } from '../Common/FirestoreDataProvider';
import styles from './InterviewScheduler.module.css';
import SchedulingCalendar from './SchedulingCalendar';
import { getDateString, getTimeString } from '../../utils';
import SchedulingSidePanel from './SchedulingSidePanel';
import { SetSlotsContext } from './SlotHooks';
import { useUserEmail } from '../Common/UserProvider/UserProvider';

const InviteCard: React.FC<{ scheduler: InterviewScheduler; slot: InterviewSlot }> = ({
  scheduler,
  slot
}) => (
  <div className={styles.inviteCardContainer}>
    <Card className={styles.inviteCard}>
      <Card.Content>
        <Card.Header className={styles.inviteHeader}>Thank you for signing up!</Card.Header>
        <div>
          <p>{scheduler.name}</p>
          <p>
            {getTimeString(slot.startTime)} - {getTimeString(slot.startTime + scheduler.duration)}
          </p>
          <p>{slot.room}</p>
        </div>
      </Card.Content>
      <Card.Content extra>
        Need help? Send a message to{' '}
        <Link href="mailto:hello@cornelldti.org">hello@cornelldti.org</Link>
      </Card.Content>
    </Card>
  </div>
);

const InterviewScheduler: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [scheduler, setScheduler] = useState<InterviewScheduler>();
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | undefined>();
  const [hoveredSlot, setHoveredSlot] = useState<InterviewSlot | undefined>();
  const [possessedSlot, setPossessedSlot] = useState<InterviewSlot | undefined>();

  const isMember = useHasMemberPermission();
  const userEmail = useUserEmail();

  const refreshSlots = () =>
    InterviewSchedulerAPI.getSlots(uuid, !isMember).then((res) => {
      setSlots(res);
      setPossessedSlot(slots.find((slot) => slot.applicant && slot.applicant.email === userEmail));
    });

  useEffect(() => {
    InterviewSchedulerAPI.getInstance(uuid, !isMember).then((inst) => {
      setScheduler(inst);
    });
    refreshSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMember && possessedSlot && scheduler)
    return <InviteCard scheduler={scheduler} slot={possessedSlot} />;

  return (
    <div className={styles.schedulerContainer}>
      {!scheduler || !slots ? (
        <p>Loading...</p>
      ) : (
        <SetSlotsContext.Provider value={{ setSelectedSlot, setHoveredSlot }}>
          <div>
            <Header as="h2">{scheduler.name}</Header>
            <p>{`${getDateString(scheduler.startDate, false)} - ${getDateString(scheduler.endDate, false)}`}</p>
          </div>
          <div className={styles.contentContainer}>
            <SchedulingCalendar scheduler={scheduler} slots={slots} setSlots={setSlots} />
            <div className={styles.sidebarContainer}>
              <p>
                Hover over to review time slots. Click to show more information, sign up, or cancel.
              </p>
              {(hoveredSlot || selectedSlot) && (
                <SchedulingSidePanel
                  displayedSlot={(hoveredSlot || selectedSlot) as InterviewSlot}
                  scheduler={scheduler}
                  setSlots={setSlots}
                  refresh={refreshSlots}
                />
              )}
            </div>
          </div>
        </SetSlotsContext.Provider>
      )}
    </div>
  );
};

export default InterviewScheduler;
