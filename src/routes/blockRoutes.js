const express = require('express')
const router = express.Router()
const blockController = require('../controllers/blockController')

router.get('/', blockController.index)
router.post('/', blockController.store)
router.get('/:id', blockController.show)
router.put('/:id', blockController.update)
router.delete('/:id', blockController.destroy)
router.get('/:id/shops', blockController.getShops)
router.post('/:id/house-numbers', blockController.addHouseNumber)
router.get('/:id/house-numbers', blockController.getHouseNumbers)

module.exports = router
