const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shopController')

router.get('/', shopController.index)
router.post('/', shopController.store)
router.get('/:id', shopController.show)
router.put('/:id', shopController.update)
router.delete('/:id', shopController.destroy)
router.get('/:id/products', shopController.getProducts)

module.exports = router
