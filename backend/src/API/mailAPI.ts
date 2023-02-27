import getEmailTransporter from '../nodemailer';
import { isProd } from '../api';
import AdminsDao from '../dao/AdminsDao';

export const sendMail = async (to: string, subject: string, text: string): Promise<unknown> => {
  // Don't send email notifications locally
  if (!isProd) {
    return {};
  }
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL Notifs: ${subject}`,
    text
  };
  const transporter = await getEmailTransporter();
  if (!transporter) return {};
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((error) => error);
  return info;
};

export const sendMemberUpdateNotifications = async () => {
  const subject = 'IDOL Member Profile Change';
  const text =
    'Hey! A DTI member has updated their profile on IDOL. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.';
  const adminEmails = await AdminsDao.getAllAdminEmails();
  return Promise.all(adminEmails.map((email) => sendMail(email, subject, text)));
};
