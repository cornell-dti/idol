import transporter from '../nodemailer';

const sendMail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: `IDOL notifs: ${subject}`,
    text
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendMail;
