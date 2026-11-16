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
  Input,
  Modal,
  ModalClose,
  Pill,
  Select,
  Textarea
} from '../../design-system-2026/components';
import styles from './Attendance.module.css';

type AttendanceStatus = 'present' | 'absent' | 'future';

type AttendanceRow = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  absences: number;
  attendance: AttendanceStatus[];
};

type EditTarget = { rowId: string; dateIndex: number } | null;

const attendanceDates = [
  { label: 'Oct 10', detail: '45/56 present' },
  { label: 'Oct 17', detail: '45/56 present' },
  { label: 'Oct 24', detail: '56/56 present' },
  { label: 'Oct 31', detail: '56/56 present' },
  { label: 'Nov 7', detail: '56/56 present' },
  { label: 'Nov 14', detail: '--' },
  { label: 'Nov 21', detail: '--' }
];

const initialRows: AttendanceRow[] = [
  { id: 'clement-1', name: 'Clément Rozé', role: 'Design', absences: 1, attendance: ['present', 'absent', 'present', 'present', 'present', 'future', 'future'] },
  { id: 'clement-2', name: 'Clément Rozé', role: 'Design', absences: 2, attendance: ['present', 'absent', 'present', 'absent', 'present', 'future', 'future'] },
  { id: 'clement-3', name: 'Clément Rozé', role: 'Design', absences: 2, attendance: ['absent', 'absent', 'present', 'present', 'present', 'future', 'future'] },
  { id: 'clement-4', name: 'Clément Rozé', role: 'Design', absences: 3, attendance: ['present', 'absent', 'present', 'absent', 'present', 'future', 'future'] },
  { id: 'clement-5', name: 'Clément Rozé', role: 'Design', absences: 2, attendance: ['absent', 'absent', 'present', 'present', 'present', 'future', 'future'] },
  { id: 'clement-6', name: 'Clément Rozé', role: 'Design', absences: 1, attendance: ['present', 'absent', 'present', 'present', 'present', 'future', 'future'] }
];

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
      {status === 'present' ? (
        <CheckIcon size={16} aria-hidden="true" />
      ) : (
        <XIcon size={16} aria-hidden="true" />
      )}
    </button>
  );
}

export function AttendanceTracker(): JSX.Element {
  const [rows, setRows] = useState<AttendanceRow[]>(initialRows);
  const [semester, setSemester] = useState('fall-2026');
  const [semesters, setSemesters] = useState(semesterOptions);
  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [addSemesterOpen, setAddSemesterOpen] = useState(false);
  const [semesterName, setSemesterName] = useState('');
  const [startOpen, setStartOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [editStatus, setEditStatus] = useState('excused');
  const [editNote, setEditNote] = useState('');
  const [startDate, setStartDate] = useState('November 21, 2026 (today)');
  const [codeWord, setCodeWord] = useState('');
  const [started, setStarted] = useState(false);

  const visibleRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !normalized || `${row.name} ${row.role}`.toLowerCase().includes(normalized);
      const matchesFilter = memberFilter === 'all' || (memberFilter === 'absent' && row.absences > 0);
      return matchesSearch && matchesFilter;
    });
  }, [memberFilter, rows, search]);

  const editingRow = editTarget ? rows.find((row) => row.id === editTarget.rowId) : undefined;

  const saveAttendance = () => {
    if (!editTarget) return;
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== editTarget.rowId) return row;
        const nextStatus: AttendanceStatus = editStatus === 'present' ? 'present' : 'absent';
        const nextAttendance = row.attendance.map((value, index) =>
          index === editTarget.dateIndex ? nextStatus : value
        );
        const nextAbsences = nextAttendance.filter((value) => value === 'absent').length;
        return { ...row, attendance: nextAttendance, absences: nextAbsences };
      })
    );
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
      setSemester(value);
    }
    setSemesterName('');
    setAddSemesterOpen(false);
  };

  return (
    <div data-idol-redesign className={styles.page}>
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
        <Button icon={<ArrowRightIcon size={16} aria-hidden="true" />} onClick={() => setStartOpen(true)}>
          Start attendance
        </Button>
      </div>

      <Card header="Statistics" className={styles.statisticsCard} direction="row">
        <div className={styles.stat}>
          <strong>56</strong>
          <span>{started ? 'Fall 2026' : 'Active members'}</span>
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
            <Button variant="secondary" icon={<PlusIcon size={16} aria-hidden="true" />}>
              Add date
            </Button>
          </div>
        }
      >
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Absences</th>
                {attendanceDates.map((date, dateIndex) => (
                  <th scope="col" key={date.label}>
                    <span className={styles.dateHeading}>
                      {date.label}
                      {dateIndex === 0 && (
                        <button type="button" className={styles.editDateButton} aria-label={`Edit ${date.label}`}>
                          <PencilSimpleLineIcon size={16} aria-hidden="true" />
                        </button>
                      )}
                    </span>
                    <span className={styles.dateDetail}>{date.detail}</span>
                  </th>
                ))}
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
                  {row.attendance.map((status, dateIndex) => (
                    <td
                      key={`${row.id}-${dateIndex}`}
                      className={styles.attendanceCellContainer}
                    >
                      <AttendanceCell
                        status={status}
                        label={`Edit ${row.name} attendance for ${attendanceDates[dateIndex].label}`}
                        onClick={() => {
                          if (status === 'future') return;
                          setEditTarget({ rowId: row.id, dateIndex });
                          setEditStatus(status === 'present' ? 'present' : 'excused');
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
        footer={
          <>
            <ModalClose render={<Button variant="secondary">Cancel</Button>} />
            <Button
              icon={<ArrowRightIcon size={16} aria-hidden="true" />}
              onClick={() => {
                setStarted(true);
                setStartOpen(false);
              }}
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
              {['hamster', 'table', 'chair', 'burger', 'exam'].map((suggestion) => (
                <Button key={suggestion} variant="secondary" onClick={() => setCodeWord(suggestion)}>
                  {suggestion}
                </Button>
              ))}
              <Button variant="secondary" icon={<PlusIcon size={16} aria-hidden="true" />}>
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
              <span>{`Saturday, ${attendanceDates[editTarget.dateIndex].label}, 2026`}</span>
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
            <div><strong>6</strong><span>Present</span></div>
            <div><strong>2</strong><span>Absent</span></div>
            <div><strong>1</strong><span>Excused</span></div>
          </div>
        </Card>
        <Card header="Attendance history" className={styles.historyCard}>
          <ul className={styles.historyList}>
            <li><span>Nov 11</span><span className={styles.present}>Present</span></li>
            <li><span>Nov 4</span><span>Excused</span></li>
            <li><span>Oct 28</span><span className={styles.absent}>Absent</span></li>
            <li><span>Oct 21</span><span>All hands cancelled</span></li>
            <li><span>Oct 14</span><span className={styles.absent}>Absent</span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default AttendanceTracker;
