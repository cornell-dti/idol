import { useMemo, useState } from 'react';
import {
  ArrowRightIcon,
  CalendarBlankIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  PencilSimpleLineIcon,
  PlusIcon,
  UsersIcon,
  XIcon
} from '../../design-system-2026/icons';
import {
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  ModalClose,
  Pill,
  Select,
  Textarea
} from '../../design-system-2026/components';
import styles from './Attendance.module.css';

type AttendanceStatus = 'present' | 'absent' | 'future';
type AttendanceDate = {
  id: string;
  date: string;
  attendance: AttendanceStatus[];
  cancelled?: boolean;
};

type AttendanceRow = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  absences: number;
  attendance: AttendanceStatus[];
};

type EditTarget = { rowId: string; dateIndex: number } | null;
type AttendanceSession = {
  date: string;
  codeWord: string;
  startedAt: string;
};

const initialRows: AttendanceRow[] = [
  {
    id: 'clement-1',
    name: 'Clément Rozé',
    role: 'Design',
    absences: 1,
    attendance: ['present', 'absent', 'present', 'present', 'present', 'future', 'future']
  },
  {
    id: 'clement-2',
    name: 'Clément Rozé',
    role: 'Design',
    absences: 2,
    attendance: ['present', 'absent', 'present', 'absent', 'present', 'future', 'future']
  },
  {
    id: 'clement-3',
    name: 'Clément Rozé',
    role: 'Design',
    absences: 2,
    attendance: ['absent', 'absent', 'present', 'present', 'present', 'future', 'future']
  },
  {
    id: 'clement-4',
    name: 'Clément Rozé',
    role: 'Design',
    absences: 3,
    attendance: ['present', 'absent', 'present', 'absent', 'present', 'future', 'future']
  },
  {
    id: 'clement-5',
    name: 'Clément Rozé',
    role: 'Design',
    absences: 2,
    attendance: ['absent', 'absent', 'present', 'present', 'present', 'future', 'future']
  },
  {
    id: 'clement-6',
    name: 'Clément Rozé',
    role: 'Design',
    absences: 1,
    attendance: ['present', 'absent', 'present', 'present', 'present', 'future', 'future']
  }
];

const initialAttendanceDates: AttendanceDate[] = [
  { id: 'ah-1', date: '2026-10-10', attendance: initialRows.map((row) => row.attendance[0]) },
  { id: 'ah-2', date: '2026-10-17', attendance: initialRows.map((row) => row.attendance[1]) },
  { id: 'ah-3', date: '2026-10-24', attendance: initialRows.map((row) => row.attendance[2]) },
  { id: 'ah-4', date: '2026-10-31', attendance: initialRows.map((row) => row.attendance[3]) },
  { id: 'ah-5', date: '2026-11-07', attendance: initialRows.map((row) => row.attendance[4]) },
  { id: 'ah-6', date: '2026-11-14', attendance: initialRows.map((row) => row.attendance[5]) },
  { id: 'ah-7', date: '2026-11-21', attendance: initialRows.map((row) => row.attendance[6]) }
];

const springDates: AttendanceDate[] = [
  {
    id: 'sp-ah-1',
    date: '2026-02-07',
    attendance: ['present', 'present', 'absent', 'present', 'present', 'absent']
  },
  {
    id: 'sp-ah-2',
    date: '2026-02-14',
    attendance: ['absent', 'present', 'present', 'present', 'absent', 'present']
  },
  {
    id: 'sp-ah-3',
    date: '2026-02-21',
    attendance: ['present', 'absent', 'present', 'absent', 'present', 'present']
  }
];
const fallPreviousDates: AttendanceDate[] = [
  {
    id: 'fa-ah-1',
    date: '2025-09-06',
    attendance: ['present', 'absent', 'present', 'present', 'absent', 'present']
  },
  {
    id: 'fa-ah-2',
    date: '2025-09-20',
    attendance: ['present', 'present', 'present', 'absent', 'present', 'present']
  },
  {
    id: 'fa-ah-3',
    date: '2025-10-04',
    attendance: ['absent', 'present', 'present', 'present', 'present', 'absent']
  }
];

const formatAttendanceDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const semesterOptions = [
  { value: 'fall-2026', label: 'Fall 2026' },
  { value: 'spring-2026', label: 'Spring 2026' },
  { value: 'fall-2025', label: 'Fall 2025' }
];

const statusOptions = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'excused', label: 'Excused' }
];

const codeWordBank = [
  'hamster',
  'table',
  'chair',
  'burger',
  'exam',
  'rocket',
  'pickle',
  'waffle',
  'penguin',
  'marshmallow',
  'telescope',
  'banana',
  'rainbow',
  'pancake',
  'dinosaur',
  'scooter',
  'moonwalk',
  'jellybean',
  'toaster',
  'confetti', 
  'idol',
  'innovation',
  'flocculent',
  'goat'
];

const pickRandomCodeWords = () => [...codeWordBank]
  .sort(() => Math.random() - 0.5)
  .slice(0, 4);

function AttendanceCell({
  status,
  onClick,
  label
}: {
  readonly status: AttendanceStatus;
  readonly onClick: () => void;
  readonly label: string;
}): JSX.Element {
  if (status === 'future') return <span className={styles.futureCell}>--</span>;
  return (
    <button
      type="button"
      className={`${styles.attendanceCell} ${status === 'absent' ? styles.absentCell : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      <span className={styles.attendanceStatus}>
        {status === 'present' ? (
          <CheckIcon size={16} aria-hidden="true" />
        ) : (
          <XIcon size={16} aria-hidden="true" />
        )}
      </span>
      <span className={styles.editAttendanceButton} aria-hidden="true">
        <PencilSimpleLineIcon size={20} />
      </span>
    </button>
  );
}

export function AttendanceTracker(): JSX.Element {
  const [semester, setSemester] = useState('fall-2026');
  const [semesters, setSemesters] = useState(semesterOptions);
  const [semesterDates, setSemesterDates] = useState<Record<string, AttendanceDate[]>>({
    'fall-2026': initialAttendanceDates,
    'spring-2026': springDates,
    'fall-2025': fallPreviousDates
  });
  const [rows] = useState<AttendanceRow[]>(initialRows);
  const dates = useMemo(() => semesterDates[semester] ?? [], [semester, semesterDates]);
  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [addSemesterOpen, setAddSemesterOpen] = useState(false);
  const [semesterName, setSemesterName] = useState('');
  const [startOpen, setStartOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [dateTarget, setDateTarget] = useState<string | null>(null);
  const [dateDraft, setDateDraft] = useState('');
  const [dateCancelled, setDateCancelled] = useState(false);
  const [addDateOpen, setAddDateOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [editStatus, setEditStatus] = useState('excused');
  const [editNote, setEditNote] = useState('');
  const [startDate, setStartDate] = useState('November 21, 2026 (today)');
  const [codeWord, setCodeWord] = useState('');
  const [codeWordSuggestions, setCodeWordSuggestions] = useState(pickRandomCodeWords);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);

  const visibleRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return rows
      .map((row, rowIndex) => ({
        ...row,
        absences: dates.reduce(
          (count, date) =>
            count + (!date.cancelled && date.attendance[rowIndex] === 'absent' ? 1 : 0),
          0
        )
      }))
      .filter((row) => {
        const matchesSearch =
          !normalized || `${row.name} ${row.role}`.toLowerCase().includes(normalized);
        const matchesFilter =
          memberFilter === 'all' || (memberFilter === 'absent' && row.absences > 0);
        return matchesSearch && matchesFilter;
      });
  }, [dates, memberFilter, rows, search]);

  const editingRow = editTarget ? rows.find((row) => row.id === editTarget.rowId) : undefined;
  const saveDate = () => {
    if (!dateTarget || !dateDraft) return;
    setSemesterDates((all) => ({
      ...all,
      [semester]: (all[semester] ?? [])
        .map((date) =>
          date.id === dateTarget ? { ...date, date: dateDraft, cancelled: dateCancelled } : date
        )
        .sort((a, b) => a.date.localeCompare(b.date))
    }));
    setDateTarget(null);
  };

  const addDate = () => {
    if (!newDate) return;
    setSemesterDates((all) => ({
      ...all,
      [semester]: [
        ...(all[semester] ?? []),
        {
          id: `ah-${Date.now()}`,
          date: newDate,
          attendance: rows.map((): AttendanceStatus => 'future')
        }
      ].sort((a, b) => a.date.localeCompare(b.date))
    }));
    setNewDate('');
    setAddDateOpen(false);
  };

  const saveAttendance = () => {
    if (!editTarget) return;
    const rowIndex = rows.findIndex((row) => row.id === editTarget.rowId);
    const nextStatus: AttendanceStatus = editStatus === 'present' ? 'present' : 'absent';
    setSemesterDates((all) => ({
      ...all,
      [semester]: (all[semester] ?? []).map((date, index) =>
        index === editTarget.dateIndex
          ? {
              ...date,
              attendance: date.attendance.map((status, i) => (i === rowIndex ? nextStatus : status))
            }
          : date
      )
    }));
    setEditTarget(null);
  };

  const addSemester = () => {
    const name = semesterName.trim();
    if (!name) return;

    const value = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingSemester = semesters.find((option) => option.value === value);
    if (existingSemester) {
      setSemester(existingSemester.value);
    } else {
      setSemesters((currentSemesters) => [...currentSemesters, { value, label: name }]);
      setSemesterDates((all) => ({ ...all, [value]: [] }));
      setSemester(value);
    }
    setSemesterName('');
    setAddSemesterOpen(false);
  };

  const startAttendance = () => {
    setActiveSession({
      date: startDate,
      codeWord: codeWord.trim() || 'hamster',
      startedAt: new Date().toISOString()
    });
    setStartOpen(false);
  };

  const endAttendance = () => {
    setActiveSession(null);
  };

  return (
    <div data-idol-redesign className={`${styles.page} ${styles.adminPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Attendance Tracker</h1>
          <div className={styles.toolbar}>
            <Select
              id="attendance-semester"
              aria-label="Semester"
              value={semester}
              onValueChange={(value) => setSemester(value ?? 'fall-2026')}
              icon={<CalendarBlankIcon size={16} aria-hidden="true" />}
              options={semesters}
            />
            <Button
              variant="secondary"
              icon={<PlusIcon size={16} aria-hidden="true" />}
              onClick={() => setAddSemesterOpen(true)}
            >
              Add semester
            </Button>
          </div>
        </div>
        {activeSession ? (
          <Button
            variant="danger"
            icon={<XIcon size={16} aria-hidden="true" />}
            onClick={endAttendance}
          >
            End attendance
          </Button>
        ) : (
          <Button
            icon={<ArrowRightIcon size={16} aria-hidden="true" />}
            onClick={() => setStartOpen(true)}
          >
            Start attendance
          </Button>
        )}
      </div>

      <div
        className={`${styles.attendanceSummary} ${activeSession ? styles.hasActiveSession : ''}`}
      >
        {activeSession && (
          <section className={styles.activeSessionCard} aria-live="polite">
            <div className={styles.activeSessionHeading}>
              <span className={styles.activeSessionDot} aria-hidden="true" />
              <span>Attendance is open</span>
            </div>
            <div className={styles.activeSessionCode}>{activeSession.codeWord.toUpperCase()}</div>
            <div className={styles.activeSessionLabel}>Code word</div>
          </section>
        )}
        <Card header="Statistics" className={styles.statisticsCard} direction="row">
          <div className={styles.stat}>
            <strong>56</strong>
            <span>{activeSession ? 'Fall 2026' : 'Active members'}</span>
          </div>
          <div className={styles.stat}>
            <strong>85%</strong>
            <span>Average attendance</span>
          </div>
          <div className={styles.stat}>
            <strong>13</strong>
            <span>Members with 3+ absences</span>
          </div>
        </Card>
      </div>

      <Card
        header="Attendance overview"
        className={styles.overviewCard}
        action={
          <div className={styles.overviewActions}>
            <Input
              id="attendance-search"
              aria-label="Search members"
              type="search"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              icon={<MagnifyingGlassIcon size={16} aria-hidden="true" />}
            />
            <Select
              id="attendance-member-filter"
              aria-label="Member filter"
              value={memberFilter}
              onValueChange={(value) => setMemberFilter(value ?? 'all')}
              icon={<UsersIcon size={16} aria-hidden="true" />}
              options={[
                { value: 'all', label: 'All members' },
                { value: 'absent', label: 'Members with absences' }
              ]}
            />
            <Button
              variant="secondary"
              icon={<PlusIcon size={16} aria-hidden="true" />}
              onClick={() => setAddDateOpen(true)}
            >
              Add date
            </Button>
          </div>
        }
      >
        {dates.length === 0 ? (
          <div className={styles.emptyDatesState}>
            <strong>No all-hands dates yet</strong>
            <span>Add an all-hands date to start tracking attendance for this semester.</span>
          </div>
        ) : (
          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Member</th>
                  <th scope="col">Absences</th>
                  {dates.map((date) => {
                    const present = date.attendance.filter((status) => status === 'present').length;
                    const recorded = date.attendance.filter((status) => status !== 'future').length;
                    let detail = '--';
                    if (date.cancelled) detail = 'Cancelled';
                    else if (recorded) detail = `${present}/${rows.length} present`;
                    return (
                      <th scope="col" key={date.id} className={styles.dateHeaderCell}>
                        <div className={styles.dateHeaderContent}>
                          <span>{formatAttendanceDate(date.date)}</span>
                          <span className={styles.dateDetail}>{detail}</span>
                          <button
                            type="button"
                            className={styles.dateEditButton}
                            aria-label={`Edit all-hands date ${formatAttendanceDate(date.date)}`}
                            onClick={() => {
                              setDateTarget(date.id);
                              setDateDraft(date.date);
                              setDateCancelled(Boolean(date.cancelled));
                            }}
                          >
                            <PencilSimpleLineIcon size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" className={styles.memberCell}>
                      <strong>{row.name}</strong>
                      <span>{row.role}</span>
                    </th>
                    <td>{row.absences}</td>
                    {dates.map((date) => {
                      const rowIndex = rows.findIndex((candidate) => candidate.id === row.id);
                      const status = date.attendance[rowIndex] ?? 'future';
                      return (
                        <td key={`${row.id}-${date.id}`} className={styles.attendanceCellContainer}>
                          {date.cancelled ? (
                            <span className={styles.futureCell} aria-label="All-hands cancelled">
                              --
                            </span>
                          ) : (
                            <AttendanceCell
                              status={status}
                              label={`Edit ${row.name} attendance for ${formatAttendanceDate(date.date)}`}
                              onClick={() => {
                                if (status === 'future') return;
                                setEditTarget({ rowId: row.id, dateIndex: dates.indexOf(date) });
                                setEditStatus(status === 'present' ? 'present' : 'excused');
                              }}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        id="edit-all-hands-date-modal"
        open={Boolean(dateTarget)}
        onOpenChange={(open) => !open && setDateTarget(null)}
        title="Edit all-hands date"
        description="Each all-hands appears as a column in your attendance sheet."
        surfaceClassName={styles.editDateModal}
        footer={
          <>
            <ModalClose render={<Button variant="secondary">Cancel</Button>} />
            <Button
              icon={<CheckIcon size={16} aria-hidden="true" />}
              disabled={!dateDraft}
              onClick={saveDate}
            >
              Save date
            </Button>
          </>
        }
      >
        <Input
          id="edit-all-hands-date"
          label="All-hands date"
          type="date"
          value={dateDraft}
          onChange={(event) => setDateDraft(event.target.value)}
        />
        <div className={styles.cancelAllHandsField}>
          <label className={styles.cancelAllHandsLabel}>
            <Checkbox
              checked={dateCancelled}
              onCheckedChange={(checked) => setDateCancelled(checked === true)}
              aria-label="Cancel this all-hands"
            />
            <span>Cancel this all-hands</span>
          </label>
          <p>
            Cancelled dates stay visible but do not count toward attendance or absences. Uncheck to
            restore the column.
          </p>
        </div>
      </Modal>

      <Modal
        id="add-all-hands-date-modal"
        open={addDateOpen}
        onOpenChange={setAddDateOpen}
        title="Add all-hands date"
        description="Add a planned all-hands to this semester’s attendance tracker."
        surfaceClassName={styles.compactModal}
        footer={
          <>
            <ModalClose render={<Button variant="secondary">Cancel</Button>} />
            <Button
              icon={<PlusIcon size={16} aria-hidden="true" />}
              disabled={!newDate}
              onClick={addDate}
            >
              Add date
            </Button>
          </>
        }
      >
        <Input
          id="new-all-hands-date"
          label="All-hands date"
          type="date"
          value={newDate}
          onChange={(event) => setNewDate(event.target.value)}
        />
      </Modal>

      <Modal
        id="add-semester-modal"
        open={addSemesterOpen}
        onOpenChange={setAddSemesterOpen}
        title="Add semester"
        description="Create a semester to start tracking attendance for your team."
        surfaceClassName={styles.compactModal}
        footer={
          <>
            <ModalClose render={<Button variant="secondary">Cancel</Button>} />
            <Button
              icon={<PlusIcon size={16} aria-hidden="true" />}
              disabled={!semesterName.trim()}
              onClick={addSemester}
            >
              Add semester
            </Button>
          </>
        }
      >
        <div className={styles.modalFields}>
          <Input
            id="new-semester-name"
            label="Semester name"
            placeholder="e.g. Spring 2027"
            value={semesterName}
            onChange={(event) => setSemesterName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && semesterName.trim()) addSemester();
            }}
          />
        </div>
      </Modal>

      <Modal
        id="start-attendance-modal"
        open={startOpen}
        onOpenChange={setStartOpen}
        title="Start attendance"
        description="Choose an all-hands and share one code word with everyone."
        surfaceClassName={styles.startAttendanceModal}
        footer={
          <>
            <ModalClose render={<Button variant="secondary">Cancel</Button>} />
            <Button
              icon={<ArrowRightIcon size={16} aria-hidden="true" />}
              onClick={startAttendance}
            >
              Start attendance
            </Button>
          </>
        }
      >
        <div className={styles.modalFields}>
          <Select
            id="attendance-start-date"
            label="All-hands"
            value={startDate}
            onValueChange={(value) => setStartDate(value ?? startDate)}
            options={[{ value: 'November 21, 2026 (today)', label: 'November 21, 2026 (today)' }]}
          />
          <Input
            id="attendance-code-word"
            label="Code word"
            placeholder="Enter a funny code word"
            value={codeWord}
            onChange={(event) => setCodeWord(event.target.value)}
          />
          <div className={styles.suggestions}>
            <span>Suggestions</span>
            <div className={styles.suggestionList}>
              {codeWordSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="secondary"
                  onClick={() => setCodeWord(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
              <Button
                variant="secondary"
                icon={<PlusIcon size={16} aria-hidden="true" />}
                onClick={() => setCodeWordSuggestions(pickRandomCodeWords())}
              >
                Reshuffle
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        id="edit-attendance-modal"
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(null)}
        title="Edit attendance"
        footer={
          <>
            <ModalClose render={<Button variant="secondary">Cancel</Button>} />
            <Button icon={<CheckIcon size={16} aria-hidden="true" />} onClick={saveAttendance}>
              Save changes
            </Button>
          </>
        }
      >
        {editingRow && editTarget && (
          <div className={styles.modalFields}>
            <div className={styles.memberSummary}>
              <div>
                <strong>{editingRow.name}</strong>
                <span>{editingRow.role}</span>
              </div>
              <span>{formatAttendanceDate(dates[editTarget.dateIndex].date)}</span>
            </div>
            <Select
              id="edit-attendance-status"
              label="Attendance"
              value={editStatus}
              onValueChange={(value) => setEditStatus(value ?? 'excused')}
              options={statusOptions}
            />
            <Textarea
              id="edit-attendance-note"
              label="Note (optional)"
              placeholder="Additional context"
              value={editNote}
              onChange={(event) => setEditNote(event.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export function AttendanceMember(): JSX.Element {
  const [code, setCode] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <div data-idol-redesign className={`${styles.page} ${styles.memberPage}`}>
      <div className={styles.memberHeader}>
        <h1>Attendance</h1>
        <Select
          id="member-semester"
          aria-label="Semester"
          value="fall-2026"
          icon={<CalendarBlankIcon size={16} aria-hidden="true" />}
          options={semesterOptions}
        />
      </div>
      <Card className={styles.openAttendanceCard}>
        <div className={styles.openAttendanceHeader}>
          <Pill color="green">{checkedIn ? 'Attendance recorded' : 'Attendance is open'}</Pill>
        </div>
        <div className={styles.openAttendanceBody}>
          <strong>Saturday, October 10, 2026</strong>
          <Input
            id="member-code-word"
            label="Code word"
            placeholder="Enter the code word shared at all hands"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <div className={styles.checkInFooter}>
            <span>{checkedIn ? 'You are checked in.' : 'Location will be included'}</span>
            <Button
              icon={<CheckIcon size={16} aria-hidden="true" />}
              disabled={!code.trim() || checkedIn}
              onClick={() => setCheckedIn(true)}
            >
              Check in
            </Button>
          </div>
        </div>
      </Card>
      <div className={styles.memberGrid}>
        <Card header="Your semester" className={styles.semesterCard}>
          <div className={styles.memberStats}>
            <div>
              <strong>6</strong>
              <span>Present</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Absent</span>
            </div>
            <div>
              <strong>1</strong>
              <span>Excused</span>
            </div>
          </div>
        </Card>
        <Card header="Attendance history" className={styles.historyCard}>
          <ul className={styles.historyList}>
            <li>
              <span>Nov 11</span>
              <span className={styles.present}>Present</span>
            </li>
            <li>
              <span>Nov 4</span>
              <span>Excused</span>
            </li>
            <li>
              <span>Oct 28</span>
              <span className={styles.absent}>Absent</span>
            </li>
            <li>
              <span>Oct 21</span>
              <span>All hands cancelled</span>
            </li>
            <li>
              <span>Oct 14</span>
              <span className={styles.absent}>Absent</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default AttendanceTracker;
