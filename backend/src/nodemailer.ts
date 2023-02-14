import nodemailer, { TransportOptions } from 'nodemailer';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENTID,
  process.env.OAUTH_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

const getEmailTransporter = async (): Promise<nodemailer.Transporter<unknown> | undefined> => {
  let transporter: nodemailer.Transporter;
  console.debug('Creating email transporter...');
  try {
    const accessToken = await oauth2Client.getAccessToken();
    transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'dti.idol.github.bot@gmail.com',
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken
      }
    } as TransportOptions);
    return transporter;
  } catch (e) {
    console.error(e);
  }
  return undefined;
};

export default getEmailTransporter;
