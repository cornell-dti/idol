import { useEffect, useState } from 'react';
import { Header, Loader } from 'semantic-ui-react';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';
import { useHasMemberPermission } from '../Common/FirestoreDataProvider';
import styles from './InterviewScheduler.module.css';
import SchedulingCalendar from './SchedulingCalendar';
import { getDateString } from '../../utils';
import SchedulingSidePanel from './SchedulingSidePanel';

const InterviewScheduler: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [scheduler, setScheduler] = useState<InterviewScheduler>();
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | undefined>();
  const [hoveredSlot, setHoveredSlot] = useState<InterviewSlot | undefined>();

  const hasMemberPermissions = useHasMemberPermission();

  useEffect(() => {
    InterviewSchedulerAPI.getInstance(uuid, !hasMemberPermissions).then((inst) => {
      setScheduler(inst);
    });
    InterviewSchedulerAPI.getSlots(uuid, !hasMemberPermissions).then((res) => {
      setSlots(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.schedulerContainer}>
      {!scheduler || !slots ? (
        <Loader size="massive" />
      ) : (
        <>
          <div>
            <Header as="h2">{scheduler.name}</Header>
            <p>{`${getDateString(scheduler.startDate, false)} - ${getDateString(scheduler.endDate, false)}`}</p>
          </div>
          <div className={styles.contentContainer}>
            <SchedulingCalendar
              scheduler={scheduler}
              slots={slots}
              setSlots={setSlots}
              setHoveredSlot={setHoveredSlot}
              setSelectedSlot={setSelectedSlot}
            />
            <SchedulingSidePanel
              displayedSlot={hoveredSlot || selectedSlot}
              duration={scheduler.duration}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InterviewScheduler;
