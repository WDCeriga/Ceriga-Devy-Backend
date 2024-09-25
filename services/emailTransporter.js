import nodemailer from "nodemailer"

import config from "../config.js";

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export default transporter