const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { sendOtp } = require("./authController");
const { generateOTP, sendEmailOTP } = require("../Utils/sendEmailgenerateOtp");
const sendResponse = require("../Utils/apiResponse");

// Assigning users to the variable User
const User = db.User;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
 try {
   const { first_name, last_name, email, phone, password, remember_me } = req.body;
   const data = {
    first_name,
    last_name,
    email,
    phone,
    password: await bcrypt.hash(password, 10),
    role: 'user',
    status: '1', // Assuming '1' means active, set default value
    isVerified: '0', // Assuming '1' means active, set default value
    remember_me: remember_me || false, // Assuming default is false
   };
    // send otp to verify user email
    // Generate OTP
    const otp = generateOTP();
    console.log('signup otp: ====================>', otp);

    // Store OTP temporarily (e.g., in memory or a database) for verification later
    data.otp = otp;
    // user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP expiry time (15 minutes)

    // Send OTP to user's email
    await sendEmailOTP(email, otp);

   //saving the user
   const user = await User.create(data);

   //if user details is captured
   //generate token with the user's id and the secretKey in the env file
   if (user) {
     const token = jwt.sign({ id: user.id }, process.env.secretKey, {
       expiresIn: 1 * 24 * 60 * 60 * 1000,
     });

     console.log("user".trap, JSON.stringify(user, null, 2));
     console.log(token);
      //send users details and token 
      const responseData = {
        user: user,      // Include user data
        token: token,    // Include the token
      }
    return sendResponse({res, status: true, message: "Registration successful", data: responseData, statusCode: 200});
   } else {
    return sendResponse({res, status: false, message: "Details are not correct", statusCode: 401 });
   }
 } catch (error) {
   console.log(error);
 }
};


//login authentication

const login = async (req, res) => {
 try {
    const { email, password } = req.body;

   //find a user by their email
   const user = await User.findOne({ where: { email: email } });

   //if user email is found, compare password with bcrypt
   if (user) {
     const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

    if (isSame) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      //if password matches wit the one in the database
      //go ahead and generate a cookie for the user
      console.log("login user", JSON.stringify(user, null, 2));
      console.log(token);
      //send users details and token 
      const responseData = {
        user: user,      // Include user data
        token: token,    // Include the token
      }
      return sendResponse({res, status: true, message: "Login successfully", data: responseData, statusCode: 200});
    } else {
      return sendResponse({res, status: false, message: "Authentication failed", statusCode: 401});
    }
   } else {
     return sendResponse({res, status: false, message: "Details are not correct", statusCode: 401});
   }
 } catch (error) {
   console.log(error);
 }
};

module.exports = {
 signup,
 login,
};