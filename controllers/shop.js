const cartModel = require('../models/cart')
const Product = require('../models/products')
const productModel = require('../models/products')

exports.Shop = (req,res)=>{
    productModel.findAll()
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
    var fetchedCart;
    var newQuantity = 1;
    req.user
    .getCart()
    .then(cart=>{
        fetchedCart = cart
        return cart.getProducts({where :  {id : prodId}})
    })
    .then(products=>{
        var product;
        if(products.length>0){
            product = products[0]
        }
        if(product) {
          oldQty = product.cartItem.qty
          newQuantity = oldQty + 1
          return product
        }
        return productModel.findByPk(prodId)
    })
    .then(product=>{
        return fetchedCart.addProduct(product, {through : {qty : newQuantity}})
    })
    .then(data=>{
        res.redirect('/cart')
        console.log(newQuantity)
    })
    .catch(err=>console.log(err))
}

exports.getCart = (req,res)=>{
    req.user.getCart()
    .then(cart=>{
        console.log("CART PRODUCTS @ SHOP.JS GETCART FUNCTION LINE NO. 31")
        return cart.getProducts()
    })
    .then(products=>{
        console.log(products)
        params = {
            title : 'My-Cart',
            cartProducts : products,
        }
        res.render('shop/cart.pug',params)
    })
    .catch(err=>console.log(err))

}

exports.deleteCart = (req,res)=>{
    let id = req.body.productId
    req.user
    .getCart()
    .then(cart=>{
       return cart.getProducts({where : {id : id}})
    })
    .then(products=>{
        product = products[0]
        return product.cartItem.destroy()
    })
    .then(data=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.getCheckout = (req,res)=>{
    req.user
    .getOrder({include : ['products']})
    .then(orders=>{
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
        fetchedCart = Cart
        return Cart.getProducts()
    })
    .then(products=>{
        return req.user.getOrder()
        .then(result=>{
            console.log("RESULT")
            console.log(result)
            if(result==null){
            return req.user
            .createOrder()
            }
            return req.user.getOrder()
           .then(order=>{
                return order.addProducts(
                    products.map(product=>{
                    product.orderItem = {qty : product.cartItem.qty}
                    return product
                    })
                )
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .then(result=>{
        fetchedCart.setProducts(null)
    })
    .then(result=>{
        res.redirect('/checkout')
    })
    .catch(err=>console.log(err))
}