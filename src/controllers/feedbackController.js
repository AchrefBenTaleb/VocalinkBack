import { Feedback } from '../models/Feedback.js'
import { sendMail } from '../config/mailer.js'
import { adminFeedbackEmail } from '../utils/emailTemplates.js'

// Pool total d'avis conservés en base pour l'affichage public : au-delà de
// cette limite, l'avis le plus ancien est supprimé pour laisser sa place au
// nouveau.
const FEEDBACK_POOL_SIZE = 6
// Seuil à partir duquel un avis est considéré comme positif.
const POSITIVE_THRESHOLD = 4
// Nombre d'avis positifs affichés sur la page d'accueil.
const POSITIVE_DISPLAY_COUNT = 5

export async function createFeedback(req, res, next) {
  try {
    const { nom, email, service, note, message } = req.body

    const feedback = await Feedback.create({ nom, email, service, note, message })

    // On garde un pool fixe d'avis : dès que la limite est dépassée, le plus
    // ancien est retiré pour que le nouvel avis prenne sa place.
    const total = await Feedback.countDocuments()
    if (total > FEEDBACK_POOL_SIZE) {
      const toRemove = await Feedback.find()
        .sort({ createdAt: 1 })
        .limit(total - FEEDBACK_POOL_SIZE)
        .select('_id')
      await Feedback.deleteMany({ _id: { $in: toRemove.map((f) => f._id) } })
    }

    // Un avis n'est jamais bloquant pour l'utilisateur : la notification part
    // en arrière-plan, comme pour les devis et rendez-vous.
    if (process.env.NOTIFY_EMAIL) {
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `Nouvel avis client — ${feedback.nom} (${feedback.note}/5)`,
        html: adminFeedbackEmail(feedback),
      }).catch((err) => console.error('Admin notification error:', err.message))
    }

    res.status(201).json({ success: true, data: feedback })
  } catch (err) {
    next(err)
  }
}

// Avis affichés au chargement de la page d'accueil : jusqu'à 5 avis
// positifs (note >= 4/5) et 1 avis moins bon, pour un rendu authentique.
// S'il n'existe aucun avis négatif, on affiche uniquement des avis positifs.
export async function getHomepageFeedback(req, res, next) {
  try {
    const negative = await Feedback.find({ note: { $lt: POSITIVE_THRESHOLD } })
      .sort({ createdAt: -1 })
      .limit(1)

    let data
    if (negative.length === 0) {
      data = await Feedback.find({ note: { $gte: POSITIVE_THRESHOLD } })
        .sort({ createdAt: -1 })
        .limit(POSITIVE_DISPLAY_COUNT + 1)
    } else {
      const positive = await Feedback.find({ note: { $gte: POSITIVE_THRESHOLD } })
        .sort({ createdAt: -1 })
        .limit(POSITIVE_DISPLAY_COUNT)
      data = [...positive, ...negative]
    }

    res.json({ success: true, count: data.length, data })
  } catch (err) {
    next(err)
  }
}

// Simple listing endpoint for an eventual admin dashboard / moderation queue.
// NOTE: add authentication before exposing this beyond local/internal use.
export async function listFeedback(req, res, next) {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 })
    res.json({ success: true, count: feedback.length, data: feedback })
  } catch (err) {
    next(err)
  }
}
