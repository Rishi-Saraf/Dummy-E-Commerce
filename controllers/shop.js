const fs = require("fs")
const path = require("path")
const Product = require('../models/products')
const productModel = require('../models/products')
const userModel = require('../models/user')
const orderModel = require('../models/orders')
const pdfDoc = require("pdfkit")

exports.Shop = (req,res)=>{
    ITEMS_PER_PAGE = 1
    currentPage = req.query.page
    productModel.countDocuments()
    .then(numProds=>{
        if(!currentPage){
            currentPage = 1
        }
        productModel.find()
        .skip((currentPage-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(products=>{
            params = {
                isLoggedIn : req.session.user,
                prods : products,
                path : '/',
                title: 'shop',
                currentPage: currentPage,
                lastPage: Math.ceil(numProds/ITEMS_PER_PAGE),
                firstPage: 1,
                hasNext: (ITEMS_PER_PAGE*currentPage)<numProds,
                hasPrevious: currentPage>1,
                isValid: currentPage<=Math.ceil(numProds/ITEMS_PER_PAGE),
            }
            res.render('shop/index.pug',params)
        }
        )
    })
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
    req.user.cart.items.forEach(item=>{
        const prodId = item.productId
        productModel.findById(prodId)
        .then(product=>{
            if(!product){
               return req.user.deleteCart(prodId)
            }
        })
        .catch(err=>console.log(err))
    })
    setTimeout(() => {
        req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(user=>{
            const products = user.cart.items
            params = {
            isLoggedIn : req.session.user,
            title : 'My-Cart',
            cartProducts : products,
            }
            res.render('shop/cart.pug',params)
          })
    }, 1500); 
}

exports.CartDelete = (req,res)=>{
    let id = req.body.productId
    console.log(id)
    req.user.deleteCart(id)
    .then(data=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.getCheckout = (req,res)=>{
    orderModel.find({userId : req.session.user._id})
    .then(orders=>{
        console.log(orders)
        const params = {
            isLoggedIn : req.session.user,
            orders : orders,
            title : "Checkout"
        }
        res.render('shop/checkout.pug',params)
    })
    .catch(err=>console.log(err))
}

exports.createCheckout = (req,res)=>{
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items
        const prods = products.map(i=>{
            return {
                product : {...i.productId._doc},
                qty : i.quantity
            }
        })
        const Order = new orderModel({
            userId : req.user,
            products : prods            
        })
        return Order.save()
    })
    .then(data=>{
        req.user.clearCart()
        res.redirect('/checkout')
    })
    .catch(err=>console.error(err))
}

exports.getInvoice = (req,res,next)=>{
    const orderId = req.params.invoiceId;
    const invoiceName = "invoice-"+orderId+".pdf"
    const invoicePath = path.join("invoice",invoiceName) 
    const userName = req.session.user.name
    orderModel.findById(orderId)
    .then(order=>{
        if(!order){
            console.log("No Order like that exists")
            return res.redirect('/')    
        }
        if(order.userId.toString()!==req.session.user._id.toString()){
            console.log("Not authenticated")
            return res.redirect('/')
        }
        // fs.readFile(invoicePath,(err,data)=>{
            //     if (err){
        //         console.error(err)
        //     }
        //     res.setHeader("Content-type","application/pdf")
        //     res.setHeader("Content-disposition",'inline;filename="invoice-'+userName+'"')
        //     res.send(data)
        // })
        const pdfDocument = new pdfDoc()
        res.setHeader("Content-type","application/pdf")
        res.setHeader("Content-disposition",'inline;filename="invoice-'+userName+'"')
        pdfDocument.pipe(fs.createWriteStream(invoicePath))
        pdfDocument.pipe(res)
        pdfDocument.font("Times-Roman").fontSize(20).text("INVOICE",{
            align: "center",
            underline: true,
            lineGap : 12
        })
        // pdfDocument.font("Times-Roman").text("-----------------------",{
        //     align: "center"
        // })
        const intro = `The following are the items bought by you. Order Id : ${order._id}`
        pdfDocument.font("Times-Roman").fontSize(18).text(intro,{
            align: "center",
            underline: true,
            lineGap : 10
        })
        order.products.forEach(product=>{
            pdfDocument.font("Times-Roman").fontSize(16).text(`Product:${product.product.title} | Quantity:${product.qty} |  Price:${product.product.price}`,{
                height: 200,
                width: 465,
                align: "center"
            })
        })
        pdfDocument.end()
    })
    .catch(err=>console.log(err))    
}