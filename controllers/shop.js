const productModel = require('../models/products')
const cartModel = require('../models/cart')

exports.Shop = (req,res)=>{
    productModel.findAll()
    .then(products=>{
        params = {
            prods : products,
            path : '/',
            title: 'shop'
        }
        res.render('shop/index.pug',params)
    }
    )
    .catch(
        err => console.log(err)
    )
}

exports.Cart = (req,res)=>{
    prodId = req.body.productId;
    productClass.getProdbyId(prodId,(product)=>{
        CartClass.addProduct(prodId,product.price)
    })
    res.redirect('/cart')
}

exports.getCart = (req,res)=>{
    CartClass.getCart(cart =>{
        const initCartProductArray = cart.products
        productClass.fetchAll(products=>{
            const cartProductArray = []
            for(product of products){
                const matchedProduct = initCartProductArray.find(prod => prod.id === product.id)
                if(matchedProduct){
                    cartProductArray.push({productData:product,qty:matchedProduct.qty})
                }
            }
            console.log(cartProductArray)
            const totalPrice = cart.totalPrice
            const params = {
                cartProducts : cartProductArray,
                totalPrice : totalPrice,
                title: 'shop'
            }
            res.render('shop/cart.pug',params)
        })
    })
}

exports.deleteCart = (req,res)=>{
    let id = req.body.productId
    let price = req.body.price
    CartClass.delete(id,price)
    res.redirect('/cart')
}
