import { v4 as uuidv4 } from 'uuid';
import { memberCollection, teamEventAttendanceCollection } from '../firebase';
import { DBTeamEventAttendance } from '../types/DataTypes';

export default class TeamEventAttendanceDao {
  static async createTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    const teamAttendanceRef: DBTeamEventAttendance = {
      member: memberCollection.doc(teamEventAttendance.member.email),
      ...(typeof teamEventAttendance.hoursAttended === 'number'
        ? { hoursAttended: teamEventAttendance.hoursAttended }
        : {}),
      image: teamEventAttendance.image,
      eventUuid: teamEventAttendance.eventUuid,
      pending: true,
      uuid: teamEventAttendance.uuid ? teamEventAttendance.uuid : uuidv4()
    };
    await teamEventAttendanceCollection.doc(teamAttendanceRef.uuid).set(teamAttendanceRef);
    return teamEventAttendance;
  }

  static async updateTeamEventAttendance(
    attendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    const teamAttendanceRef: DBTeamEventAttendance = {
      member: memberCollection.doc(attendance.member.email),
      ...(typeof attendance.hoursAttended === 'number'
        ? { hoursAttended: attendance.hoursAttended }
        : {}),
      image: attendance.image,
      eventUuid: attendance.eventUuid,
      pending: attendance.pending,
      uuid: attendance.uuid
    };
    await teamEventAttendanceCollection.doc(teamAttendanceRef.uuid).update(teamAttendanceRef);
    return attendance;
  }

  static async deleteTeamEventAttendance(uuid: string): Promise<void> {
    const docRef = teamEventAttendanceCollection.doc(uuid);
    docRef.delete();
  }
}
