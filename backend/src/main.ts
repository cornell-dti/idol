import { db } from './firebase';
import { v4 } from 'uuid';

db.collection('members')
  .get()
  .then((querySnapshot) => {
    let teams = querySnapshot.docs.map((doc) => {
      let member = doc.data();
      return member.subteams[0];
    });
    teams = teams.filter((team, i) => {
      return teams.indexOf(team) === i && team !== '';
    });
    let allMembers = querySnapshot.docs.map((doc) => doc.data());
    let allTeams = teams.map((team) => {
      return {
        name: team,
        uuid: v4(),
        leaders: [] as any[],
        members: [] as any[]
      };
    });
    allMembers.forEach((member) => {
      let team = allTeams.find((team) => team.name === member.subteams[0]);
      if (member.role === 'pm' || member.role === 'tpm') {
        team?.leaders.push(db.doc(`members/${member.email}`));
      } else {
        team?.members.push(db.doc(`members/${member.email}`));
      }
    });
    allTeams.forEach((team) => {
      db.collection('teams').doc(team.uuid).set(team);
    });
  });
