import { v4 as uuidv4 } from 'uuid';
import { db, memberCollection, teamEventAttendanceCollection } from '../firebase';
import { DBTeamEventAttendance } from '../types/DataTypes';
import { deleteCollection } from '../utils/firebase-utils';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

export default class TeamEventAttendanceDao {
  /**
   * Creates a new TEC Attendance for member for a given team event
   * @param teamEventAttendance - Newly created TeamEventAttendance object.
   * If provided, the object uuid will be used. If not, a new one will be generated.
   * The pending field will be set to true by default.
   */
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

  /**
   * Deletes all TEC Attendance
   */
  static async deleteAllTeamEventAttendance(): Promise<void> {
    await deleteCollection(db, 'team-event-attendance', 500);
  }

  /**
   * Gets all TEC Attendance for a user
   * @param user - user whose attendance should be fetched
   */
  static async getTeamEventAttendanceByUser(user: IdolMember): Promise<TeamEventAttendance[]> {
    const memberRef = memberCollection.doc(user.email);
    const attendanceRefs = await teamEventAttendanceCollection
      .where('member', '==', memberRef)
      .get();
    const attendance = attendanceRefs.docs.map((doc) => doc.data() as DBTeamEventAttendance);
    return Promise.all(
      attendance.map(async (att) => ({
        ...att,
        member: await getMemberFromDocumentReference(att.member)
      }))
    );
  }

  /**
   * Gets all TEC Attendance for a given team event
   * @param uuid - DB uuid of team event
   */
  static async getTeamEventAttendanceByEventId(uuid: string): Promise<TeamEventAttendance[]> {
    const attendanceRefs = await teamEventAttendanceCollection.where('eventUuid', '==', uuid).get();
    const attendance = attendanceRefs.docs.map((doc) => doc.data() as DBTeamEventAttendance);
    return Promise.all(
      attendance.map(async (att) => ({
        ...att,
        member: await getMemberFromDocumentReference(att.member)
      }))
    );
  }

  /**
   * Gets all TEC Attendance for all events
   */
  static async getAllTeamEventAttendance(): Promise<TeamEventAttendance[]> {
    const attendanceRefs = await teamEventAttendanceCollection.get();
    const attendance = attendanceRefs.docs.map((doc) => doc.data() as DBTeamEventAttendance);
    return Promise.all(
      attendance.map(async (att) => ({
        ...att,
        member: await getMemberFromDocumentReference(att.member)
      }))
    );
  }
}
