const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

const { check,body } = require("express-validator/check")

const isAuth = require('../middlewares/isAuth')

router.get('/login',authController.getLogin)
router.post('/login',check('email').isEmail().normalizeEmail(),authController.postLogin)
router.post('/logout',isAuth,authController.logout)
router.post(
            '/signup',check('email').isEmail()
            .withMessage("Invalid Email").normalizeEmail(),
            body('password').isLength({min:8,max:12})
            .trim()
            .withMessage("Password should be more than 8 characters and less than 12 characters")
            .isAlphanumeric().withMessage("Password should be alphanumeric"),
            (req,res,next)=>{
                pw = req.body.password
                cpw = req.body.confirmPassword
                email = req.body.email
                uname = req.body.name
                if(pw!==cpw){
                    const params = {
                        title : 'signup',
                        path : 'login',
                        errorMessage : "Passwords do not match",
                        oldInput : {
                            email : email,
                            password : pw,
                            name : uname,
                            confirmPw : cpw
                        }
                    }
                    return res.status(422).render('login/signup.pug',params)
                }
                return next()
            },
            authController.postSignup
)
router.get('/signup',authController.getSignup)

module.exports = router