import getEmailTransporter from '../src/nodemailer';

const sendMail = async (to: string, subject: string, text: string): Promise<unknown> => {
  const mailOptions = {
    from: 'dti.idol.github.bot@gmail.com',
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

export default sendMail;
