const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login } = userController
const userAuthMiddleware = require('../Middlewares/userAuthMiddleware')
// const { sendOtp, verifyOtp, resetPassword } = require('../Controllers/authController')
const { sendOtp, verifyOtp, resetPassword } = require('../Controllers/authController')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuthMiddleware.saveUser, signup)

//login route
router.post('/login', login )

router.post("/forgot-password", sendOtp); // Send OTP to the user's email
router.post("/verify-otp", verifyOtp);   // Verify OTP entered by the user
router.post("/reset-password", resetPassword); // Reset the password

module.exports = router