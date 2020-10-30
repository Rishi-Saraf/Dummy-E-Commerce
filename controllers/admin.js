const productModel = require('../models/products')
const userModel = require('../models/user')

exports.getAddProduct = (req,res)=>{
    params = {
        path:"/admin/add-product",
        title:"add product"
    }
    res.render('admin/edit-product.pug',params)
}

let prodClass = productModel.productClass

exports.postAddProduct = (req,res)=>{
    var title = req.body.title;
    var price = req.body.price;
    var desc = req.body.desc;
    var image  = req.body.img;
    req.user.createProduct(
    {
        title : title,
        price : price,
        desc : desc,
        imageUrl : image
    }
    ).then(product=>{
        res.redirect('/')
    })
    .catch(err=>console.log(err))
    }

exports.getAdminProduct = (req,res)=>{
    req.user.getProducts()
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
        req.user
        .getProducts({where : {id : productId}})
        .then(products=>{
                const product = products[0]
                if(!product){
                    res.redirect('/')
                }
                {
                    params = {
                        path:"",
                        title:"my products",
                        edit:editMode,
                        product:product
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
    productModel.findByPk(prodId)
    .then(product=>{
        product.title = title;
        product.price = price
        product.desc = desc
        product.imageUrl = imageUrl
        return product.save()
    })
    .then(()=>{console.log("PRODUCT UPDATED!!!")
            res.redirect('/admin/products')})
    .catch(err=>console.log(err))
}

exports.deleteOneProduct = (req,res)=>{
    const productId = req.body.productId
    productModel.findByPk(productId)
    .then(product=>{
        return product.destroy()
    })
    .then(result=>{
        console.log("PRODUCT DESTROYED!!!!!!!!")
        console.log("-------------------------")
        console.log(result)
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err))
}