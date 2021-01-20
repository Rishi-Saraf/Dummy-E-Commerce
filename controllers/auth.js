const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator/check')

exports.getLogin = (req,res)=>{
    let message = req.flash("error")
    if(message.length>0){
        message = message[0]
    }else{
        message = null
    }
    const params = {
        title : 'login',
        path : 'login',
        isLoggedIn : req.session.user,
        errorMessage : message
    }
    res.render('login/login.pug',params)
}

exports.postLogin = (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    userModel.findOne({email : email})
    .then(user=>{
        if(!user){
            req.flash('error','Invalid Email or Password')
            return res.redirect('/login')
        }
        bcrypt.compare(password,user.password)
        .then(isCorrect=>{
            if(isCorrect){
                req.session.isLoggedIn = true
                req.session.user = user
                return req.session.save(err=>{
                    res.redirect('/')
                    console.log("LOGGED IN")
                })
            }
            req.flash('error','Invalid Email or Password')
            res.redirect('/login')
        })
        .catch(err=>console.log(err))
    })
}

exports.logout = function(req,res){
   req.session.destroy(err=>{
       console.log(err)
       res.redirect('/')
    }) 
}

exports.getSignup = (req,res)=>{
    const params = {
        title : 'signup',
        path : 'login',
        isLoggedIn : req.session.user,
    }
    res.render('login/signup.pug',params)
}

exports.postSignup = (req,res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const confirmPw = req.body.confirmPasswords
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        const params = {
            title : 'signup',
            path : 'login',
            errorMessage : errors.array()[0].msg
        }
        console.log(errors)
        return res.status(422).render('login/signup.pug',params)
    }
    userModel.findOne({email : email})
    .then(user=>{
        if(user){
            req.flash('error','User already exists')
            let errors = req.flash("error")
            const params = {
                title : 'signup',
                path : 'login',
                errorMessage : errors[0]
            }
            res.render("login/signup.pug",params)
        }
        bcrypt.hash(password,12)
        .then(hashedPw=>{
            const newUser = new userModel({
                name : name,
                email : email,
                password : hashedPw,
                cart : {items : []} 
            })
            return newUser.save()
        })
        .then(result=>{
            res.redirect('/login')
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}