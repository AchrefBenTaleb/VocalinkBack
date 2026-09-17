import { QuoteRequest } from '../models/QuoteRequest.js'
import { sendMail } from '../config/mailer.js'
import { adminQuoteEmail, clientQuoteConfirmationEmail } from '../utils/emailTemplates.js'

export async function createQuoteRequest(req, res, next) {
  try {
    const { nom, entreprise, email, telephone, service, message } = req.body

    const quote = await QuoteRequest.create({ nom, entreprise, email, telephone, service, message })

    // Notifications are sent in the background — a slow/failing mailbox
    // must never block or fail the form submission itself.
    if (process.env.NOTIFY_EMAIL) {
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `Nouvelle demande de devis — ${quote.nom} (${quote.entreprise})`,
        html: adminQuoteEmail(quote),
      }).catch((err) => console.error('Admin notification error:', err.message))
    }

    sendMail({
      to: quote.email,
      subject: 'Votre demande de devis a bien été reçue — Vocalink',
      html: clientQuoteConfirmationEmail(quote),
    }).catch((err) => console.error('Client confirmation error:', err.message))

    res.status(201).json({ success: true, data: quote })
  } catch (err) {
    next(err)
  }
}

export async function getQuoteCount(req, res, next) {
  try {
    const count = await QuoteRequest.countDocuments()
    res.json({ success: true, count })
  } catch (err) {
    next(err)
  }
}

// Simple listing endpoint for an eventual admin dashboard.
// NOTE: add authentication before exposing this beyond local/internal use.
export async function listQuoteRequests(req, res, next) {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 })
    res.json({ success: true, count: quotes.length, data: quotes })
  } catch (err) {
    next(err)
  }
}
