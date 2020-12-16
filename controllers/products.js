
const productModel = require('../models/products')

exports.Details = (req,res) => {
    let productId = req.params.prodId
    productModel.findById(productId)
    .then(product=>{
        params = {
            isLoggedIn : req.session.user,
            product:product,
            title : product.title+" | Shop",
        		}
        res.render('./shop/detailPage.pug',params)
        console.log(product)
    })
    .catch(err=>console.log(err))
}