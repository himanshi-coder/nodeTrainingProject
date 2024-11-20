const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login } = userController
const userAuthMiddleware = require('../Middlewares/userAuthMiddleware')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuthMiddleware.saveUser, signup)

//login route
router.post('/login', login )

module.exports = router