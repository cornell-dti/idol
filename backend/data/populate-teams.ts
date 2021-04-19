import { db } from 'backend/data/firebase';
import {Team, DBTeam} from 'backend/src/DataTypes';
import { v4 as uuidv4 } from 'uuid';

console.log("here");
const teams = db.collection('teams').get();
console.log(teams);

db.collection('members')
  .get()
  .then((vals) => vals.docs.map((doc) => {
      const data = doc.data();
      console.log(data);
      const {email} = data;
      const team = data.subteam;
      const role = data.role;
      let teamData = teams.filter(item => item.name === team);
      if(role==="lead") {
        teamData = {
            uuid: teamData.uuid,
            name: teamData.name, 
            leaders: teamData.leaders.add(/members/+email),
            members: teamData.members
        };
      } else {
        teamData = {
            uuid: teamData.uuid,
            name: teamData.name, 
            leaders: teamData.leaders,
            members: teamData.members.add(/members/+email)
        };
      }
    //   db.doc(`teams/${teamData.uuid}`).update(teamData);
    console.log(teamData);
    })); 
