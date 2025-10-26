const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  //create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //options for sending the email
  const options = {
    from: sent_from,
    to: send_to,
    reply_to: reply_to,
    subject: subject,
    html: message,
  };

  //send email

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = async (subject, html, to, from) => {
  const transporter = nodemailer.createTransport({ /* ... */ });
  const text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
  await transporter.sendMail({ from, to, subject: String(subject), html, text });
};
