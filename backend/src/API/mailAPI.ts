import getEmailTransporter from '../nodemailer';

const sendMail = async (to: string, subject: string, text: string): Promise<unknown> => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL notifs: ${subject}`,
    text
  };
  const transporter = await getEmailTransporter();
  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendMail;