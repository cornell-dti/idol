import { v4 as uuidv4 } from 'uuid';
import { db, memberCollection, teamEventAttendanceCollection } from '../firebase';
import { DBTeamEventAttendance } from '../types/DataTypes';
import { deleteCollection } from '../utils/firebase-utils';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function materializeTeamEventAttendance(
  dbTeamEventAttendance: DBTeamEventAttendance
): Promise<TeamEventAttendance> {
  return {
    ...dbTeamEventAttendance,
    member: await getMemberFromDocumentReference(dbTeamEventAttendance.member)
  };
}

async function serializeTeamEventAttendance(
  teamEventAttendance: TeamEventAttendance
): Promise<DBTeamEventAttendance> {
  return {
    ...teamEventAttendance,
    member: memberCollection.doc(teamEventAttendance.member.email)
  };
}

export default class TeamEventAttendanceDao extends BaseDao<
  TeamEventAttendance,
  DBTeamEventAttendance
> {
  constructor() {
    super(
      teamEventAttendanceCollection,
      materializeTeamEventAttendance,
      serializeTeamEventAttendance
    );
  }

  /**
   * Creates a new TEC Attendance for member for a given team event
   * @param teamEventAttendance - Newly created TeamEventAttendance object.
   * If provided, the object uuid will be used. If not, a new one will be generated.
   * The pending field will be set to true by default.
   */
  async createTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    const teamEventAttendanceWithUUID = {
      ...teamEventAttendance,
      pending: true,
      status: 'pending' as Status,
      uuid: teamEventAttendance.uuid ? teamEventAttendance.uuid : uuidv4()
    };
    return this.createDocument(teamEventAttendanceWithUUID.uuid, teamEventAttendanceWithUUID);
  }

  /**
   * Updates a TEC Attendance
   * @param teamEventAttendance - updated TeamEventAttendance object
   *  If hoursAttended is originally defined, it cannot be overwritten afterwards
   */
  async updateTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    return this.updateDocument(teamEventAttendance.uuid, teamEventAttendance);
  }

  /**
   * Deletes a TEC Attendance
   * @param uuid - DB uuid of TeamEventAttendance
   */
  async deleteTeamEventAttendance(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
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
  async getTeamEventAttendanceByUser(user: IdolMember): Promise<TeamEventAttendance[]> {
    return this.getDocuments([
      {
        field: 'member',
        comparisonOperator: '==',
        value: memberCollection.doc(user.email)
      }
    ]);
  }

  /**
   * Gets all TEC Attendance for a given team event
   * @param uuid - DB uuid of team event
   */
  async getTeamEventAttendanceByEventId(uuid: string): Promise<TeamEventAttendance[]> {
    return this.getDocuments([
      {
        field: 'eventUuid',
        comparisonOperator: '==',
        value: uuid
      }
    ]);
  }

  /**
   * Gets the TEC Attendance
   * @param uuid - DB uuid of TEC Attendance
   */
  async getTeamEventAttendance(uuid: string): Promise<TeamEventAttendance | null> {
    return this.getDocument(uuid);
  }

  /**
   * Gets all TEC Attendance for all events
   */
  async getAllTeamEventAttendance(): Promise<TeamEventAttendance[]> {
    return this.getDocuments();
  }
}
