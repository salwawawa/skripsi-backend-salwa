const express = require('express')
const router = express.Router()
const activityController = require('../controllers/activityController')

router.get('/', activityController.index)
router.post('/', activityController.store)
router.get('/:id', activityController.show)
router.put('/:id', activityController.update)
router.delete('/:id', activityController.destroy)

module.exports = router
