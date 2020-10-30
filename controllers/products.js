
const productModel = require('../models/products')

exports.Details = (req,res) => {
    let productId = req.params.prodId
    productModel.findByPk(productId)
    .then(product=>{
        params = {product:product,
        		  userName : req.user.name
        		}
        res.render('./shop/detailPage.pug',params)
        console.log(product)
    })
    .catch(err=>console.log(err))
}