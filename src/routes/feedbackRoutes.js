import { Router } from 'express'
import { createFeedback, listFeedback, getHomepageFeedback } from '../controllers/feedbackController.js'
import { feedbackValidationRules, validateRequest } from '../middleware/validators.js'

const router = Router()

router.post('/', feedbackValidationRules, validateRequest, createFeedback)
// Route publique utilisée par la page d'accueil au chargement.
router.get('/homepage', getHomepageFeedback)
router.get('/', listFeedback)

export default router
