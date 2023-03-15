import { v4 as uuidv4 } from 'uuid';
import { memberCollection, teamEventAttendanceCollection } from '../firebase';
import { DBTeamEventAttendance } from '../types/DataTypes';

/**
 * Creates a new TEC Attendance for member for a given team event
 * @param teamEventAttendance - Newly created TeamEventAttendance object.
 * If provided, the object uuid will be used. If not, a new one will be generated.
 * The pending field will be set to true by default.
 */
export default class TeamEventAttendanceDao {
  static async createTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    const teamAttendanceRef: DBTeamEventAttendance = {
      ...teamEventAttendance,
      pending: true,
      member: memberCollection.doc(teamEventAttendance.member.email),
      uuid: teamEventAttendance.uuid ? teamEventAttendance.uuid : uuidv4()
    };
    await teamEventAttendanceCollection.doc(teamAttendanceRef.uuid).set(teamAttendanceRef);

    const createdEventAttendance = {
      ...teamAttendanceRef,
      member: teamEventAttendance.member
    };
    return createdEventAttendance;
  }

  /**
   * Updates a TEC Attendance
   * @param teamEventAttendance - updated TeamEventAttendance object
   *  If hoursAttended is originally defined, it cannot be overwritten afterwards
   */
  static async updateTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    const teamAttendanceRef: DBTeamEventAttendance = {
      ...teamEventAttendance,
      member: memberCollection.doc(teamEventAttendance.member.email)
    };
    await teamEventAttendanceCollection.doc(teamAttendanceRef.uuid).update(teamAttendanceRef);
    return teamEventAttendance;
  }

  /**
   * Deletes a TEC Attendance
   * @param uuid - DB uuid of TeamEventAttendance
   */
  static async deleteTeamEventAttendance(uuid: string): Promise<void> {
    const docRef = teamEventAttendanceCollection.doc(uuid);
    await docRef.delete();
  }
}
