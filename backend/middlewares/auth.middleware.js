import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/email.config.js";
import { Verification_Email_Template,Welcome_Email_Template } from "../utils/emailTemplate.js";
export const protectRoute = async (req, res, next) => {
  try {
      const token = req.cookies.jwt;
      console.log(token);
      if (!token) return res.status(401).json({ error: "Not authenticated" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      console.log(req.user);
      console.log(decoded.exp)
      if (!req.user) return res.status(404).json({ error: "User not found" });

      next();
  } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ error: "Invalid token" });
  }
};


export const sendVerificationEamil=async(email,verificationCode)=>{
  try {
   const response=   await transporter.sendMail({
          from: '"PAYAL GUPTA" <payalgupta425@gmail.com>',

          to: email, // list of receivers
          subject: "Verify your Email", // Subject line
          text: "Verify your Email", // plain text body
          html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
      })
      console.log('Email send Successfully',response)
  } catch (error) {
      console.log('Email error',error)
  }
}

export const senWelcomeEmail=async(email,name)=>{
  try {
   const response=   await transporter.sendMail({
          from: '"PAYAL GUPTA" <payalgupta425@gmail.com>',

          to: email, // list of receivers
          subject: "Welcome Email", // Subject line
          text: "Welcome Email", // plain text body
          html: Welcome_Email_Template.replace("{name}",name)
      })
      console.log('Email send Successfully',response)
  } catch (error) {
      console.log('Email error',error)
  }
}