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
      '<a href="https://localhost:3010/glemt-adgangskode?token="' +
      token +
      '>localhost:3010/glemt-adgangskode?token=' +
      token +
      '</a>' +
      ' uuuh hallo there, any hot guys on the line? like someone called' +
      user.firstName +
      ' ' +
      user.lastName +
      '</b>', // html body
  });
}
