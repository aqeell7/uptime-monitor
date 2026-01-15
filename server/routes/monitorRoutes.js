import express from 'express'
import { createMonitor } from '../controllers/monitorController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use('/',protect,createMonitor)

export default router;