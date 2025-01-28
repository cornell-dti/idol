import { Dispatch, SetStateAction, useState } from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import styles from './SchedulingCalendar.module.css';
import { getDateString, hourIndexToString } from '../../utils';
import { useHasAdminPermission } from '../Common/FirestoreDataProvider';
import { useInterviewSlotStatus, useSetSlotsContext } from './SlotHooks';

const PIXEL_PER_MINUTE = 1;

const TimeBlock = () => (
  <>
    <div className={styles.timeslot} style={{ borderBottomStyle: 'hidden' }} />
    <div
      className={styles.timeslot}
      style={{
        borderTopStyle: 'hidden',
        borderBottomStyle: 'dashed'
      }}
    />
    <div
      className={styles.timeslot}
      style={{
        borderTopStyle: 'dashed',
        borderBottomStyle: 'hidden'
      }}
    />
    <div
      className={styles.timeslot}
      style={{
        borderTopStyle: 'hidden'
      }}
    />
  </>
);

const SlotButton: React.FC<{ slot: InterviewSlot; duration: number; startHour: number }> = ({
  slot,
  duration,
  startHour
}) => {
  const { setHoveredSlot, setSelectedSlot } = useSetSlotsContext();
  const slotStatus = useInterviewSlotStatus(slot);
  const isAdmin = useHasAdminPermission();

  const getMinutesFromStartOfDay = (unixTime: number) => {
    const date = new Date(unixTime);
    return date.getHours() * 60 + date.getMinutes();
  };

  return (
    <div onMouseEnter={() => setHoveredSlot(slot)} onMouseLeave={() => setHoveredSlot(undefined)}>
      <Button
        className={styles.slotButton}
        style={{
          top: PIXEL_PER_MINUTE * (getMinutesFromStartOfDay(slot.startTime) - startHour * 60),
          height: duration / 60000
        }}
        onClick={() => setSelectedSlot(slot)}
        disabled={!isAdmin && slotStatus === 'occupied'}
        color={slotStatus === 'possessed' ? 'green' : undefined}
      >
        {hourIndexToString(
          new Date(slot.startTime).getHours(),
          new Date(slot.startTime).getMinutes()
        )}
      </Button>
    </div>
  );
};

const SchedulerColumn: React.FC<{
  hours: number[];
  room: string;
  slots: InterviewSlot[];
  duration: number;
}> = ({ hours, duration, room, slots }) => (
  <div>
    <p className={styles.roomName}>{room}</p>
    <div className={styles.column}>
      <div>
        {hours.map((_) => (
          <TimeBlock />
        ))}
      </div>
      <div>
        {slots.map((slot) => (
          <SlotButton slot={slot} duration={duration} startHour={hours[0]} key={slot.uuid} />
        ))}
      </div>
    </div>
  </div>
);

const MILLISECONDS_PER_DAY = 86400000;

const SchedulingCalendar: React.FC<{
  scheduler: InterviewScheduler;
  slots: InterviewSlot[];
  setSlots: Dispatch<SetStateAction<InterviewSlot[]>>;
}> = ({ scheduler, slots, setSlots }) => {
  const { setSelectedSlot } = useSetSlotsContext();
  const [day, setDay] = useState(scheduler.startDate);

  const filteredSlots = slots.filter(
    (slot) => slot.startTime >= day && slot.startTime <= day + MILLISECONDS_PER_DAY
  );

  const options = Array.from(
    {
      length: 1 + (scheduler.endDate - scheduler.startDate) / MILLISECONDS_PER_DAY
    },
    (_, i) => scheduler.startDate + i * MILLISECONDS_PER_DAY
  ).map((date) => ({
    text: getDateString(date, true),
    value: date
  }));

  const slotsByRoom = filteredSlots.reduce((acc, curr) => {
    acc.set(curr.room, [...(acc.get(curr.room) || []), curr]);
    return acc;
  }, new Map<string, InterviewSlot[]>());

  const minHour = new Date(Math.min(...filteredSlots.map((slot) => slot.startTime))).getHours();
  const maxHour = new Date(
    scheduler.duration + Math.max(...filteredSlots.map((slot) => slot.startTime))
  ).getHours();
  const hours = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);

  return (
    <div className={styles.calendarContainer}>
      <Dropdown
        selection
        value={day}
        options={options}
        onChange={(_, data) => {
          setDay(data.value as number);
          setSelectedSlot(undefined);
        }}
      />
      <div className={styles.columnContainer}>
        <div className={styles.timeLabelColumn}>
          {hours.map((hour) => (
            <p className={styles.timeLabel}>{hourIndexToString(hour)}</p>
          ))}
        </div>
        {Array.from(slotsByRoom.entries()).map(([room, roomSlots]) => (
          <SchedulerColumn
            room={room}
            slots={roomSlots}
            duration={scheduler.duration}
            hours={hours}
          />
        ))}
      </div>
    </div>
  );
};

export default SchedulingCalendar;
