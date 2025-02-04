const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to send an SMS alert for critical errors
const sendErrorSMS = async (errorMessage) => {
  try {
    await client.messages.create({
      body: `🚨 CRITICAL ERROR: ${errorMessage}`,
      from: process.env.TWILIO_PHONE,
      to: process.env.ADMIN_PHONE,
    });
    console.log("✅ Critical Error SMS Sent Successfully!");
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
  }
};

module.exports = { sendErrorSMS };
