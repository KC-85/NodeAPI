const nodemailer = require("nodemailer");
require("dotenv").config();

// Yahoo SMTP Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465, // Secure SMTP port
  secure: true, // Use TLS encryption
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,   // Enable SMTP logs
  debug: true,    // Enable detailed debugging output
});

// Function to Send an Email Alert
const sendErrorEmail = async (errorMessage) => {
  const mailOptions = {
    from: `"CatAlert" <${process.env.EMAIL_USER}>`,
    to: process.env.ALERT_EMAIL, // Hotmail or any other email
    subject: "🚨 Albi",
    text: `Albi says meow then gets a bit bitey:\n\n${errorMessage}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Albi mail sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);

    // Log more details if there's an SMTP issue
    if (error.response) {
      console.error("🔍 SMTP Response:", error.response);
    }
  }
};

module.exports = { sendErrorEmail };
