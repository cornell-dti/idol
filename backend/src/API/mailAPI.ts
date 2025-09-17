import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import getEmailTransporter from '../nodemailer';
import { isProd } from '../api';
import AdminsDao from '../dao/AdminsDao';
import PermissionsManager from '../utils/permissionsManager';
import { BadRequestError, PermissionError } from '../utils/errors';
import { env } from '../firebase';
import TeamEventAttendanceDao from '../dao/TeamEventAttendanceDao';
import TeamEventsDao from '../dao/TeamEventsDao';
import { LEAD_ROLES, TEC_DEADLINES } from '../consts';

const teamEventAttendanceDao = new TeamEventAttendanceDao();
const IS_PROD = env === 'prod';

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

  // Only send emails in prod, otherwise, send to stdout.
  if (!IS_PROD) {
    const nonProdEnvMessage = `Emails are not sent in non-production env: ${env}.\n`;
    // eslint-disable-next-line no-console
    console.log(nonProdEnvMessage, `Here's what would have been sent:\n`, mailOptions);
    return nonProdEnvMessage;
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
 * @returns - The response body containing information of the member being sent the email
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
 * @returns - The response body containing information of the admins being sent the emails
 */
export const sendMemberUpdateNotifications = async (req: Request): Promise<Promise<void>[]> => {
  const subject = 'IDOL Member Profile Change';
  const text =
    'Hey! A DTI member has updated their profile on IDOL. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.';
  return emailAdmins(req, subject, text);
};

/**
 * Send an email reminder to members who do not have enough TEC credits for the current TEC period
 * @param req - The request made when sending the email
 * @param member - The member being sent the email
 * @returns - The response body containing information of the member being sent the email
 */
export const sendPeriodReminder = async (
  req: Request,
  member: IdolMember
): Promise<AxiosResponse> => {
  const subject = `This Period's TEC Reminder`;

  interface Period {
    name: string;
    start: Date;
    deadline: Date;
    events: TeamEvent[];
  }

  const allEvents = await Promise.all(
    (await TeamEventsDao.getAllTeamEvents()).map(async (event) => ({
      ...event,
      requests: await teamEventAttendanceDao.getTeamEventAttendanceByEventId(event.uuid)
    }))
  );

  const getTECPeriod = (submissionDate: Date) => {
    const currentPeriodIndex = TEC_DEADLINES.findIndex((date) => submissionDate <= date);
    if (currentPeriodIndex === -1) {
      return TEC_DEADLINES.length - 1;
    }
    return currentPeriodIndex;
  };

  const calculateCurrentPeriodCredits = (currentPeriod: Period, pending: boolean): number => {
    let credits = 0;
    memberEventAttendance.forEach((eventAttendance) => {
      const event = allEvents.find((e) => e.uuid === eventAttendance.eventUuid);
      if (!event) return;
      const eventDate = new Date(event.date);
      const isInCurrentPeriod =
        eventDate > currentPeriod.start && eventDate <= currentPeriod.deadline;
      if (!isInCurrentPeriod) return;
      const eventCredit = Number(event.numCredits ?? 0);
      const status = pending ? 'pending' : 'approved';
      if (eventAttendance.status === status) {
        credits += eventCredit;
      }
    });
    return credits;
  };

  const getCurrentPeriod = () => {
    const today = new Date();
    const currentPeriodIndex = getTECPeriod(today);
    const year = today.getFullYear();
    const firstPeriodStart = today.getMonth() < 7 ? new Date(year, 0, 1) : new Date(year, 7, 1);

    const periodStart =
      currentPeriodIndex === 0 ? firstPeriodStart : TEC_DEADLINES[currentPeriodIndex - 1];
    const periodEnd = TEC_DEADLINES[currentPeriodIndex];
    const events = allEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate > periodStart && eventDate <= periodEnd;
    });

    return {
      name: `Period ${currentPeriodIndex + 1}`,
      start: periodStart,
      deadline: periodEnd,
      events
    };
  };

  const currentPeriod = getCurrentPeriod();
  if (!currentPeriod) {
    return Promise.reject(new BadRequestError('No valid TEC period found.'));
  }

  const memberEventAttendance = await teamEventAttendanceDao.getTeamEventAttendanceByUser(member);

  const calculateCredits = (currentCredits: number, requiredCredits: number) =>
    Math.max(0, requiredCredits - currentCredits);

  const { start: periodStart, deadline: periodEnd, events: allPeriodEvents } = currentPeriod;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const futureEventsInPeriod = allPeriodEvents.filter((event) => new Date(event.date) >= today);

  const currentPeriodCredits = calculateCurrentPeriodCredits(currentPeriod, false);
  const currentPendingCredits = calculateCurrentPeriodCredits(currentPeriod, true);

  const isLead = LEAD_ROLES.includes(member.role);
  const requiredCreditsForPeriod = isLead ? 2 : 1;
  const remainingCredits = calculateCredits(currentPeriodCredits, requiredCreditsForPeriod);
  const reminder =
    `This is a reminder to earn at least ${remainingCredits} team event ${
      remainingCredits !== 1 ? 'credits' : 'credit'
    } by ${periodEnd.toDateString()}.\n` +
    `\n${
      futureEventsInPeriod.length === 0
        ? 'There are currently no upcoming team events listed on IDOL for this period, but check the #team-events channel for upcoming team events.'
        : 'Here is a list of upcoming team events this period you can participate in:'
    } \n` +
    `${futureEventsInPeriod
      .map(
        (event) =>
          `${event.name} on ${event.date} (${event.numCredits} ${
            Number(event.numCredits) !== 1 ? 'credits' : 'credit'
          })\n`
      )
      .join('')}`;

  const text = `[If you are not taking DTI for credit this semester, please ignore.]\nHey! You currently have ${currentPeriodCredits} team event ${
    currentPeriodCredits !== 1 ? 'credits' : 'credit'
  } approved and ${currentPendingCredits} team event ${
    currentPendingCredits !== 1 ? 'credits' : 'credit'
  } pending for this period (${periodStart.toDateString()} - ${periodEnd.toDateString()}).\n${reminder}\nTo submit your TEC, please visit https://idol.cornelldti.org/forms/teamEventCredits.`;
  return emailMember(req, member, subject, text);
};

/**
 * Send an email reminder to members who do not have a coffee chat blackout
 * @param req - The request made when sending the email
 * @param member - The member being sent the email
 * @returns - The response body containing information of the member being sent the email
 */
export const sendCoffeeChatReminder = async (
  req: Request,
  member: IdolMember
): Promise<AxiosResponse> => {
  const subject = 'Coffee Chat Reminder';

  const text =
    "[If you are not taking DTI for credit this semester, please ignore.]\nHey! You currently don't have any coffee chat bingos this semester.\nThis is a reminder to submit your coffee chats by the last day of classes.\n[NOTE]: Newbies taking DTI for credit are required to get at least 1 bingo.\nTo submit your coffee chats, please visit https://idol.cornelldti.org/forms/coffeeChats.";
  return emailMember(req, member, subject, text);
};

/**
 * Send interview invitation email to applicant
 * @param email - The email of the person being invited
 * @param scheduler - The interview scheduler instance
 * @param slot - The interview slot that was signed up for
 * @returns - The response body containing information of the applicant being sent the email
 *
 * TODO(Oscar): enable email templates and integrate with sendMail after revisiting non-member auth
 */
export const sendInterviewInvite = async (
  email: string,
  scheduler: InterviewScheduler,
  slot: InterviewSlot
) => {
  const subject = `[Cornell DTI] Interview Confirmation - ${slot.applicant?.firstName} ${slot.applicant?.lastName}`;

  // Format the date and time
  const interviewDate = new Date(slot.startTime);
  const endTime = new Date(slot.startTime + scheduler.duration);
  const dateString = interviewDate.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const startTimeString = interviewDate.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const endTimeString = endTime.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Build interviewer names
  const interviewerNames: string[] = [];
  if (slot.lead) {
    interviewerNames.push(`${slot.lead.firstName} ${slot.lead.lastName} (Lead)`);
  }
  slot.members.forEach((member, index) => {
    if (member) {
      interviewerNames.push(`${member.firstName} ${member.lastName}`);
    }
  });

  const text = `Hello!

You have successfully signed up for an interview with DTI.

Interview Details:
- Name: ${scheduler.name}
- Date: ${dateString}
- Time: ${startTimeString} - ${endTimeString}
- Location: ${slot.room}

Please arrive 5 minutes before your scheduled time. If you need to cancel or reschedule, please contact hello@cornelldti.org as soon as possible.

Good luck with your interview!

Best regards,
Cornell DTI`;

  const mailOptions = {
    from: 'dti.idol.github.bot@gmail.com',
    to: email,
    subject,
    text
  };

  if (!IS_PROD) {
    const nonProdEnvMessage = `Emails are not sent in non-production env: ${env}.\n`;
    // eslint-disable-next-line no-console
    console.log(nonProdEnvMessage, `Here's what would have been sent:\n`, mailOptions);
    return nonProdEnvMessage;
  }

  const transporter = await getEmailTransporter();
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((error) => ({ error }));
  return info;
};

/**
 * Send interview cancellation notification
 * @param email - The email of the person being cancelled
 * @param scheduler - The interview scheduler instance
 * @param slot - The interview slot that was cancelled
 * @returns - Promise array of email responses
 */
export const sendInterviewCancellation = async (
  email: string,
  scheduler: InterviewScheduler,
  slot: InterviewSlot
) => {
  const subject = `Interview Cancelled - ${slot.applicant?.firstName} ${slot.applicant?.lastName}`;

  const interviewDate = new Date(slot.startTime);
  const dateString = interviewDate.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeString = interviewDate.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const text = `Hello!

Your interview with DTI has been cancelled.

Cancelled Interview Details:
- Name: ${scheduler.name}
- Date: ${dateString}
- Time: ${timeString}
- Location: ${slot.room}

If you would like to reschedule, please contact hello@cornelldti.org.

Best regards,
Cornell DTI`;

  const mailOptions = {
    from: 'dti.idol.github.bot@gmail.com',
    to: email,
    subject,
    text
  };

  if (!IS_PROD) {
    const nonProdEnvMessage = `Emails are not sent in non-production env: ${env}.\n`;
    // eslint-disable-next-line no-console
    console.log(nonProdEnvMessage, `Here's what would have been sent:\n`, mailOptions);
    return nonProdEnvMessage;
  }

  const transporter = await getEmailTransporter();
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((error) => ({ error }));
  return info;
};
