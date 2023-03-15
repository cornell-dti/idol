import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { memberCollection, teamEventAttendanceCollection } from '../firebase';
import { DBTeamEventAttendance } from '../types/DataTypes';

export default class TeamEventAttendanceDao {
  static async createTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    const teamAttendanceRef: DBTeamEventAttendance = {
      ...teamEventAttendance,
      member: memberCollection.doc(teamEventAttendance.member.email),
      ...(typeof teamEventAttendance.hoursAttended === 'number'
        ? { hoursAttended: teamEventAttendance.hoursAttended }
        : {}),
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
      ...attendance,
      member: memberCollection.doc(attendance.member.email)
    };

    const docRef = await teamEventAttendanceCollection.doc(teamAttendanceRef.uuid);
    const currentDoc = await docRef.get();
    const currentAttendance = currentDoc.data() as DBTeamEventAttendance;

    if (
      teamAttendanceRef.hoursAttended === undefined &&
      currentAttendance.hoursAttended !== undefined
    ) {
      await docRef.update(
        new admin.firestore.FieldPath('hoursAttended'),
        admin.firestore.FieldValue.delete()
      );
    }
    await docRef.update(teamAttendanceRef);

    return attendance;
  }

  static async deleteTeamEventAttendance(uuid: string): Promise<void> {
    const docRef = teamEventAttendanceCollection.doc(uuid);
    await docRef.delete();
  }
}
