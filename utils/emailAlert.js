const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to determine the SMTP provider based on the recipient email domain
const getSMTPConfig = (recipientEmail) => {
  const domain = recipientEmail.split("@")[1];

  if (domain.includes("gmail.com")) {
    return {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    };
  } else if (domain.includes("yahoo.com")) {
    return {
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
      },
    };
  } else if (domain.includes("hotmail.com") || domain.includes("outlook.com") || domain.includes("live.com")) {
    return {
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS,
      },
    };
  } else {
    throw new Error(`Unsupported email domain: ${domain}`);
  }
};

// Function to send email alert
const sendErrorEmail = async (recipientEmail, errorMessage) => {
  try {
    const smtpConfig = getSMTPConfig(recipientEmail);
    const transporter = nodemailer.createTransport({
      ...smtpConfig,
      logger: true,   // Enable SMTP logs
      debug: true,    // Enable detailed debugging output
    });

    const mailOptions = {
      from: `"Albi Alert" <${smtpConfig.auth.user}>`,
      to: recipientEmail,
      subject: "🚨 Occasionally bitey cat detected",
      text: `Albi says meow and purrs then a little bitey:\n\n${errorMessage}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Albi Email Sent Successfully to ${recipientEmail}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${recipientEmail}:`, error);
  }
};

module.exports = { sendErrorEmail };
