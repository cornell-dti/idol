import transporter from '../nodemailer';

const sendMail = (to: string, subject: string, text: string): void => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL notifs: ${subject}`,
    text
  };

  transporter.sendMail(mailOptions);
};

export default sendMail;
