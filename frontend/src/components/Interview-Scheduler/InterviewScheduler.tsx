import { useEffect, useState } from 'react';
import { Button, Card, Header } from 'semantic-ui-react';
import Link from 'next/link';
import { LEAD_ROLES } from 'common-types/constants';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';
import { useHasMemberPermission, useMember } from '../Common/FirestoreDataProvider';
import styles from './InterviewScheduler.module.css';
import SchedulingCalendar from './SchedulingCalendar';
import { Emitters, getDateString, getTimeString } from '../../utils';
import { addToGoogleCalendar } from '../../calendar';
import SchedulingSidePanel from './SchedulingSidePanel';
import { EditAvailabilityContext, SetSlotsContext } from './SlotHooks';
import { useUserEmail } from '../Common/UserProvider/UserProvider';

const formatDate = (date: Date): string => {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};

const InviteCard: React.FC<{ scheduler: InterviewScheduler; slot?: InterviewSlot }> = ({
  scheduler,
  slot
}) => {
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const handleAddToCalendar = async () => {
    if (!slot) return;

    setIsAddingToCalendar(true);
    setCalendarError(null);

    try {
      await addToGoogleCalendar(scheduler, slot);
      Emitters.generalSuccess.emit({
        headerMsg: 'Calendar Event Added',
        contentMsg: 'Your interview has been added to your Google Calendar!'
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add to calendar:', error);
      setCalendarError('Failed to add event to calendar. Please try again.');
      Emitters.generalError.emit({
        headerMsg: 'Calendar Error',
        contentMsg: 'Failed to add event to Google Calendar. Please try again.'
      });
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  return (
    <div className={styles.inviteCardContainer}>
      <Card style={{ width: '30%' }}>
        <Card.Content>
          {slot ? (
            <>
              <Card.Header className={styles.inviteHeader}>Thank you for signing up!</Card.Header>
              <div>
                <p>{scheduler.name}</p>
                <p>
                  <strong>Date: </strong>
                  {`${formatDate(new Date(slot.startTime))}`}
                </p>
                <p>
                  <strong>Time: </strong> {getTimeString(slot.startTime)} -{' '}
                  {getTimeString(slot.startTime + scheduler.duration)}
                </p>
                <p>
                  <strong>Room: </strong>
                  {slot.room}
                </p>
              </div>
              <div style={{ marginTop: '1em' }}>
                <Button
                  primary
                  icon="calendar"
                  content="Add to Google Calendar"
                  loading={isAddingToCalendar}
                  onClick={handleAddToCalendar}
                  disabled={isAddingToCalendar}
                />
                {calendarError && (
                  <p style={{ color: 'red', fontSize: '0.9em', marginTop: '0.5em' }}>
                    {calendarError}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <Card.Header>Could not find time slot.</Card.Header>
              <p>
                We could not find a time slot that you signed up for. For assistance, please contact
                the email below.
              </p>
            </>
          )}
        </Card.Content>
        <Card.Content extra>
          Need help? Send a message to{' '}
          <Link href="mailto:hello@cornelldti.org">hello@cornelldti.org</Link>
        </Card.Content>
      </Card>
    </div>
  );
};

const InterviewScheduler: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [scheduler, setScheduler] = useState<InterviewScheduler>();
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | undefined>();
  const [hoveredSlot, setHoveredSlot] = useState<InterviewSlot | undefined>();
  const [possessedSlot, setPossessedSlot] = useState<InterviewSlot | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [tentativeSlots, setTentativeSlots] = useState<InterviewSlot[]>([]);

  const isMember = useHasMemberPermission();
  const userEmail = useUserEmail();
  const member = useMember(userEmail);
  const isLead = member && LEAD_ROLES.includes(member.role);

  const refreshSlots = () =>
    InterviewSchedulerAPI.getSlots(uuid, !isMember).then((res) => {
      setSlots(res);
    });

  useEffect(() => {
    InterviewSchedulerAPI.getInstance(uuid, !isMember).then((inst) => {
      setScheduler(inst);
    });
    refreshSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPossessedSlot(slots.find((slot) => slot.applicant && slot.applicant.email === userEmail));
  }, [userEmail, slots]);

  const handleSaveSlots = () => {
    if (tentativeSlots.length !== 0) {
      InterviewSchedulerAPI.createSlots(tentativeSlots).then((val) => {
        setSlots([...slots, ...val]);
        setIsEditing(false);
        Emitters.generalSuccess.emit({
          headerMsg: 'Create Interview Slots',
          contentMsg: `You have successfully added ${tentativeSlots.length} slots.`
        });
        setTentativeSlots([]);
      });
    }
  };

  if (scheduler && (!scheduler.isOpen || possessedSlot) && !isMember)
    return <InviteCard scheduler={scheduler} slot={possessedSlot} />;

  return (
    <div className={styles.schedulerContainer}>
      {!scheduler ? (
        <p>Loading...</p>
      ) : (
        <SetSlotsContext.Provider value={{ setSlots, setSelectedSlot, setHoveredSlot }}>
          <div className={styles.headerContainer}>
            <div>
              <Header as="h2">{scheduler.name}</Header>
              <p>{`${getDateString(scheduler.startDate, false)} - ${getDateString(scheduler.endDate, false)}`}</p>
            </div>
            {isLead && (
              <div>
                {isEditing ? (
                  <div>
                    <Button
                      basic
                      color="red"
                      onClick={() => {
                        setIsEditing(false);
                        setTentativeSlots([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button basic onClick={handleSaveSlots}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    basic
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedSlot(undefined);
                    }}
                  >
                    Add availabilities
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className={styles.contentContainer}>
            <EditAvailabilityContext.Provider
              value={{ isEditing, setIsEditing, tentativeSlots, setTentativeSlots }}
            >
              <SchedulingCalendar scheduler={scheduler} slots={slots} />
            </EditAvailabilityContext.Provider>
            {!isEditing && (
              <div className={styles.sidebarContainer}>
                <p>
                  Hover over to review time slots. Click to show more information, sign up, or
                  cancel.
                </p>
                {(hoveredSlot || selectedSlot) && (
                  <SchedulingSidePanel
                    displayedSlot={(hoveredSlot || selectedSlot) as InterviewSlot}
                    scheduler={scheduler}
                    refresh={refreshSlots}
                  />
                )}
              </div>
            )}
          </div>
        </SetSlotsContext.Provider>
      )}
    </div>
  );
};

export default InterviewScheduler;
