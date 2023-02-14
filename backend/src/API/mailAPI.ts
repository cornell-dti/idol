// import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import getEmailTransporter from '../nodemailer';
// import { isProd } from '../api';
import AdminsDao from '../dao/AdminsDao';

export const sendMail = async (to: string, subject: string, text: string): Promise<unknown> => {
  // Don't send email notifications locally
  console.log(`sendMail() -- to: ${to}; subject: ${subject}; text: ${text}`);
  if (!process.env.isProd) {
    return {};
  }
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL Notifs: ${subject}`,
    text
  };
  console.log('INFO: creating transporter');
  const transporter = await getEmailTransporter();
  console.log('INFO: transporter creator');
  console.log('INFO: sending email...');
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((error) => {
      console.log(`ERROR: ${error}`);
      return error;
    });
  console.log('INFO: email successfully sent');
  return info;
};

// const getSendMailURL = (req: Request): string => {
//   console.log(`DEBUG: getSendMailURL: ${req.hostname}`);
//   if (isProd) {
//     return `https://${req.hostname}/.netlify/functions/api/sendMail`;
//   }
//   return 'http://localhost:9000/.netlify/functions/api/sendMail';
// };

// const emailAdmins = async (req: Request, subject: string, text: string) => {
//   const url = getSendMailURL(req);
//   const adminEmails = await AdminsDao.getAllAdminEmails();
//   const idToken = req.headers['auth-token'] as string;
//   const requestBody = {
//     subject,
//     text
//   };
//   console.debug('INFO: invoking function calls to email all admins');
//   return adminEmails.map((email) =>
//     axios.post(url, { ...requestBody, to: email }, { headers: { 'auth-token': idToken } })
//   );
// };

export const sendMemberUpdateNotifications = async (req: Request): Promise<any> => {
  const subject = 'IDOL Member Profile Change';
  const text =
    'Hey! A DTI member has updated their profile on IDOL. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.';
  // return emailAdmins(req, subject, text);
  // TODO: just try to send the mail from here and check the function logs to see what happens
  const adminEmails = await AdminsDao.getAllAdminEmails();
  return adminEmails.map((email) => sendMail(email, subject, text));
};
