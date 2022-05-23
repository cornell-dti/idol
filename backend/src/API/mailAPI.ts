import getEmailTransporter from '../nodemailer';
// import AdminsDao from '../dao/AdminsDao';

const sendMail = async (to: string, subject: string, text: string): Promise<unknown> => {
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

const emailAdmins = async (subject: string, text: string) => {
  // const adminEmails = await AdminsDao.getAllAdminEmails();
  const adminEmails = ['hl738@cornell.edu'];
  return adminEmails.map(async (email) => {
    const info = await sendMail(email, subject, text);
    return info;
  });
};

const sendMemberUpdateNotifications = () => {
  const subject = 'IDOL Member Profile Change';
  const text =
    'Hey! A DTI has updated their profile on IDOL. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.';
  return emailAdmins(subject, text);
};

export default sendMemberUpdateNotifications;
