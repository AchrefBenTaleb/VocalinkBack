import { Router } from 'express'
import { createQuoteRequest, getQuoteCount, listQuoteRequests } from '../controllers/quoteController.js'
import { quoteValidationRules, validateRequest } from '../middleware/validators.js'

const router = Router()

router.post('/', quoteValidationRules, validateRequest, createQuoteRequest)
router.get('/count', getQuoteCount)
router.get('/', listQuoteRequests)

export default router
