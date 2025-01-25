import { Dispatch, SetStateAction, useState } from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import styles from './SchedulingCalendar.module.css';
import { getDateString, hourIndexToString } from '../../utils';

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

const SchedulerColumn: React.FC<{
  hours: number[];
  room: string;
  slots: InterviewSlot[];
  duration: number;
  setSelectedSlot: Dispatch<SetStateAction<InterviewSlot | undefined>>;
  setHoveredSlot: Dispatch<SetStateAction<InterviewSlot | undefined>>;
}> = ({ hours, duration, room, slots, setSelectedSlot, setHoveredSlot }) => {
  const getMinutesFromStartOfDay = (unixTime: number) => {
    const date = new Date(unixTime);
    return date.getHours() * 60 + date.getMinutes();
  };

  return (
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
            <div
              onMouseEnter={() => setHoveredSlot(slot)}
              onMouseLeave={() => setHoveredSlot(undefined)}
            >
              <Button
                className={styles.slotButton}
                style={{
                  top:
                    PIXEL_PER_MINUTE * (getMinutesFromStartOfDay(slot.startTime) - hours[0] * 60),
                  height: duration / 60000
                }}
                onClick={() => setSelectedSlot(slot)}
              >
                {hourIndexToString(
                  new Date(slot.startTime).getHours(),
                  new Date(slot.startTime).getMinutes()
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MILLISECONDS_PER_DAY = 86400000;

const SchedulingCalendar: React.FC<{
  scheduler: InterviewScheduler;
  slots: InterviewSlot[];
  setSlots: Dispatch<SetStateAction<InterviewSlot[]>>;
  setSelectedSlot: Dispatch<SetStateAction<InterviewSlot | undefined>>;
  setHoveredSlot: Dispatch<SetStateAction<InterviewSlot | undefined>>;
}> = ({ scheduler, slots, setSlots, setSelectedSlot, setHoveredSlot }) => {
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
    scheduler.duration +
      Math.max(...filteredSlots.map((slot) => slot.startTime))
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
            setSelectedSlot={setSelectedSlot}
            setHoveredSlot={setHoveredSlot}
          />
        ))}
      </div>
    </div>
  );
};

export default SchedulingCalendar;
