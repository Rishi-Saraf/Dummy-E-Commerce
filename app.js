const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const csrf = require("csurf")
const flash = require('connect-flash')

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')
const productRoute = require('./routes/product')
const authRoute = require('./routes/auth')

const url = require('./url')

const userModel = require("./models/user.js")

const app = express()
const csrfProtection = csrf()

const Session = require('express-session')
const mongoDBsession = require('connect-mongodb-session')(Session)

const sessionStorage = new mongoDBsession(
    {
        uri : url.sessionsUrl,
        collection : 'sessions'
    })
        

app.set('view engine','pug');
app.set('views','./views');

app.use(Session({
    secret : 'helloWorld',
    resave : false,
    saveUninitialized : false,
    store : sessionStorage
}))
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded());
app.use('',(req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    userModel.findById(req.session.user._id)
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>console.error(err))
}
)
app.use(csrfProtection)
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken()
    next()
})
app.use(flash())
app.use('/admin',adminRoute)
app.use('/product',productRoute)
app.use('',shopRoute)
app.use('',authRoute)
app.use('',(req,res)=>{
    res.render('404.pug')
})

mongoose.connect(url.url,{ useNewUrlParser: true })
.then(result=>{
	app.listen(80)
})
.catch(err=>console.log(err))