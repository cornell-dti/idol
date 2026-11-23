# Attendance Tracker Backend Design

**Design idea:** Attendance Tracker

**Overview:** A semester-based attendance system for DTI all-hands. Admins schedule sessions, open attendance with a shared code word, and review or correct member records. Members use the code word to mark themselves present and can review their attendance history.

## Roles and permissions

- **Member:** View their own semester summary and attendance history; mark themselves present while attendance is open using the session code word.
- **Attendance admin:** Create semesters and sessions, start/end attendance, cancel sessions, view the roster and statistics, and edit a member’s status with an optional note.
- Authenticate through IDOL/DTI login. Enforce permissions in backend handlers and Firestore rules; never trust a role supplied by the client.

## Firestore schema

### `attendance_semesters/{semesterId}`

`name`, `startDate`, `endDate`, `isActive`, `createdAt`, `updatedAt`

### `attendance_events/{eventId}`

`semesterId`, `date`, `label`, `status: "scheduled" | "open" | "closed" | "cancelled"`, `codeWordHash`, `createdBy`, `createdAt`, `openedAt`, `closedAt`, `updatedAt`

Store only a hash of the code word and compare normalized input server-side. Do not allow attendance submissions after the event closes or is cancelled.

### `event_attendance/{eventId_userId}`

`eventId`, `semesterId`, `userId`, `status: "present" | "absent" | "excused"`, `source: "code_word" | "admin"`, `updatedBy`, `note`, `updatedAt`

Use a deterministic document ID so duplicate submissions update the same record. Cancelled events remain in event history but are excluded from attendance calculations.

## Backend responsibilities

- Create/update semesters and sessions; validate dates and admin access.
- Open an event with a generated or admin-provided code word, verify member submissions, and close or cancel the event.
- Return the admin attendance grid, roster, per-event present counts, average attendance, and members with three or more absences.
- Return a member’s semester totals and event history, including cancelled sessions.
- Apply status edits atomically and record who changed the status, when, and why.

## API sketch

- `GET /attendance/semesters` and `POST /attendance/semesters`
- `GET /attendance/semesters/:id/summary`
- `POST /attendance/events` and `PATCH /attendance/events/:id` (open, close, cancel)
- `POST /attendance/events/:id/check-in` with code word
- `GET /attendance/events/:id/roster`
- `PATCH /attendance/events/:id/members/:userId` to set status and optional note
- `GET /attendance/me?semesterId=:id`

## Rules and open questions

- A member can check in only as themselves, once per event; repeated valid check-ins are idempotent.
- Admin edits require an audit record. Only authorized attendance admins can manage sessions or edit records.
- Define whether members not checked in by close are automatically marked absent or remain unmarked until an admin records a status. Until decided, do not infer absences from missing records.
- Define the exact average-attendance denominator (for example, exclude excused and cancelled sessions) before finalizing the statistics endpoint.

## Implementation order

1. Add Firestore models, validation, indexes, and role checks.
2. Implement semester/session lifecycle and code-word check-in.
3. Implement roster editing with an audit trail.
4. Add admin and member summary queries, then connect the UI.
