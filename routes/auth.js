const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

const isAuth = require('../middlewares/isAuth')

router.get('/login',authController.getLogin)
router.post('/login',authController.postLogin)
router.post('/logout',isAuth,authController.logout)
router.post('/signup',authController.postSignup)
router.get('/signup',authController.getSignup)

module.exports = router