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
        firstName: jsonData.firstName,
        lastName: jsonData.lastName,
        email,
        role: jsonData.roleId,
        about: jsonData.about,
        github: jsonData.github,
        linkedin: jsonData.linkedin,
        major: jsonData.major,
        minor: jsonData.minor,
        doubleMajor: jsonData.doubleMajor,
        hometown: jsonData.hometown,
        graduation: jsonData.graduation,
        subteam: jsonData.subteam,
        otherSubteams: jsonData.otherSubteams,
        website: jsonData.website
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
