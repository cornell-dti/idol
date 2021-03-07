import { db } from './firebase';

const removeEmptyOrNull = (obj) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === 'object' && removeEmptyOrNull(obj[k])) ||
      // eslint-disable-next-line no-param-reassign
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );
  return obj;
};

const dirPath = './members/';
const filesPath = './data/members/';
const fs = require('fs');

const jsonFilesList: string[] = fs.readdirSync(filesPath);
const emailDomain = '@cornell.edu';

db.collection('members')
  .get()
  .then((vals) => vals.docs.map((doc) => doc.data().email))
  .then((existingEmails: string[]) => {
    jsonFilesList.forEach((fileName) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const jsonData = require(dirPath + fileName);
      const email: string = jsonData.netid + emailDomain;

      const data = {
        email,
        netid: jsonData.netid,
        firstName: jsonData.firstName,
        lastName: jsonData.lastName,
        graduation: jsonData.graduation,
        major: jsonData.major,
        doubleMajor: jsonData.doubleMajor,
        minor: jsonData.minor,
        website: jsonData.website,
        linkedin: jsonData.linkedin,
        github: jsonData.github,
        hometown: jsonData.hometown,
        about: jsonData.about,
        subteam: jsonData.subteam,
        otherSubteams: jsonData.otherSubteams,
        role: jsonData.roleId,
        roleDescription: jsonData.roleDescription,  
      };

      removeEmptyOrNull(data);

      if (data.website) {
        if (existingEmails.includes(email)) {
          db.doc(`members/${email}`).update(data);
        } else {
          db.doc(`members/${email}`).set(data);
        }
      }
    });
  });
