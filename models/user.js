// const mongoDb = require('mongodb')
// const getDb = require('../utils/database').getDb

// class User{
// 	constructor(name,email,cart,id) {
// 		this.name = name
// 		this.email = email
// 		this.cart = cart?cart:{items:[]}
// 		this._id = id
// 	}

// 	save() {
// 		let db = getDb()
// 		let dbOps = db.collection('users').insertOne(this)
// 		return dbOps
// 	}

// 	static findById(userId) {
// 		let db = getDb()
// 		let dbOps = db.collection('users')
// 		.find({_id:new mongoDb.ObjectID(userId)})
// 		.next()
// 		.then(user=>
// 			{
// 				console.log(user)
// 				return user
// 			})
// 		.catch(err=>console.error(err))
// 		return dbOps
// 	}


// 	 getCart() {
// 		

// 	addOrder() {
// 		const db = getDb()
// 		return this.getCart()
// 		.then(products=>{
// 			const order = {
// 				items : products,
// 				user: {
// 					_id : new mongoDb.ObjectID(this._id)
// 				}
// 			}
// 			return db.collection('orders')
// 			.insertOne(order)
// 			.then(result=>{
// 				this.cart = {items : []}
// 				return db
// 				.collection('users')
// 				.updateOne({_id:new mongoDb.ObjectID(this._id)},{$set:{cart:this.cart}})
// 			})
// 		})
// 		.catch(err=>console.error(err))
// 	}

// 	getOrder() {
// 		const db = getDb()
// 		return db
// 		.collection('orders')
// 		.find({'user._id' : new mongoDb.ObjectID(this._id)})
// 		.toArray()
// 	}
// }

// module.exports = User


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	name : {
		type : String,
		required : true
	},
	password: {
		type : String,
		required : true
	},
	email : {
		type : String,
		required : true
	},	
	cart : {
		items : [
			{
				productId : {type : Schema.Types.ObjectId,ref : 'Product',required : true},
				quantity : {type : Number,required : true},
			}
		]
	}
})

userSchema.methods.addToCart = function(product){
 		let newQty = 1
		let updatedCartItems = [...this.cart.items]
		const cartItemIndex = updatedCartItems.findIndex(cp=>
			{
				return cp.productId.toString() === product._id.toString()
			})
		if(cartItemIndex>=0){
			newQty = updatedCartItems[cartItemIndex].quantity + 1
			updatedCartItems[cartItemIndex].quantity = newQty
		}else{
			updatedCartItems.push({productId : product._id,quantity:1})
		}
		const updatedCart = {
			items:updatedCartItems
		}
		this.cart = updatedCart;
		this.save()
}

userSchema.methods.deleteCart = function(productId) {
	let updatedCart = this.cart.items.filter(p=>{
		return p.productId.toString() !== productId.toString()
	})
	this.cart.items = updatedCart
	return this.save()
}

userSchema.methods.clearCart = function() {
	this.cart = {items : []}
	this.save()
}

	// 	deleteById(productID) {
	// 		const updatedCartItems = this.cart.items.filter(prod=>{
	// 			return prod.productId.toString() !== productID.toString()
	// 		})
	// 		console.log(updatedCartItems)
	// 		const db = getDb()
	// 		return db.collection('users')
	// 		.updateOne({_id:new mongoDb.ObjectID(this._id)},{$set:{cart:{items:updatedCartItems}}})
	// 		.then(cart=>cart)
	// 		.catch(err=>console.error(err))
	// 	}

module.exports = mongoose.model('User',userSchema)