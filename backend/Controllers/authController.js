// ---------> Testing mail service
// const nodemailer = require("nodemailer");
// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]); // Use Google DNS

// const transporter = nodemailer.createTransport( {
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: "geetapanwar521@gmail.com",
//     pass: "btce fesa fbkx rahm",
//   },
//   debug: true,
// });

// transporter.verify((error, success) => {
//     if (error) {
//       console.log("Error connecting to SMTP server:", error);
//     } else {
//       console.log("SMTP server is ready to send messages");
//     }
//   });

// // async..await is not allowed in global scope, must use a wrapper
// const main = async () => {
//     console.log('======>')
//     try {
//         // send mail with defined transport object
//         const info = await transporter.sendMail({
//           from: '"node training project sending email 👻" <geetapanwar521@gmail.com>', // sender address
//           to: "hpanwar521@gmail.com, hpanwar521@yopmail.com", // list of receivers
//           subject: "Hello ✔", // Subject line
//           text: "Hello world?", // plain text body
//           html: "<b>Hello world?</b>", // html body
//         });
      
//         console.log("Message sent: %s [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ ===============>", info);
//     } catch (error) {
//         console.log('error nodemailer ======================>>>>>>>>.', error)
//     }
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main();

// --------> 

// //#region sendOtp 

const db = require("../Models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmailOTP, generateOTP } = require("../Utils/sendEmailgenerateOtp");
const sendResponse = require("../Utils/apiResponse");

// Assigning users to the variable User
const User = db.User;

//forgot-password api controller
const sendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user by email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return sendResponse({res, status: false, message: "User not found", statusCode: 404});
      }

      // Generate OTP
      const otp = generateOTP();
      console.log('otp: ====================>', otp);
  
      // Store OTP temporarily (e.g., in memory or a database) for verification later
      user.otp = otp;
      // user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP expiry time (15 minutes)
      await user.save();
  
      // Send OTP to user's email
      await sendEmailOTP(email, otp);

      return sendResponse({res, status: true, message: "OTP sent to your email", statusCode: 200});
    } catch (error) {
      console.error(error);
      return sendResponse({res, status: false, message: "Network error", statusCode: 500});
    }
};  

const verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Find user by email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return sendResponse({res, status: false, message: "User not found", statusCode: 404});
      }
  
      // Check if OTP is valid and not expired
      if (user.otp !== otp) {
        return sendResponse({res, status: false, message: "Invalid OTP", statusCode: 400});
      }
  
    //   if (user.otpExpiry < Date.now()) {
    //     return res.status(400).send("OTP has expired");
    //   }
  
        //if user details found
        //generate token with the user's id and the secretKey in the env file
        let token;
        if (user) {
            token = jwt.sign({ id: user.id }, process.env.secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });
            
            console.log("user".trap, JSON.stringify(user, null, 2));
            console.log(token);
        
            // OTP is verified
            // change the status of OTP isVerified
            user.isVerified = '1';
            await user.save();
            //send users details and token 
            const responseData = {
                user: user,      // Include user data
                token: token,    // Include the token
            }
            return sendResponse({res, status: true, message: "OTP verified successfully", data: responseData, statusCode: 200});
        } else {
            return sendResponse({res, status: false, message: "Network error", statusCode: 409});
        }
    } catch (error) {
      console.error(error);
      return sendResponse({res, status: false, message: "Error verifying OTP", statusCode: 500});
    }
  };

const resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      // Find user by email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return sendResponse({res, status: false, message: "User not found", statusCode: 404});
      }
  
      // Check if OTP is valid and not expired
      if (user.otp !== otp) {
        return sendResponse({res, status: false, message: "Invalid OTP", statusCode: 400});
      }
  
    //   if (user.otpExpiry < Date.now()) {
    //     return res.status(400).send("OTP has expired");
    //   }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password
      user.password = hashedPassword;
      user.otp = null; // Clear OTP after successful reset
      // user.otpExpiry = null; // Clear OTP expiry
      await user.save();
  
      return sendResponse({res, status: true, message: "Password reset successfully", statusCode: 200});
    } catch (error) {
      console.error(error);
      return sendResponse({res, status: false, message: "Error resetting password", statusCode: 500});
    }
  };


module.exports = {
    sendOtp,
    verifyOtp,
    resetPassword
};
  