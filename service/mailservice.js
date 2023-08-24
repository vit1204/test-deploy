const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { object } = require("joi");
dotenv.config();

const mailservice = {
  async sendemail({ emailForm, emailTo, emailSubject, emailText }) {
    const transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.STMP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: emailForm,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
    });
  },
};

Object.freeze(mailservice);

module.exports = {
  mailservice,
};
