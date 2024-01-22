import nodemailer from 'nodemailer';
import { User } from '../models/user';
// @ts-ignore
import { gmail, gmailPassword } from '../secrets/gmailSecrets';

export async function sendEmail(user: User, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmail,
      pass: gmailPassword,
    },
  });
  // send mail with defined transport object
  await transporter.sendMail({
    from: `"5-semester procejct 👻" <${gmail}>`, // sender address
    to: user.email, // list of receivers
    subject: 'Testmail', // Subject line
    text: 'blah blah blah', // plain text body
    html:
      '<a href="https://brand5semester.netlify.app/glemt-adgangskode?token=' +
      token +
      '">brand5semester.netlify.app/glemt-adgangskode?token=' +
      token +
      '</a>' +
      ' Hallo, This is still a work in progress. Thanks for beeing here ' +
      user.firstName +
      ' ' +
      user.lastName +
      '</b>', // html body
  });
}
