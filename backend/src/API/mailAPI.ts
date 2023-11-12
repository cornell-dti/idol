import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import getEmailTransporter from '../nodemailer';
import { isProd } from '../api';
import AdminsDao from '../dao/AdminsDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';
import { getAllTeamEvents, getTeamEventAttendanceByUser } from './teamEventsAPI';
import { env } from '../firebase';

/**
 * Sends an email to the specified member's email
 * @param to - The member's email
 * @param subject - The subject of the email
 * @param text - The body of the email
 * @param user - The member trying to send the email
 * @returns - The information in the email
 */
export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  user: IdolMember
): Promise<unknown> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError('User does not have permission to send automated emails.');

  const mailOptions = {
    from: 'dti.idol.github.bot@gmail.com',
    to,
    subject: `IDOL Notifs: ${subject}`,
    text
  };

  // Only sent emails in prod, otherwise, send to stdout.
  if (env !== 'prod') {
    // eslint-disable-next-line no-console
    console.log(
      `Emails are not sent in non-production envs. Here's what would have been sent:\n`,
      mailOptions
    );
    return {};
  }

  const transporter = await getEmailTransporter();
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((error) => ({ error }));
  return info;
};

/**
 * Determines which URL to use to send an email, depending on if the production 
 * environment is used
 * @param req - The request made by the user
 * @returns - The URL to use to send an email
 */
const getSendMailURL = (req: Request): string => {
  if (isProd) {
    return `https://${req.hostname}/.netlify/functions/api/sendMail`;
  }
  return 'http://localhost:9000/.netlify/functions/api/sendMail';
};

/**
 * Send an email to the admins
 * @param req - The request made when sending the email
 * @param subject - The subject of the email
 * @param text - The body of the email
 * @returns - The information of the admins being sent the emails
 */
const emailAdmins = async (req: Request, subject: string, text: string) => {
  const url = getSendMailURL(req);
  const adminEmails = await AdminsDao.getAllAdminEmails();
  const idToken = req.headers['auth-token'] as string;
  const requestBody = {
    subject,
    text
  };

  return adminEmails.map(async (email) => {
    axios.post(url, { ...requestBody, to: email }, { headers: { 'auth-token': idToken } });
  });
};

/**
 * Send an email to a member
 * @param req - The request made when sending the email
 * @param member - The member being sent the email
 * @param subject - The subject of the email
 * @param text - The body of the email
 * @returns - The information of the member being sent the email
 */
const emailMember = async (req: Request, member: IdolMember, subject: string, text: string) => {
  const url = getSendMailURL(req);
  const idToken = req.headers['auth-token'] as string;
  const requestBody = {
    subject,
    text
  };

  return axios.post(
    url,
    { ...requestBody, to: member.email },
    { headers: { 'auth-token': idToken } }
  );
};

/**
 * Send an email about a member updating their notifications
 * @param req - The request made when sending the email
 * @returns - The information of the admins being sent the emails
 */
export const sendMemberUpdateNotifications = async (req: Request): Promise<Promise<void>[]> => {
  const subject = 'IDOL Member Profile Change';
  const text =
    'Hey! A DTI member has updated their profile on IDOL. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.';
  return emailAdmins(req, subject, text);
};

/**
 * Send an email reminder to members who do not have enough TEC credits
 * @param req - The request made when sending the email
 * @param member - The member being sent the email
 * @returns - The information of the member being sent the email
 */
export const sendTECReminder = async (req: Request, member: IdolMember): Promise<AxiosResponse> => {
  const subject = 'TEC Reminder';
  const allEvents = await getAllTeamEvents(req.body);
  const futureEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const todayDate = new Date();
    return eventDate >= todayDate;
  });
  const memberEventAttendance = await getTeamEventAttendanceByUser(member);
  let approvedCount = 0;
  let pendingCount = 0;
  memberEventAttendance.forEach((eventAttendance) => {
    const eventCredit = Number(
      allEvents.find((event) => event.uuid === eventAttendance.eventUuid)?.numCredits ?? 0
    );
    if (eventAttendance.status === 'approved') {
      approvedCount += eventCredit;
    }
    if (eventAttendance.status === 'pending') {
      pendingCount += eventCredit;
    }
  });

  const text =
    `Hey! You currently have ${approvedCount} team event ${
      approvedCount !== 1 ? 'credits' : 'credit'
    } approved and ${pendingCount} team event ${
      pendingCount !== 1 ? 'credits' : 'credit'
    } pending this semester. ` +
    `This is a reminder to get at least ${
      member.role === 'lead' ? '6' : '3'
    } team event credits by the end of the semester.\n` +
    `\n${
      futureEvents.length === 0
        ? 'There are currently no upcoming team events listed on IDOL, but check the #team-events channel for upcoming team events.'
        : 'Here is a list of upcoming team events you can participate in:'
    } \n` +
    `${(await futureEvents)
      .map(
        (event) =>
          `${event.name} on ${event.date} (${event.numCredits} ${
            Number(event.numCredits) !== 1 ? 'credits' : 'credit'
          })\n`
      )
      .join('')}` +
    '\nTo submit your TEC, please visit https://idol.cornelldti.org/forms/teamEventCredits.';
  return emailMember(req, member, subject, text);
};
