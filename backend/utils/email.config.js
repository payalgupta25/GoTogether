import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "payalgupta425@gmail.com",
      pass: "${process.env.PASSWORD}",
    },
});
