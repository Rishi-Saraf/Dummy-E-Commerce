const express = require("express")

const adminControl = require("../controllers/admin")

const router = express.Router()

router.get('/add-product',adminControl.getAddProduct)
router.post('/add-product',adminControl.postAddProduct)
router.get('/products',adminControl.getAdminProduct)
router.get("/edit-product/:productId",adminControl.getEditProduct)
router.post("/edit-product",adminControl.postEditProduct)
router.post("/delete",adminControl.deleteOneProduct)


module.exports = router