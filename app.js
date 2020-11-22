const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoConnectFunc = require('./utils/database').mongoConnect

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')
const productRoute = require('./routes/product')

const userModel = require("./models/user.js")
// const product = require("./models/products.js")
// const cart = require("./models/cart.js")
// const cartItem = require("./models/cart-item.js")
// const order = require("./models/order.js")
// const orderItem = require("./models/order-items.js")

const app = express()

app.set('view engine','pug');
app.set('views','./views');


app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded())
app.use((req,res,next)=>{
	userModel.findById("5fb52f49d3cd7d45feada4b6")
	.then(user=>{
		req.user = new userModel(user.name,user.email,user.cart,user._id)
		console.log(req.user)
		next()
	})
	.catch(err=>console.log(err))
})

app.use('/admin',adminRoute)
app.use('/product',productRoute)
app.use('',shopRoute)
app.use('',(req,res)=>{
    res.render('404.pug')
})

mongoConnectFunc(()=>{
const user = userModel.findById("5fb52f49d3cd7d45feada4b6") 
	if(!user){
	}
    app.listen(80,()=>{
		console.log("APP STARTED")
	})
})