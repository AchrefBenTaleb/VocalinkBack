import { Router } from 'express'
import { createAppointment, listAppointments } from '../controllers/appointmentController.js'
import { appointmentValidationRules, validateRequest } from '../middleware/validators.js'

const router = Router()

router.post('/', appointmentValidationRules, validateRequest, createAppointment)
router.get('/', listAppointments)

export default router
