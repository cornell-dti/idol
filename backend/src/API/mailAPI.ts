import axios from 'axios';
import { Request } from 'express';
import getEmailTransporter from '../nodemailer';
import { isProd } from '../api';
// import AdminsDao from '../dao/AdminsDao';

export const sendMail = async (to: string, subject: string, text: string): Promise<unknown> => {
  // Don't send email notifications locally
  console.log('SEND MAIL');
  if (!process.env.isProd) {
    return {};
  }
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL Notifs: ${subject}`,
    text
  };
  const transporter = await getEmailTransporter();
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((error) => ({ error }));
  return info;
};

const getSendMailURL = (req: Request): string => {
  if (isProd) {
    return `${req.hostname}/.netlify/functions/api/sendMail`;
  }
  return 'http://localhost:9000/.netlify/functions/api/sendMail';
};

const emailAdmins = async (req: Request, subject: string, text: string) => {
  const url = getSendMailURL(req);
  // const adminEmails = await AdminsDao.getAllAdminEmails();
  const idToken = req.headers['auth-token'] as string;
  const adminEmails = ['hl738@cornell.edu'];
  const requestBody = {
    subject,
    text
  };

  return adminEmails.map(async (email) => {
    axios.post(url, { ...requestBody, to: email }, { headers: { 'auth-token': idToken } });
  });
};

export const sendMemberUpdateNotifications = async (req: Request) => {
  const subject = 'IDOL Member Profile Change';
  const text =
    'Hey! A DTI member has updated their profile on IDOL. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.';
  return emailAdmins(req, subject, text);
};
