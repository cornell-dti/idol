import getEmailTransporter from '../nodemailer';

const sendMail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL notifs: ${subject}`,
    text
  };
  const transporter = getEmailTransporter();
  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendMail;
