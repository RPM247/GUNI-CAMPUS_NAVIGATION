const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')

const router = express.Router()

//for creating user api
router.post('/register', registerUser)
//for checking user email
router.post('/email', checkEmail)
//for checking user password
router.post('/password', checkPassword)

module.exports = router