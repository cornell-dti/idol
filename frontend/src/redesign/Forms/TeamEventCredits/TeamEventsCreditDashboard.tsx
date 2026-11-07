import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LEAD_ROLES } from 'common-types/constants';
import { useSelf } from '../../../components/Common/FirestoreDataProvider';
import {
  Button,
  Card,
  Input,
  Modal,
  Pill,
  Tab,
  TabRoot,
  TabList,
  TabPanel
} from '../../../design-system-2026/components';
import {
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XCircleIcon
} from '../../../design-system-2026/icons';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import ImagesAPI from '../../../API/ImagesAPI';
import { Emitters } from '../../../utils';
import { INITIATIVE_EVENTS, REQUIRED_INITIATIVE_CREDITS } from '../../../consts';
import styles from './TeamEventCredits.module.css';

function ProofThumbnail({ path, onClick }: { path: string; onClick: () => void }): JSX.Element {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let active = true;
    ImagesAPI.getImage(path)
      .then((next) => {
        if (active) setUrl(next);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [path]);
  return (
    <button type="button" className={styles.thumbnail} aria-label="Preview proof" onClick={onClick}>
      {url ? (
        <img src={url} width={64} height={64} alt="Event attendance proof" />
      ) : (
        <span>Preview</span>
      )}
    </button>
  );
}

export default function TeamEventCreditDashboard(props: {
  allTEC: TeamEventInfo[];
  approvedAttendance: TeamEventAttendance[];
  pendingAttendance: TeamEventAttendance[];
  rejectedAttendance: TeamEventAttendance[];
  isAttendanceLoading: boolean;
  setPendingAttendance: Dispatch<SetStateAction<TeamEventAttendance[]>>;
  requiredPeriodCredits: number;
  tecCounts: number[];
  tecDeadlines: Date[];
  tecConfig: TECConfig;
  remainingInternalCredits: number;
  remainingExternalCredits: number;
  internalCounts: number[];
  externalCounts: number[];
}): JSX.Element {
  const {
    allTEC,
    approvedAttendance,
    pendingAttendance,
    rejectedAttendance,
    isAttendanceLoading,
    setPendingAttendance,
    tecConfig,
    requiredPeriodCredits,
    remainingInternalCredits,
    remainingExternalCredits
  } = props;
  const user = useSelf();
  const [tab, setTab] = useState('approved');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<TeamEventAttendance | null>(null);
  const [cancel, setCancel] = useState(false);
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const credits = (attendance: TeamEventAttendance) => {
    const event = allTEC.find((e) => e.uuid === attendance.eventUuid);
    return Number(event?.numCredits || 0) * (event?.hasHours ? attendance.hoursAttended ?? 1 : 1);
  };
  const initiative = approvedAttendance.reduce(
    (total, attendance) =>
      total +
      (allTEC.find((event) => event.uuid === attendance.eventUuid)?.isInitiativeEvent
        ? credits(attendance)
        : 0),
    0
  );
  const required =
    user && LEAD_ROLES.includes(user.role)
      ? tecConfig.requiredLeadTecCredits
      : tecConfig.requiredMemberTecCredits;
  const preview = async (attendance: TeamEventAttendance) => {
    setSelected(attendance);
    setCancel(false);
    setImage('');
    setImageError(false);
    setError('');
    try {
      setImage(await ImagesAPI.getImage(attendance.image));
    } catch {
      setImageError(true);
    }
  };
  const remove = async () => {
    if (!selected || busy) return;
    setBusy(true);
    setError('');
    try {
      await TeamEventsAPI.deleteTeamEventAttendance(selected.uuid);
      setPendingAttendance((items) => items.filter((item) => item.uuid !== selected.uuid));
      await ImagesAPI.deleteImage(selected.image);
      setSelected(null);
      Emitters.teamEventsUpdated.emit();
    } catch {
      setError('Could not cancel the request. Please refresh your history before trying again.');
    } finally {
      setBusy(false);
    }
  };
  const list = (status: string, attendance: TeamEventAttendance[]) => {
    const matches = attendance.filter((item) => {
      const event = allTEC.find((e) => e.uuid === item.eventUuid);
      return `${event?.name ?? ''} ${event?.date ?? ''} ${event?.kind ?? ''} ${item.reason}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    });
    if (isAttendanceLoading)
      return (
        <Card>
          <p role="status">Loading requests…</p>
        </Card>
      );
    if (!matches.length)
      return (
        <Card>
          <p role="status">
            {search ? 'No matching requests. Try another search.' : `No ${status} requests yet.`}
          </p>
        </Card>
      );
    return (
      <div className={styles.cards}>
        {matches.map((attendance) => {
          const event = allTEC.find((e) => e.uuid === attendance.eventUuid);
          return (
            <Card
              key={attendance.uuid}
              header={
                event
                  ? new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Event unavailable'
              }
              action={
                status === 'pending' && (
                  <Button
                    variant="secondaryDanger"
                    icon={<TrashIcon size={16} />}
                    onClick={() => {
                      setSelected(attendance);
                      setCancel(true);
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                )
              }
            >
              <div className={styles.cardTitle}>
                <h3>{event?.name ?? 'Event no longer available'}</h3>
                {tecConfig.considerEventKind && event?.kind && (
                  <Pill color={event.kind === 'external' ? 'green' : 'accent'}>
                    {event.kind === 'external' ? 'External' : 'Internal'}
                  </Pill>
                )}
              </div>
              {!event && <p>Contact #idol-support about this request.</p>}
              <div className={styles.creditRow}>
                <p>
                  Credits {status === 'approved' ? 'granted' : 'requested'}{' '}
                  <strong>{credits(attendance)}</strong>
                  {event && event.maxCredits !== event.numCredits && ` (${event.maxCredits} max)`}
                </p>
                <ProofThumbnail path={attendance.image} onClick={() => preview(attendance)} />
              </div>
              {event?.hasHours && <p>Hours attended: {attendance.hoursAttended ?? 1}</p>}
              {INITIATIVE_EVENTS && (
                <p>Initiative event: {event?.isInitiativeEvent ? 'Yes' : 'No'}</p>
              )}
              {attendance.reason && <p>Reason: {attendance.reason}</p>}
            </Card>
          );
        })}
      </div>
    );
  };
  const event = allTEC.find((item) => item.uuid === selected?.eventUuid);
  return (
    <section className={styles.history}>
      <h2 className="idol-heading-2">Check Team Event Credits</h2>
      <p>
        Check your team event credit status for this semester here!{' '}
        {tecConfig.considerEventKind
          ? `You need ${remainingInternalCredits} more internal and ${remainingExternalCredits} more external credits this period.`
          : `Your requirement is ${required} credits per period, with ${requiredPeriodCredits} remaining this period.`}
      </p>
      {INITIATIVE_EVENTS && (
        <p>
          Approved initiative credits: {initiative}. Remaining:{' '}
          {Math.max(0, REQUIRED_INITIATIVE_CREDITS - initiative)}.
        </p>
      )}
      <TabRoot value={tab} onValueChange={(value) => setTab(String(value))}>
        <div className={styles.toolbar}>
          <TabList className={styles.tabs} aria-label="Credit request status">
            <Tab value="approved" icon={<CheckCircleIcon size={16} />}>
              Approved
            </Tab>
            <Tab value="pending" icon={<ClockIcon size={16} />}>
              Pending
            </Tab>
            <Tab value="rejected" icon={<XCircleIcon size={16} />}>
              Rejected
            </Tab>
          </TabList>
          <Input
            id="tec-search"
            aria-label="Search credit requests"
            placeholder="Search"
            icon={<MagnifyingGlassIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <TabPanel value="approved" className={styles.panel}>
          {list('approved', approvedAttendance)}
        </TabPanel>
        <TabPanel value="pending" className={styles.panel}>
          {list('pending', pendingAttendance)}
        </TabPanel>
        <TabPanel value="rejected" className={styles.panel}>
          {list('rejected', rejectedAttendance)}
        </TabPanel>
      </TabRoot>
      <Modal
        id="tec-request-modal"
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !busy) setSelected(null);
        }}
        title={cancel ? 'Cancel this credit request?' : 'Team Event Credit Preview'}
        description={
          cancel
            ? 'Your pending submission and its proof will be removed.'
            : event?.name ?? 'Event unavailable'
        }
        footer={
          <>
            <Button variant="secondary" disabled={busy} onClick={() => setSelected(null)}>
              {cancel ? 'Keep request' : 'Done'}
            </Button>
            {cancel && (
              <Button
                variant="danger"
                disabled={busy}
                icon={<TrashIcon size={16} />}
                onClick={remove}
              >
                {busy ? 'Cancelling…' : 'Cancel request'}
              </Button>
            )}
          </>
        }
      >
        <div className={styles.proofs}>
          {selected && (
            <>
              <p>
                {selected.member.firstName} {selected.member.lastName}
              </p>
              <p>Credits: {credits(selected)}</p>
              {selected.hoursAttended !== undefined && (
                <p>Hours attended: {selected.hoursAttended}</p>
              )}
              {selected.reason && <p>Reason: {selected.reason}</p>}
            </>
          )}
          {!cancel && (
            <>
              {!image && !imageError && <p role="status">Loading proof…</p>}
              {imageError && <p role="alert">Could not load proof.</p>}
              {image && !imageError && (
                <img
                  className={styles.preview}
                  src={image}
                  alt="Event attendance proof"
                  onError={() => setImageError(true)}
                />
              )}
            </>
          )}
          {error && <p role="alert">{error}</p>}
        </div>
      </Modal>
    </section>
  );
}
