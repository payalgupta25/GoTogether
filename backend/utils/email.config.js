import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "payalgupta425@gmail.com",
      pass: `${process.env.PASSWORD}`,
    },
});


transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP ready");
  }
});