const nodemailer = require("nodemailer");
// const bcrypt = require("bcrypt");
// const db = require("../Models");

// Assigning users to the variable User
// const User = db.User;

//#region sendOtpEmail
const sendEmailOTP = async (email, otp) => {
  // Set up the email transporter (use your SMTP server details here)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASS,
    },
    // debug: true, // Enable debug output
    // logger: true, // Log information to the console
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log("SMTP Transport Error: ", error);
    } else {
      console.log("SMTP Server is ready to send emails");
    }
  });

  // OTP and message
  //const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random OTP
  // Compose the email message
  const message = {
    //from: process.env.SENDER_EMAIL, // Sender email address
    from: `"Node Training Project sent verification email 👻" <${process.env.SENDER_EMAIL}>`, // Sender email address
    
    to: email, // Recipient email address
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  // Send email
  try {
    await transporter.sendMail(message);
    console.log("OTP email sent");
  } catch (error) {
    console.log("Error sending OTP email:", error);
    throw new Error("Error sending OTP email");
  }
};

//#region generateOtp
// Generate OTP function (using crypto for randomness)
const generateOTP = () => {
  const length = 6; // Length of the OTP
  const characters = "0123456789";
  let OTP = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    OTP += characters[index];
  }
  return OTP; // Returns the generated OTP
  //return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};


module.exports = {
  generateOTP,
  sendEmailOTP,
};

