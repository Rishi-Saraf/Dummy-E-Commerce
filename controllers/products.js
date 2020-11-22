
const productModel = require('../models/products')

exports.Details = (req,res) => {
    let productId = req.params.prodId
    productModel.findById(productId)
    .then(product=>{
        params = {
            product:product,
            title : product.title+" | "+product.price + " INR",
            user : req.user
        		}
        res.render('./shop/detailPage.pug',params)
        console.log(product)
    })
    .catch(err=>console.log(err))
}