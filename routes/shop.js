const express =  require('express')

const shopControl = require('../controllers/shop')

const router = express.Router()

router.get('/',shopControl.Shop)

router.get('/cart',shopControl.getCart)

router.post('/cart',shopControl.Cart)

router.post('/delete-cart',shopControl.CartDelete)

router.get('/checkout',shopControl.getCheckout)

router.post('/create-order',shopControl.createCheckout)

module.exports = router

