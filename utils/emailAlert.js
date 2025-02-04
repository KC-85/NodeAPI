const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendErrorEmail = async (errorMessage) => {
  const mailOptions = {
    from: `"System Alert" <${process.env.EMAIL_USER}>`,
    to: process.env.ALERT_EMAIL,
    subject: "🚨 CRITICAL ERROR DETECTED",
    text: `A critical error has occurred:\n\n${errorMessage}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Critical Error Email Sent");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendErrorEmail };
