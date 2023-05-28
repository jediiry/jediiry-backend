const nodemailer = require("nodemailer");

const nodeMailer = async (payload) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"Hello Obadoni 👻" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_TO,
    subject: "Lead from Website",
    html: payload,
  });

  if (!info.messageId)
    throw new Error("Unable to process request, kinndly try again later");
};

module.exports = {
  nodeMailer,
};
