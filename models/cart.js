const rootDir = require('../utils/rootDir')
const path = require('path')
const p = path.join(rootDir,'data','cart.json')
const fs = require('fs')
const { stringify } = require('querystring')



exports.cartClass = class Cart{
    static addProduct(id,productPrice){
        let cart = {products:[],totalPrice:0}
        fs.readFile(p,(err,fileContent)=>{
            if(!err){
                cart = JSON.parse(fileContent)
            }
            console.log(cart)
            let existingProductIndex = cart.products.findIndex(product=>product.id===id)
            console.log(existingProductIndex)
            let existingProduct = cart.products[existingProductIndex]
            console.log(existingProduct)
            let updatedProduct
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty+1
                cart.products = [...cart.products]            
                cart.products[existingProductIndex] = updatedProduct
            }else if(!existingProduct){
                updatedProduct = {id:id,qty:1}
                cart.products = [...cart.products,updatedProduct]            
            }
            cart.totalPrice =  cart.totalPrice+ +productPrice
            console.log(cart)
            fs.writeFile(p,JSON.stringify(cart),err=>{
                console.log(err)
            })
            console.log(p)
        })
    }

    static delete(id,price){
        fs.readFile(p,(err,fileContent)=>{
            const JSONtoJs = JSON.parse(fileContent)
            const UpdatedCart = {...JSONtoJs}
            console.log(UpdatedCart)
            const ProductArray =  UpdatedCart.products
            const Product = ProductArray.find(prod => prod.id === id)
            if(!Product){
                return
            }
            UpdatedCart.products = ProductArray.filter(prod => prod.id !== id)
            const ProductQty =  Product.qty
            UpdatedCart.totalPrice = UpdatedCart.totalPrice - price * ProductQty
            fs.writeFile(p,JSON.stringify(UpdatedCart),err=>{
                console.log(err)
            })
        })
    }

    static getCart(cb){
        fs.readFile(p,(err,fileContent)=>{
         const cart = JSON.parse(fileContent)
            if(err){
                cb(null)
            }else{
                cb(cart)
            }
        })
    }
}
