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
// const csrfProtection = csrf()
const multer = require("multer")

const Session = require('express-session')
const isAuth = require('./middlewares/isAuth')
const mongoDBsession = require('connect-mongodb-session')(Session)

const sessionStorage = new mongoDBsession(
    {
        uri : url.sessionsUrl,
        collection : 'sessions'
    })
        

const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join("images","img"))
    },
    filename: (req,file,cb)=>{
        cb(null, new Date().toISOString().replace(/:/g,"-").replace('.','-') + '-' + file.originalname)
    }
})

const filter = (req,file,cb)=>{
    if(file.mimetype==="image/png"||file.mimetype==="image/jpg"||file.mimetype==="image/jpeg"){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

app.set('view engine','pug');
app.set('views','./views');

app.use(Session({
    secret : 'helloWorld',
    resave : false,
    saveUninitialized : false,
    store : sessionStorage
}))
app.use(express.static(path.join(__dirname,'')),express.static(path.join(__dirname,'images')));
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
app.use(multer({storage:fileStorage,fileFilter:filter}).single('img'))
app.use(flash())
// app.use()
app.use(csrf())
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken()
    next()
})
app.use('/admin',adminRoute)
app.use('/product',productRoute)
app.use('',shopRoute)
app.use('',authRoute)
app.use('',isAuth,(req,res)=>{
    params = {
        isLoggedIn : req.session
    }
    res.render('404.pug',params)
})

mongoose.connect(url.url,{ useNewUrlParser: true })
.then(result=>{
	app.listen(80)
})
.catch(err=>console.log(err))