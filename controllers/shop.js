
const Product = require('../models/products')
const productModel = require('../models/products')
const userModel = require('../models/user')

exports.Shop = (req,res)=>{
    productModel.fetchAll()
    .then(products=>{
        params = {
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
    req.user.getCart()
    .then(products=>{
        console.log(products)
        params = {
            title : 'My-Cart',
            cartProducts : products,
        }
        res.render('shop/cart.pug',params)
    }) 
}

exports.CartDelete = (req,res)=>{
    let id = req.body.productId
    console.log(id)
    req.user
    .deleteById(id)
    .then(data=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.getCheckout = (req,res)=>{
    req.user
    .getOrder()
    .then(orders=>{
        console.log(orders)
        const params = {
            orders : orders,
            title : "Checkout"
        }
        res.render('shop/checkout.pug',params)
    })
    .catch(err=>console.log(err))
}

exports.createCheckout = (req,res)=>{
    req.user
    .getCart()
    .then(Cart=>{
        req.user.addOrder()
        .then(result=>{
            res.redirect('/checkout')
        })
    })
    .catch(err=>console.error(err))
}
