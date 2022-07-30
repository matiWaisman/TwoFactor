const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text, qr) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transport.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: "qr.txt",
          content: qr,
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
