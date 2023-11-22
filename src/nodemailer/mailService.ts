import nodemailer from "nodemailer";
import { User } from "../models/user";
import { gmail, gmailPassword } from "../secrets/gmailSecrets";


  export async function sendEmail(user: User, token: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmail,
          pass: gmailPassword,
        },
      });
    // send mail with defined transport object
    const info = await transporter.sendMail({   
      from: `"5-semester procejct 👻" <${gmail}>`, // sender address
      to: user.email, // list of receivers
      subject: "Testmail", // Subject line
      text: "blah blah blah", // plain text body
      html: "<b>www.google.com/?token="+token+" uuuh hallo there, any hot guys on the line? like someone called" + user.firstName + " " + user.lastName+"</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
  }