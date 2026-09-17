import { body, validationResult } from 'express-validator'
import { QUOTE_SERVICES } from '../models/QuoteRequest.js'
import { FEEDBACK_SERVICES } from '../models/Feedback.js'

export const quoteValidationRules = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('entreprise').trim().notEmpty().withMessage("Le nom de l'entreprise est requis"),
  body('email').trim().isEmail().withMessage('Adresse email invalide').normalizeEmail(),
  body('telephone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('service').isIn(QUOTE_SERVICES).withMessage('Service sélectionné invalide'),
  body('message').trim().notEmpty().withMessage('Le message est requis'),
]

// Business hours, mirrored from the frontend's utils/validate.js so the
// server enforces the same rules even if a request bypasses the UI.
const OPENING_HOUR = '08:30'
const CLOSING_HOUR = '18:30'

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const appointmentValidationRules = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('entreprise').optional({ checkFalsy: true }).trim(),
  body('email').trim().isEmail().withMessage('Adresse email invalide').normalizeEmail(),
  body('telephone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('service').optional({ checkFalsy: true }).trim(),
  body('message').optional({ checkFalsy: true }).trim(),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('La date est requise')
    .custom((value) => {
      const selected = new Date(`${value}T00:00:00`)
      if (Number.isNaN(selected.getTime())) throw new Error('Date invalide')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selected < today) throw new Error("La date doit être aujourd'hui ou une date future")
      const day = selected.getDay()
      if (day === 0 || day === 6) throw new Error('Nous sommes fermés le week-end (lundi au vendredi uniquement)')
      return true
    }),
  body('heure')
    .trim()
    .notEmpty()
    .withMessage("L'heure est requise")
    .custom((value, { req }) => {
      if (!/^\d{2}:\d{2}$/.test(value)) throw new Error('Heure invalide')
      const minutes = toMinutes(value)
      if (minutes < toMinutes(OPENING_HOUR) || minutes > toMinutes(CLOSING_HOUR)) {
        throw new Error(`Nos rendez-vous sont disponibles entre ${OPENING_HOUR} et ${CLOSING_HOUR}`)
      }
      const dateValue = req.body.date
      if (dateValue) {
        const now = new Date()
        const selectedDateTime = new Date(`${dateValue}T${value}`)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selectedDate = new Date(`${dateValue}T00:00:00`)
        if (selectedDate.getTime() === today.getTime() && selectedDateTime < now) {
          throw new Error('Cet horaire est déjà passé')
        }
      }
      return true
    }),
]

export const feedbackValidationRules = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').trim().isEmail().withMessage('Adresse email invalide').normalizeEmail(),
  body('service')
    .optional({ checkFalsy: true })
    .isIn(FEEDBACK_SERVICES)
    .withMessage('Service sélectionné invalide'),
  body('note').isInt({ min: 1, max: 5 }).withMessage('La note doit être comprise entre 1 et 5'),
  body('message').trim().notEmpty().withMessage('Votre avis est requis'),
]

export function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}
