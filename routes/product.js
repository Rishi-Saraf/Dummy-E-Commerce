const productControl = require('../controllers/products')
const express = require('express')

const router = express.Router()

router.get('/:prodId',productControl.Details)

module.exports = router