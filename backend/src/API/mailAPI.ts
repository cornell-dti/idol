import getEmailTransporter from '../nodemailer';

const sendMail = async (to: string, subject: string, text: string): Promise<unknown> => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL notifs: ${subject}`,
    text
  };
  const transporter = await getEmailTransporter();
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch(() => ({ error: 'lol there was an error' }));
  return info;
};

export default sendMail;
