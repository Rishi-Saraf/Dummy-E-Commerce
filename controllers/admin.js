const productModel = require('../models/products')
const mongoDb = require('mongodb')
const objectId = mongoDb.ObjectId

exports.getAddProduct = (req,res)=>{
    params = {
        path:"/admin/add-product",
        title:"add product"
    }
    res.render('admin/edit-product.pug',params)
}


exports.postAddProduct = (req,res)=>{
    var title = req.body.title;
    var price = req.body.price;
    var desc = req.body.desc;
    var image  = req.body.img;
    const product = new productModel({title:title,desc:desc,price:price,imageUrl:image})
    product.save()
    .then(product=>{
        res.redirect('/')
    })
    .catch(err=>console.log(err))
    }

exports.getAdminProduct = (req,res)=>{
    productModel.find()
    .then(product=>{
            params = {
            path:"/admin/products",
            title:"my products",
            prods:product,
        }
        res.render('admin/admin-products.pug',params)
    })
    .catch(err=>console.log(err))
}

exports.getEditProduct = (req,res)=>{
        const editMode = req.query.edit;
        let productId = req.params.productId
        if(!editMode){
            res.redirect('/')
        }
        productModel.findById(productId)
        .then(products=>{
                if(!products){
                    res.redirect('/')
                }
                else{
                    params = {
                        path:"",
                        title:"my products",
                        edit:editMode,
                        product:products
                    }
                    res.render('admin/edit-product.pug',params)
                }
            })
        }

exports.postEditProduct = (req,res)=>{
    const title = req.body.title;
    const price = req.body.price;
    const desc = req.body.desc;
    const imageUrl = req.body.img;
    const prodId = req.body.productId
    productModel.findById(prodId)
    .then(product=>{
        product.title = title;
        product.price = price;
        product.desc = desc;
        product.imageUrl = imageUrl;
        return product.save()   
    }
    )
    .then(product =>{
        res.redirect("/admin/products");
    })
    .catch(err=>console.log(err))
}

exports.deleteOneProduct = (req,res)=>{
    const productId = req.body.productId
    productModel.deleteById(productId)
    .then(result=>{
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err))
}