import { CSSProperties, DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Form, Input } from 'semantic-ui-react';
import { LEAD_ROLES } from 'common-types/constants';
import styles from './SchedulingCalendar.module.css';
import { getDateString, hourIndexToString } from '../../utils';
import { useHasAdminPermission, useMember, useMembers } from '../Common/FirestoreDataProvider';
import {
  useEditAvailabilityContext,
  useInterviewSlotStatus,
  useSetSlotsContext
} from './SlotHooks';
import { useUserEmail } from '../Common/UserProvider/UserProvider';

const PIXEL_PER_MINUTE = 1;
const MILLISECONDS_PER_DAY = 86400000;
const MILLISECONDS_PER_MINUTE = 60000;

type DragRange = {
  start: number;
  end: number;
};

const TimeBlock: React.FC<{ startHour: number; range: DragRange }> = ({ startHour, range }) => {
  const backgroundStyle = (time: number): CSSProperties => {
    if (time <= range.end && time >= range.start) {
      return { background: 'green' };
    }
    return {};
  };

  return (
    <>
      <div
        className={styles.timeslot}
        style={{ ...backgroundStyle(startHour), borderBottomStyle: 'hidden' }}
      />
      <div
        className={styles.timeslot}
        style={{
          ...backgroundStyle(startHour + 15),
          borderTopStyle: 'hidden',
          borderBottomStyle: 'dashed'
        }}
      />
      <div
        className={styles.timeslot}
        style={{
          ...backgroundStyle(startHour + 30),
          borderTopStyle: 'dashed',
          borderBottomStyle: 'hidden'
        }}
      />
      <div
        className={styles.timeslot}
        style={{
          ...backgroundStyle(startHour + 45),
          borderTopStyle: 'hidden'
        }}
      />
    </>
  );
};

const SlotButton: React.FC<{
  slot: InterviewSlot;
  duration: number;
  startHour: number;
  tentative?: boolean;
}> = ({ slot, duration, startHour, tentative = false }) => {
  const { setHoveredSlot, setSelectedSlot } = useSetSlotsContext();
  const slotStatus = useInterviewSlotStatus(slot);
  const { isEditing, setTentativeSlots } = useEditAvailabilityContext();

  const userEmail = useUserEmail();
  const self = useMember(userEmail);
  const isLead = self && LEAD_ROLES.includes(self.role);

  const getMinutesFromStartOfDay = (unixTime: number) => {
    const date = new Date(unixTime);
    return date.getHours() * 60 + date.getMinutes();
  };

  const removeTentativeSlot = () =>
    setTentativeSlots((prev) =>
      prev.filter(
        (tentSlot) => tentSlot.room !== slot.room || tentSlot.startTime !== slot.startTime
      )
    );

  return (
    <div onMouseEnter={() => setHoveredSlot(slot)} onMouseLeave={() => setHoveredSlot(undefined)}>
      <Button
        className={styles.slotButton}
        style={{
          top: PIXEL_PER_MINUTE * (getMinutesFromStartOfDay(slot.startTime) - startHour * 60),
          height: (duration / MILLISECONDS_PER_MINUTE) * PIXEL_PER_MINUTE
        }}
        onClick={isEditing ? () => removeTentativeSlot() : () => setSelectedSlot(slot)}
        disabled={(isEditing && !tentative) || (!isLead && slotStatus === 'occupied')}
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
  day: number;
  slots: InterviewSlot[];
  scheduler: InterviewScheduler;
}> = ({ hours, day, scheduler, room, slots }) => {
  const [dragRange, setDragRange] = useState<DragRange>({ start: -1, end: -1 });
  const { isEditing, tentativeSlots, setTentativeSlots } = useEditAvailabilityContext();
  const columnRef = useRef<HTMLDivElement>(null);

  const members = useMembers();
  const userEmail = useUserEmail();

  const getMinuteFromDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!columnRef.current) return -1;
    return (
      (e.pageY - columnRef.current.getBoundingClientRect().top) / PIXEL_PER_MINUTE + hours[0] * 60
    );
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    setDragRange({
      start: getMinuteFromDrag(e),
      end: getMinuteFromDrag(e)
    });
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const overlap = (slot1: InterviewSlot, slot2: InterviewSlot) => {
    const end1 = slot1.startTime + scheduler.duration;
    const end2 = slot2.startTime + scheduler.duration;
    return end2 > slot1.startTime && end1 > slot2.startTime;
  };

  const normalizedRange: DragRange =
    dragRange.start <= dragRange.end
      ? {
          ...dragRange,
          start: dragRange.start - (dragRange.start % 15)
        }
      : {
          start: dragRange.end - (dragRange.end % 15),
          end: dragRange.start
        };

  const handleDragEnd = (_: DragEvent<HTMLDivElement>) => {
    const validSlots: InterviewSlot[] = [];
    Array.from(
      { length: Math.floor((normalizedRange.end - normalizedRange.start) / 15) },
      (_, i) => normalizedRange.start + i * 15
    ).forEach((startTime) => {
      const tentativeSlot: InterviewSlot = {
        interviewSchedulerUuid: scheduler.uuid,
        startTime: day + startTime * MILLISECONDS_PER_MINUTE,
        room,
        lead: members.find((mem) => mem.email === userEmail) ?? null,
        members: new Array(scheduler.membersPerSlot).map((x) => null),
        applicant: null,
        uuid: ''
      };
      if (
        startTime >= hours[0] * 60 &&
        startTime + scheduler.duration / MILLISECONDS_PER_MINUTE <=
          (hours[hours.length - 1] + 1) * 60 &&
        slots.every((slot) => !overlap(slot, tentativeSlot)) &&
        validSlots.every((slot) => !overlap(slot, tentativeSlot)) &&
        tentativeSlots.every(
          (slot) => slot.room !== tentativeSlot.room || !overlap(slot, tentativeSlot)
        )
      )
        validSlots.push(tentativeSlot);
    });
    setTentativeSlots((prev) => [...prev, ...validSlots]);

    setDragRange({ start: -1, end: -1 });
  };

  const filteredTentativeSlots = tentativeSlots.filter(
    (tentSlot) =>
      tentSlot.startTime >= day &&
      tentSlot.startTime < day + MILLISECONDS_PER_DAY &&
      tentSlot.room === room
  );

  return (
    <div>
      <p className={styles.roomName}>{room}</p>
      <div className={styles.column} ref={columnRef}>
        <div
          draggable={isEditing}
          ref={columnRef}
          onDragStart={isEditing ? handleDragStart : undefined}
          onDrag={(e) => {
            if (e.pageY !== 0 && isEditing)
              setDragRange({ ...dragRange, end: getMinuteFromDrag(e) });
          }}
          onDragEnd={isEditing ? handleDragEnd : undefined}
        >
          {hours.map((hour) => (
            <TimeBlock key={hour} range={normalizedRange} startHour={hour * 60} />
          ))}
        </div>
        {slots.map((slot) => (
          <SlotButton
            slot={slot}
            duration={scheduler.duration}
            startHour={hours[0]}
            key={slot.uuid || `${slot.room}${slot.startTime}`}
          />
        ))}
        {isEditing &&
          filteredTentativeSlots.map((slot) => (
            <SlotButton
              tentative
              slot={slot}
              duration={scheduler.duration}
              startHour={hours[0]}
              key={slot.uuid || `${slot.room}${slot.startTime}`}
            />
          ))}
      </div>
    </div>
  );
};

const getSlotsByRoom = (filteredSlots: InterviewSlot[]) =>
  filteredSlots.reduce((acc, curr) => {
    acc.set(curr.room, [...(acc.get(curr.room) || []), curr]);
    return acc;
  }, new Map<string, InterviewSlot[]>());

const getHours = (filteredSlots: InterviewSlot[], duration: number) => {
  const minHour = new Date(Math.min(...filteredSlots.map((slot) => slot.startTime))).getHours();
  const maxHour = new Date(
    duration + Math.max(...filteredSlots.map((slot) => slot.startTime))
  ).getHours();
  return Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);
};
const SchedulingCalendar: React.FC<{
  scheduler: InterviewScheduler;
  slots: InterviewSlot[];
}> = ({ scheduler, slots }) => {
  const [day, setDay] = useState<number>(scheduler.startDate);
  const [columnName, setColumnName] = useState<string>('');
  const isAdmin = useHasAdminPermission();

  const filteredSlots = useMemo(
    () =>
      slots.filter((slot) => slot.startTime >= day && slot.startTime < day + MILLISECONDS_PER_DAY),
    [slots, day]
  );

  const [slotsByRoom, setSlotsByRoom] = useState<Map<string, InterviewSlot[]>>(
    getSlotsByRoom(filteredSlots)
  );
  const [hours, setHours] = useState<number[]>(getHours(filteredSlots, scheduler.duration));

  const { setHoveredSlot, setSelectedSlot } = useSetSlotsContext();
  const { isEditing } = useEditAvailabilityContext();

  const days = Array.from(
    {
      length: 1 + (scheduler.endDate - scheduler.startDate) / MILLISECONDS_PER_DAY
    },
    (_, i) => scheduler.startDate + i * MILLISECONDS_PER_DAY
  );
  const filteredDays = isAdmin
    ? days
    : days.filter((date) =>
        slots.some((slot) => slot.startTime >= date && slot.startTime < date + MILLISECONDS_PER_DAY)
      );
  const options = filteredDays.map((date) => ({
    text: getDateString(date, true),
    value: date
  }));

  const extendHours = (change: number) => {
    const extendedHours: number[] = Array.from({ length: Math.abs(change) }, (_, i) =>
      change < 0 ? hours[0] - i - 1 : hours[hours.length - 1] + i + 1
    ).filter((x) => x >= 0 && x <= 23);
    setHours(change < 0 ? [...extendedHours.reverse(), ...hours] : [...hours, ...extendedHours]);
  };

  useEffect(() => {
    setSlotsByRoom(getSlotsByRoom(filteredSlots));
    const hours = getHours(filteredSlots, scheduler.duration);
    setHours(hours.length === 0 ? [12] : hours);
  }, [isEditing, filteredSlots, scheduler]);

  return (
    <div className={isEditing ? styles.calendarContainerFull : styles.calendarContainer}>
      <Dropdown
        selection
        value={day}
        options={options}
        onChange={(_, data) => {
          setDay(data.value as number);
          setSelectedSlot(undefined);
          setHoveredSlot(undefined);
        }}
      />
      {isEditing && (
        <div className={styles.roomForm}>
          <Form>
            <Form.Group style={{ margin: 0 }}>
              <Form.Field
                control={Input}
                label="Room name"
                placeholder="HLS110"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setColumnName(event.target.value)
                }
                value={columnName}
              />
            </Form.Group>
          </Form>
          <Button
            basic
            disabled={columnName === ''}
            onClick={() => {
              setSlotsByRoom(slotsByRoom.set(columnName, []));
              setColumnName('');
            }}
          >
            Add New Room
          </Button>
        </div>
      )}
      <div className={styles.columnContainer}>
        <div className={styles.timeLabelColumn} style={{ marginTop: isEditing ? '-12px' : '24px' }}>
          {isEditing && (
            <Button basic disabled={hours[0] === 0} onClick={() => extendHours(-4)}>
              Extend
            </Button>
          )}
          {hours.map((hour) => (
            <p className={styles.timeLabel} key={hour}>
              {hourIndexToString(hour)}
            </p>
          ))}
          {isEditing && (
            <Button basic disabled={hours[hours.length - 1] === 23} onClick={() => extendHours(4)}>
              Extend
            </Button>
          )}
        </div>
        {Array.from(slotsByRoom.entries())
          .sort((room1, room2) => room1[0].localeCompare(room2[0]))
          .map(([room, roomSlots]) => (
            <SchedulerColumn
              room={room}
              day={day}
              slots={roomSlots}
              scheduler={scheduler}
              hours={hours}
              key={room}
            />
          ))}
      </div>
    </div>
  );
};

export default SchedulingCalendar;
