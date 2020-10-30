const Sequelize = require('sequelize')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sequelize = require('./utils/database')

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')
const productRoute = require('./routes/product')

const user = require("./models/user.js")
const product = require("./models/products.js")

const app = express()

app.set('view engine','pug');
app.set('views','./views');


app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded())
app.use((req,res,next)=>{
	user.findByPk(1)
	.then(result=>{
		req.user = result
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

product.belongsTo(user,{constraints : true, onDelete : 'CASCADE'})
user.hasMany(product)

sequelize.sync()
.then(result=>{
	return user.findByPk(1)
})
.then(result=>{
	if(!result){
		user.create({name : "Rishi Saraf", email : "RishiSaraf@gmail.com"})
	}
	return Promise.resolve(result)
})
.then(result=>{
	// console.log(result)
	const port = 80
	app.listen(port,()=>console.log(`App started at ${port}!!!`))
})
.catch(err=>console.log(err))

