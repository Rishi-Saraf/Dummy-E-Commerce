const mongoDb = require('mongodb')
const getDb = require('../utils/database').getDb

class User{
	constructor(name,email,cart,id) {
		this.name = name
		this.email = email
		this.cart = cart?cart:{items:[]}
		this._id = id
	}

	save() {
		let db = getDb()
		let dbOps = db.collection('users').insertOne(this)
		return dbOps
	}

	static findById(userId) {
		let db = getDb()
		let dbOps = db.collection('users')
		.find({_id:new mongoDb.ObjectID(userId)})
		.next()
		.then(user=>
			{
				console.log(user)
				return user
			})
		.catch(err=>console.error(err))
		return dbOps
	}
	
	addToCart(product){
		let db = getDb()
		let newQty = 1
		console.log(this.cart.items)
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
	    return db.collection('users').updateOne({_id:new mongoDb.ObjectID(this._id)},{$set:{cart:updatedCart}})
}

	 getCart() {
		const productIds = this.cart.items.map(i=>{
			return i.productId
		})
		const db = getDb()
		return db.collection('product')
		.find({_id:{$in: productIds}})
		.toArray()
		.then(products=>{
			const getCartProds = products.map(product=>{
				return {
					...product,
					qty : this.cart.items.find(ci=>{
						return ci.productId.toString() === product._id.toString()
					}).quantity
				}
			})
			this.cart.items = getCartProds.map(product=>{
				return {
					productId : product._id,
					quantity : product.quantity 
				}
			})
			db.collection('users')
			.updateOne({_id:new mongoDb.ObjectID(this._id)},{$set:{cart:{items:this.cart.items}}})
			return getCartProds
		})
		.catch(err=>{console.log(err)})
	}

	deleteById(productID) {
		const updatedCartItems = this.cart.items.filter(prod=>{
			return prod.productId.toString() !== productID.toString()
		})
		console.log(updatedCartItems)
		const db = getDb()
		return db.collection('users')
		.updateOne({_id:new mongoDb.ObjectID(this._id)},{$set:{cart:{items:updatedCartItems}}})
		.then(cart=>cart)
		.catch(err=>console.error(err))
	}

	addOrder() {
		const db = getDb()
		return this.getCart()
		.then(products=>{
			const order = {
				items : products,
				user: {
					_id : new mongoDb.ObjectID(this._id)
				}
			}
			return db.collection('orders')
			.insertOne(order)
			.then(result=>{
				this.cart = {items : []}
				return db
				.collection('users')
				.updateOne({_id:new mongoDb.ObjectID(this._id)},{$set:{cart:this.cart}})
			})
		})
		.catch(err=>console.error(err))
	}

	getOrder() {
		const db = getDb()
		return db
		.collection('orders')
		.find({'user._id' : new mongoDb.ObjectID(this._id)})
		.toArray()
	}
}

module.exports = User