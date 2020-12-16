const express = require("express")

const adminControl = require("../controllers/admin")
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.get('/add-product',isAuth,adminControl.getAddProduct)
router.post('/add-product',isAuth,adminControl.postAddProduct)
router.get('/products',isAuth,adminControl.getAdminProduct)
router.get("/edit-product/:productId",isAuth,adminControl.getEditProduct)
router.post("/edit-product",isAuth,adminControl.postEditProduct)
router.post("/delete",isAuth,adminControl.deleteOneProduct)


module.exports = router