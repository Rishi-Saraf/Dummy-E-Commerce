
const Product = require('../models/products')
const productModel = require('../models/products')
const userModel = require('../models/user')
const orderModel = require('../models/orders')

exports.Shop = (req,res)=>{
    productModel.find()
    .then(products=>{
        params = {
            isLoggedIn : req.session.user,
            prods : products,
            path : '/',
            title: 'shop'
        }
        res.render('shop/index.pug',params)
        console.log(products)
    }
    )
    .catch(
        err => console.log(err)
    )
}

exports.Cart = (req,res)=>{
    prodId = req.body.productId;
    productModel.findById(prodId)
    .then(product=>{
        return req.user.addToCart(product)
    })
    .then(result=>{
        res.redirect('/cart')
    })
    .catch(err=>console.error(err))
}

exports.getCart = (req,res)=>{
    req.user.cart.items.forEach(item=>{
        const prodId = item.productId
        productModel.findById(prodId)
        .then(product=>{
            if(!product){
               return req.user.deleteCart(prodId)
            }
        })
        .catch(err=>console.log(err))
    })
    setTimeout(() => {
        req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(user=>{
            const products = user.cart.items
            params = {
            isLoggedIn : req.session.user,
            title : 'My-Cart',
            cartProducts : products,
            }
            res.render('shop/cart.pug',params)
          })
    }, 1500); 
}

exports.CartDelete = (req,res)=>{
    let id = req.body.productId
    console.log(id)
    req.user.deleteCart(id)
    .then(data=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.getCheckout = (req,res)=>{
    orderModel.find({userId : req.session.user._id})
    .then(orders=>{
        console.log(orders)
        const params = {
            isLoggedIn : req.session.user,
            orders : orders,
            title : "Checkout"
        }
        res.render('shop/checkout.pug',params)
    })
    .catch(err=>console.log(err))
}

exports.createCheckout = (req,res)=>{
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items
        const prods = products.map(i=>{
            return {
                product : {...i.productId._doc},
                qty : i.quantity
            }
        })
        const Order = new orderModel({
            userId : req.user,
            products : prods            
        })
        return Order.save()
    })
    .then(data=>{
        req.user.clearCart()
        res.redirect('/checkout')
    })
    .catch(err=>console.error(err))
}
