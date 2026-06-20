// import nodemailer from 'nodemailer'
// import dotenv from 'dotenv'
// dotenv.config()
// export const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for port 465, false for other ports
//     auth: {
//       user: "payalgupta425@gmail.com",
//       pass: `${process.env.PASSWORD}`,
//     },
// });


// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("SMTP ready");
//   }
// });

import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();
 
// @getbrevo/brevo v5 uses a single BrevoClient, not separate
// TransactionalEmailsApi classes like older versions did.
export const brevoClient = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});
 
export const EMAIL_SENDER = {
  name: "GoTogether",
  email: process.env.BREVO_SENDER_EMAIL, // must match the verified sender in Brevo
};