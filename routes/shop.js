const express =  require('express')

const shopControl = require('../controllers/shop')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.get('/',shopControl.Shop)

router.get('/cart',isAuth,shopControl.getCart)

router.post('/cart',isAuth,shopControl.Cart)

router.post('/delete-cart',isAuth,shopControl.CartDelete)

router.get('/checkout',isAuth,shopControl.getCheckout)

router.post('/create-order',isAuth,shopControl.createCheckout)

module.exports = router

