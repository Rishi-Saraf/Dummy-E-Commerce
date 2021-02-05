const productModel = require('../models/products')
const mongoDb = require('mongodb')
const objectId = mongoDb.ObjectId
const fileUtil = require("../utils/file.js")

exports.getAddProduct = (req,res)=>{
    params = {
        isLoggedIn : req.session.user,
        path:"/admin/add-product",
        title:"add product",

    }
    res.render('admin/edit-product.pug',params)
}


exports.postAddProduct = (req,res)=>{
    var title = req.body.title;
    var price = req.body.price;
    var desc = req.body.desc;
    var image  = req.file.path;
    var userId = req.session.user;
    if(!image){
        return res.redirect('/admin/add-products')
    }
    const product = new productModel({title:title,desc:desc,price:price,imageUrl:image,user:userId})
    console.log(image)
    product.save()
    .then(product=>{
        res.redirect('/')
    })
    .catch(err=>console.log(err))
    }

exports.getAdminProduct = (req,res)=>{
    productModel.find({user:req.session.user._id})
    .then(product=>{
            params = {
            isLoggedIn : req.session.user,
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
                        isLoggedIn : req.session.user,
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
    const image = req.file.path;
    const prodId = req.body.productId
    productModel.findById(prodId)
    .then(product=>{
        if(product.user.toString()!==req.session.user._id.toString()){
            return res.redirect('/')
        }
        product.title = title;
        product.price = price;
        product.desc = desc;
        if(image){
            fileUtil.deleteFile(product.imageUrl)
            product.imageUrl = image;
        }
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
    productModel.findOne({_id:productId,user:req.session.user._id})
    .then(product=>{
        fileUtil.deleteFile(product.imageUrl)
    })
    productModel.deleteOne({_id:productId,user:req.session.user._id})
    .then(result=>{
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err))
}