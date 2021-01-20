const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

const { check,body } = require("express-validator/check")

const isAuth = require('../middlewares/isAuth')

router.get('/login',authController.getLogin)
router.post('/login',check('email').isEmail(),authController.postLogin)
router.post('/logout',isAuth,authController.logout)
router.post(
            '/signup',check('email').isEmail().withMessage("Invalid Email"),
            body('password').isLength({min:8,max:12})
            .withMessage("Password should be more than 8 characters and less than 12 characters")
            .isAlphanumeric().withMessage("Password should be alphanumeric"),
            authController.postSignup
)
router.get('/signup',authController.getSignup)

module.exports = router