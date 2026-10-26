import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Dropdown, Form, Label, Loader, Message, Modal } from 'semantic-ui-react';
import { Emitters } from '../../../utils';
import RecruitmentTimelineAPI, {
  RecruitmentTimelineEvent
} from '../../../API/RecruitmentTimelineAPI';
import styles from './RecruitmentTimelineAdmin.module.css';

type Cycle = 'freshmen' | 'upperclassmen' | 'spring';

type CycleDateForm = {
  sortDate: string;
  endDate: string;
  time: string;
  isTentative: boolean;
};

type TimelineEventForm = {
  title: string;
  description: string;
  location: string;
  link: string;
  type: string;
  cycles: Record<Cycle, boolean>;
  cycleDates: Record<Cycle, CycleDateForm>;
};

const cycleOptions = [
  { key: 'upperclassmen', text: 'Upperclassmen', value: 'upperclassmen' },
  { key: 'freshmen', text: 'Freshmen/Transfer', value: 'freshmen' },
  { key: 'spring', text: 'Spring', value: 'spring' }
];

const eventTypeOptions = [
  { key: 'application', text: 'Application', value: 'application' },
  { key: 'deadline', text: 'Deadline', value: 'deadline' },
  { key: 'info', text: 'Info Session', value: 'info' },
  { key: 'interview', text: 'Interview', value: 'interview' },
  { key: 'offer', text: 'Offer', value: 'offer' },
  { key: 'workshop', text: 'Workshop', value: 'workshop' }
];

const emptyEventForm: TimelineEventForm = {
  title: '',
  description: '',
  location: '',
  link: '',
  type: 'info',
  cycles: { freshmen: false, upperclassmen: false, spring: false },
  cycleDates: {
    freshmen: { sortDate: '', endDate: '', time: '', isTentative: false },
    upperclassmen: { sortDate: '', endDate: '', time: '', isTentative: false },
    spring: { sortDate: '', endDate: '', time: '', isTentative: false }
  }
};

const cycleLabels: Record<Cycle, string> = {
  upperclassmen: 'Upperclassmen',
  freshmen: 'Freshmen/Transfer',
  spring: 'Spring'
};

const formatDisplayDate = (sortDate: string): string => {
  if (!sortDate) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${sortDate}T00:00:00Z`));
};

const timePattern = /^(?:[1-9]|1[0-2]):[0-5]\d(?:am|pm)(?:-(?:[1-9]|1[0-2]):[0-5]\d(?:am|pm))?$/;

type CycleDateFieldsProps = {
  form: TimelineEventForm;
  setForm: (form: TimelineEventForm) => void;
};

const CycleDateFields = ({ form, setForm }: CycleDateFieldsProps): JSX.Element => (
  <>
    {(Object.keys(form.cycles) as Cycle[])
      .filter((cycle) => form.cycles[cycle])
      .map((cycle) => {
        const cycleDate = form.cycleDates[cycle];
        const updateCycleDate = (updates: Partial<CycleDateForm>): void => {
          setForm({
            ...form,
            cycleDates: { ...form.cycleDates, [cycle]: { ...cycleDate, ...updates } }
          });
        };

        return (
          <Form.Field key={cycle}>
            <label>{cycleLabels[cycle]} date details</label>
            <Form.Group widths="equal">
              <Form.Input
                label="Date"
                type="date"
                required
                value={cycleDate.sortDate}
                onChange={(_, data) => updateCycleDate({ sortDate: data.value })}
              />
              <Form.Input
                label="End date (optional)"
                type="date"
                value={cycleDate.endDate}
                onChange={(_, data) => updateCycleDate({ endDate: data.value })}
              />
              <Form.Input
                label="Time"
                placeholder="6:00pm or 9:00am-12:00pm"
                value={cycleDate.time}
                onChange={(_, data) => updateCycleDate({ time: data.value })}
              />
            </Form.Group>
            <Form.Checkbox
              label="Tentative date"
              checked={cycleDate.isTentative}
              onChange={(_, data) => updateCycleDate({ isTentative: Boolean(data.checked) })}
            />
          </Form.Field>
        );
      })}
  </>
);

type TimelineEventFormFieldsProps = {
  form: TimelineEventForm;
  setForm: (form: TimelineEventForm) => void;
  onSubmit: () => void;
  submitLabel: string;
  isSaving: boolean;
  onCancel?: () => void;
};

const TimelineEventFormFields = ({
  form,
  setForm,
  onSubmit,
  submitLabel,
  isSaving,
  onCancel
}: TimelineEventFormFieldsProps): JSX.Element => (
  <Form onSubmit={onSubmit}>
    <Form.Input
      label="Event Title"
      placeholder="Information Session 1"
      required
      value={form.title}
      onChange={(_, data) => setForm({ ...form, title: data.value })}
    />
    <Form.TextArea
      label="Description"
      placeholder="Describe what applicants should know about this event."
      required
      value={form.description}
      onChange={(_, data) => setForm({ ...form, description: data.value as string })}
    />
    <Form.Group widths="equal">
      <Form.Input
        label="Location"
        placeholder="Gates Hall"
        value={form.location}
        onChange={(_, data) => setForm({ ...form, location: data.value })}
      />
      <Form.Input
        label="Link"
        placeholder="https://..."
        value={form.link}
        onChange={(_, data) => setForm({ ...form, link: data.value })}
      />
    </Form.Group>
    <Form.Field required>
      <label>Event Type</label>
      <Dropdown
        selection
        options={eventTypeOptions}
        value={form.type}
        onChange={(_, data) => setForm({ ...form, type: data.value as string })}
      />
    </Form.Field>
    <Form.Group grouped>
      <label>Cycles <span style={{color: "#db2828"}}>*</span></label>
      <Form.Checkbox
        label="Upperclassmen"
        checked={form.cycles.upperclassmen}
        onChange={(_, data) =>
          setForm({
            ...form,
            cycles: { ...form.cycles, upperclassmen: Boolean(data.checked) }
          })
        }
      />
      <Form.Checkbox
        label="Freshmen/Transfer"
        checked={form.cycles.freshmen}
        onChange={(_, data) =>
          setForm({ ...form, cycles: { ...form.cycles, freshmen: Boolean(data.checked) } })
        }
      />
      <Form.Checkbox
        label="Spring"
        checked={form.cycles.spring}
        onChange={(_, data) =>
          setForm({ ...form, cycles: { ...form.cycles, spring: Boolean(data.checked) } })
        }
      />
    </Form.Group>
    <CycleDateFields form={form} setForm={setForm} />
    <Button primary type="submit" loading={isSaving} disabled={isSaving}>
      {submitLabel}
    </Button>
    {onCancel && (
      <Button type="button" disabled={isSaving} onClick={onCancel}>
        Cancel
      </Button>
    )}
  </Form>
);

const RecruitmentTimelineAdmin = (): JSX.Element => {
  const [events, setEvents] = useState<RecruitmentTimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<Cycle>('upperclassmen');
  const [form, setForm] = useState<TimelineEventForm>(emptyEventForm);
  const [editingEvent, setEditingEvent] = useState<RecruitmentTimelineEvent | null>(null);
  const [editForm, setEditForm] = useState<TimelineEventForm>(emptyEventForm);
  const [isSaving, setIsSaving] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<RecruitmentTimelineEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    RecruitmentTimelineAPI.getAllRecruitmentTimelineEvents()
      .then((recruitmentEvents) => {
        setEvents(Array.isArray(recruitmentEvents) ? recruitmentEvents : []);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: 'Error loading recruitment timeline events',
          contentMsg: error?.message ?? 'Something went wrong'
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const cycleEvents = useMemo(
    () =>
      events
        .filter((event) => event[selectedCycle])
        .sort((eventA, eventB) => {
          const firstSortDate = eventA[selectedCycle]?.sortDate;
          const secondSortDate = eventB[selectedCycle]?.sortDate;
          if (!firstSortDate && !secondSortDate) {
            return eventA.title.localeCompare(eventB.title);
          }
          if (!firstSortDate) return 1;
          if (!secondSortDate) return -1;
          return firstSortDate.localeCompare(secondSortDate) || eventA.title.localeCompare(eventB.title);
        }),
    [events, selectedCycle]
  );

  const createTimelineEvent = async (
    eventForm = form,
    eventToUpdate = editingEvent
  ): Promise<void> => {
    if (!eventForm.title.trim() || !eventForm.description.trim()) {
      Emitters.generalError.emit({
        headerMsg: 'Missing event details',
        contentMsg: 'Title and description are required.'
      });
      return;
    }

    if (!Object.values(eventForm.cycles).some(Boolean)) {
      Emitters.generalError.emit({
        headerMsg: 'Select a cycle',
        contentMsg: 'Choose at least one recruitment cycle for this event.'
      });
      return;
    }

    const selectedCycleWithoutDates = (Object.keys(eventForm.cycles) as Cycle[]).find(
      (cycle) => eventForm.cycles[cycle] && !eventForm.cycleDates[cycle].sortDate
    );
    if (selectedCycleWithoutDates) {
      Emitters.generalError.emit({
        headerMsg: 'Missing event date',
        contentMsg: `Enter a date for ${cycleLabels[selectedCycleWithoutDates]}.`
      });
      return;
    }

    const invalidTimeCycle = (Object.keys(eventForm.cycles) as Cycle[]).find(
      (cycle) =>
        eventForm.cycles[cycle] &&
        Boolean(eventForm.cycleDates[cycle].time) &&
        !timePattern.test(eventForm.cycleDates[cycle].time)
    );
    if (invalidTimeCycle) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid event time',
        contentMsg: `Enter a time for ${cycleLabels[invalidTimeCycle]} in the format 6:00pm or 9:00am-12:00pm.`
      });
      return;
    }

    const event: RecruitmentTimelineEvent = {
      ...(eventToUpdate ?? { id: '' }),
      title: eventForm.title.trim(),
      description: eventForm.description.trim(),
      type: eventForm.type,
      ...(eventForm.location.trim() ? { location: eventForm.location.trim() } : {}),
      ...(eventForm.link.trim() ? { link: eventForm.link.trim() } : {})
    };

    (Object.keys(eventForm.cycles) as Cycle[]).forEach((cycle) => {
      if (eventForm.cycles[cycle]) {
        const cycleDate = eventForm.cycleDates[cycle];
        event[cycle] = {
          date: formatDisplayDate(cycleDate.sortDate),
          sortDate: cycleDate.sortDate,
          ...(cycleDate.endDate ? { endDate: cycleDate.endDate } : {}),
          ...(cycleDate.time.trim() ? { time: cycleDate.time.trim() } : {}),
          isTentative: cycleDate.isTentative
        };
      } else {
        delete event[cycle];
      }
    });

    if (!eventForm.location.trim()) delete event.location;
    if (!eventForm.link.trim()) delete event.link;

    setIsSaving(true);
    try {
      const savedEvent = await RecruitmentTimelineAPI.createTimelineEvent(event);
      setEvents((currentEvents) => {
        const eventIndex = currentEvents.findIndex(({ id }) => id === savedEvent.id);
        const updatedEvents =
          eventIndex === -1
            ? [...currentEvents, savedEvent]
            : currentEvents.map((currentEvent) =>
                currentEvent.id === savedEvent.id ? savedEvent : currentEvent
              );

        return updatedEvents;
      });
      if (eventToUpdate) setEditForm(emptyEventForm);
      else setForm(emptyEventForm);
      setEditingEvent(null);
    } catch (error) {
      Emitters.generalError.emit({
        headerMsg: 'Error saving recruitment timeline event',
        contentMsg: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const editTimelineEvent = (event: RecruitmentTimelineEvent): void => {
    setEditingEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      location: event.location ?? '',
      link: event.link ?? '',
      type: event.type,
      cycles: {
        freshmen: Boolean(event.freshmen),
        upperclassmen: Boolean(event.upperclassmen),
        spring: Boolean(event.spring)
      },
      cycleDates: {
        freshmen: {
          sortDate: event.freshmen?.sortDate ?? '',
          endDate: event.freshmen?.endDate ?? '',
          time: event.freshmen?.time ?? '',
          isTentative: event.freshmen?.isTentative ?? false
        },
        upperclassmen: {
          sortDate: event.upperclassmen?.sortDate ?? '',
          endDate: event.upperclassmen?.endDate ?? '',
          time: event.upperclassmen?.time ?? '',
          isTentative: event.upperclassmen?.isTentative ?? false
        },
        spring: {
          sortDate: event.spring?.sortDate ?? '',
          endDate: event.spring?.endDate ?? '',
          time: event.spring?.time ?? '',
          isTentative: event.spring?.isTentative ?? false
        }
      }
    });
  };

  const deleteTimelineEvent = async (): Promise<void> => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      await RecruitmentTimelineAPI.deleteTimelineEvent(eventToDelete.id);
      setEvents((currentEvents) =>
        currentEvents.filter((currentEvent) => currentEvent.id !== eventToDelete.id)
      );
      setEventToDelete(null);
    } catch (error) {
      Emitters.generalError.emit({
        headerMsg: 'Error deleting recruitment timeline event',
        contentMsg: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderTimelineEvents = (): JSX.Element => {
    if (isLoading) return <Loader active inline />;
    if (cycleEvents.length === 0) {
      return <Message>There are currently no recruitment timeline events for this cycle.</Message>;
    }

    return (
      <Card.Group>
        {cycleEvents.map((event) => {
          const cycleDate = event[selectedCycle];
          return (
            <Card key={event.id}>
              <Card.Content>
                <Card.Header>{event.title}</Card.Header>
                <Card.Meta className={styles.eventMeta}>
                  <span>
                    {cycleDate?.date}
                    {cycleDate?.endDate ? ` - ${formatDisplayDate(cycleDate.endDate)}` : ''}
                    {cycleDate?.time ? `, ${cycleDate.time}` : ''}
                    {cycleDate?.isTentative ? ' (tentative)' : ''}
                  </span>
                  <span>Type: {event.type}</span>
                  {event.location && <span>Location: {event.location}</span>}
                </Card.Meta>
                <Card.Description>{event.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className={styles.eventActions}>
                  <Button basic color="blue" type="button" onClick={() => editTimelineEvent(event)}>
                    Edit
                  </Button>
                  <Button basic color="red" type="button" onClick={() => setEventToDelete(event)}>
                    Delete
                  </Button>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    );
  };

  return (
    <div>
      <div className={[styles.formWrapper, styles.wrapper].join(' ')}>
        <div className={styles.createHeader}>
          <h1>Create a Recruitment Timeline Event</h1>
          <Label color="blue">Draft edits save to Firebase</Label>
        </div>
        <TimelineEventFormFields
          form={form}
          setForm={setForm}
          onSubmit={() => createTimelineEvent()}
          submitLabel="Add Event"
          isSaving={isSaving}
        />
      </div>

      <div className={styles.wrapper}>
        <h2>View All Recruitment Timeline Events</h2>
        <div className={styles.cycleControls}>
          <Dropdown
            selection
            options={cycleOptions}
            value={selectedCycle}
            onChange={(_, data) => setSelectedCycle(data.value as Cycle)}
          />
        </div>
        {renderTimelineEvents()}
        <div className={styles.buttonContainer}>
          <div>
            <Button color="blue" type="button">
              Create Website PR
            </Button>
            <p className={styles.publishNote}>
              Use this only after all timeline changes are ready for the website.
            </p>
          </div>
          <Button basic type="button">
            Preview Diff
          </Button>
        </div>
      </div>
      <Modal
        open={Boolean(editingEvent)}
        onClose={() => setEditingEvent(null)}
        closeOnDimmerClick={!isSaving}
      >
        <Modal.Header>Edit Recruitment Timeline Event</Modal.Header>
        <Modal.Content>
          <TimelineEventFormFields
            form={editForm}
            setForm={setEditForm}
            onSubmit={() => createTimelineEvent(editForm, editingEvent)}
            submitLabel="Save Changes"
            isSaving={isSaving}
            onCancel={() => setEditingEvent(null)}
          />
        </Modal.Content>
      </Modal>
      <Modal
        size="small"
        open={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        closeOnDimmerClick={!isDeleting}
      >
        <Modal.Header>Delete Recruitment Timeline Event</Modal.Header>
        <Modal.Content>
          <p>
            Delete <strong>{eventToDelete?.title}</strong>? This deletes the event for all cycles
            and cannot be undone
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button type="button" disabled={isDeleting} onClick={() => setEventToDelete(null)}>
            Cancel
          </Button>
          <Button
            negative
            type="button"
            loading={isDeleting}
            disabled={isDeleting}
            onClick={deleteTimelineEvent}
          >
            Delete Event
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default RecruitmentTimelineAdmin;
