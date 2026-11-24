import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export type AttendanceSemester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type AttendanceEventStatus = 'scheduled' | 'open' | 'closed' | 'cancelled';
export type AttendanceMemberStatus = 'present' | 'absent' | 'excused';

export type AttendanceEvent = {
  id: string;
  semesterId: string;
  date: string;
  label: string;
  status: AttendanceEventStatus;
  codeWord?: string;
  createdBy: string;
  createdAt: string;
  openedAt?: string;
  closedAt?: string;
  updatedAt: string;
  attendanceByNetId?: Record<string, AttendanceMemberStatus>;
};

export type AttendanceSummary = {
  semester: AttendanceSemester;
  events: AttendanceEvent[];
  memberCount: number;
  presentCount: number;
  averageAttendance: number;
  membersWithThreeOrMoreAbsences: number;
};

export type AttendanceRosterMember = {
  netId: string;
  name: string;
  role: string;
  absences: number;
  attendanceByEventId: Record<string, AttendanceMemberStatus>;
};

export type AttendanceRoster = {
  events: AttendanceEvent[];
  members: AttendanceRosterMember[];
};

export type MemberAttendance = {
  semester: AttendanceSemester;
  totals: {
    present: number;
    absent: number;
    excused: number;
  };
  history: Array<{
    event: AttendanceEvent;
    status: AttendanceMemberStatus;
    note?: string;
  }>;
};

export type CreateSemesterInput = Pick<AttendanceSemester, 'name' | 'startDate' | 'endDate'>;

export type CreateEventInput = Pick<AttendanceEvent, 'semesterId' | 'date' | 'label'>;

export type UpdateEventInput = Partial<
  Pick<AttendanceEvent, 'date' | 'label' | 'status' | 'codeWord'>
>;

export type CheckInInput = {
  codeWord: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
};

export type UpdateMemberAttendanceInput = {
  status: AttendanceMemberStatus;
  note?: string;
};

export class AttendanceAPI {
  static async listSemesters(): Promise<AttendanceSemester[]> {
    const { data } = await APIWrapper.get(`${backendURL}/attendance/semesters`);
    if (data?.error || !Array.isArray(data?.semesters)) {
      throw new Error(data?.error || 'Could not load attendance semesters.');
    }
    return data.semesters;
  }

  static async createSemester(input: CreateSemesterInput): Promise<AttendanceSemester> {
    const { data } = await APIWrapper.post(`${backendURL}/attendance/semesters`, input);
    if (data?.error || !data?.semester) {
      throw new Error(data?.error || 'Could not create the semester.');
    }
    return data.semester;
  }

  static async getSummary(semesterId: string): Promise<AttendanceSummary> {
    const { data } = await APIWrapper.get(
      `${backendURL}/attendance/semesters/${semesterId}/summary`
    );
    if (data?.error || !data?.summary) {
      throw new Error(data?.error || 'Could not load the attendance summary.');
    }
    return data.summary;
  }

  static async createEvent(input: CreateEventInput): Promise<AttendanceEvent> {
    const { data } = await APIWrapper.post(`${backendURL}/attendance/events`, input);
    if (data?.error || !data?.event) {
      throw new Error(data?.error || 'Could not create the event.');
    }
    return data.event;
  }

  static async updateEvent(eventId: string, input: UpdateEventInput): Promise<AttendanceEvent> {
    const { data } = await APIWrapper.patch(`${backendURL}/attendance/events/${eventId}`, input);
    if (data?.error || !data?.event) {
      throw new Error(data?.error || 'Could not update the event.');
    }
    return data.event;
  }

  static async checkIn(eventId: string, input: CheckInInput): Promise<AttendanceEvent> {
    const { data } = await APIWrapper.post(
      `${backendURL}/attendance/events/${eventId}/check-in`,
      input
    );
    if (data?.error || !data?.event) {
      throw new Error(data?.error || 'Could not check in.');
    }
    return data.event;
  }

  static async getRoster(eventId: string): Promise<AttendanceRoster> {
    const { data } = await APIWrapper.get(`${backendURL}/attendance/events/${eventId}/roster`);
    if (data?.error || !data?.roster) {
      throw new Error(data?.error || 'Could not load the roster.');
    }
    return data.roster;
  }

  static async updateMemberAttendance(
    eventId: string,
    userId: string,
    input: UpdateMemberAttendanceInput
  ): Promise<AttendanceRosterMember> {
    const { data } = await APIWrapper.patch(
      `${backendURL}/attendance/events/${eventId}/members/${userId}`,
      input
    );
    if (data?.error || !data?.member) {
      throw new Error(data?.error || 'Could not update member attendance.');
    }
    return data.member;
  }

  static async getMyAttendance(semesterId: string): Promise<MemberAttendance> {
    const { data } = await APIWrapper.get(
      `${backendURL}/attendance/me?semesterId=${encodeURIComponent(semesterId)}`
    );
    if (data?.error || !data?.attendance) {
      throw new Error(data?.error || 'Could not load your attendance.');
    }
    return data.attendance;
  }
}
