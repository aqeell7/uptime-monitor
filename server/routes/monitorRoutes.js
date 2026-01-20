import express from 'express'
import { createMonitor, getMonitors } from '../controllers/monitorController.js'
import { protect } from '../middleware/authMiddleware.js'
import { deleteMonitor } from '../controllers/monitorController.js'

const router = express.Router()

router.post('/',protect,createMonitor)
router.get('/',protect,getMonitors)
router.delete('/:id', protect, deleteMonitor)

export default router;