import { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';
import { useHasMemberPermission } from '../Common/FirestoreDataProvider';
import styles from './InterviewScheduler.module.css';
import SchedulingCalendar from './SchedulingCalendar';

const InterviewScheduler: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [isSchedulerLoading, setIsSchedulerLoading] = useState(true);
  const [areSlotsLoading, setAreSlotsLoading] = useState(true);
  const [scheduler, setScheduler] = useState<InterviewScheduler>();
  const [slots, setSlots] = useState<InterviewSlot[]>([]);

  const hasMemberPermissions = useHasMemberPermission();

  useEffect(() => {
    InterviewSchedulerAPI.getInstance(uuid, !hasMemberPermissions).then((inst) => {
      setScheduler(inst);
      setIsSchedulerLoading(false);
    });
    InterviewSchedulerAPI.getSlots(uuid, !hasMemberPermissions).then((res) => {
      setSlots(res);
      setAreSlotsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.schedulerContainer}>
      {isSchedulerLoading || areSlotsLoading ? (
        <Loader size="massive" />
      ) : (
        <>
          <div className={styles.calendarContainer}>
            <SchedulingCalendar scheduler={scheduler as InterviewScheduler} slots={slots} setSlots={setSlots} />
          </div>
          <div className={styles.sidebarContainer}></div>
        </>
      )}
    </div>
  );
};

export default InterviewScheduler;