import mongoose from 'mongoose'

const SERVICES = ['service-client', 'back-office', 'ecommerce', 'commercial', 'telemarketing', 'autre']

const feedbackSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    service: { type: String, trim: true, enum: [...SERVICES, ''], default: '' },
    note: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true },
    // Les avis ne sont pas publiés automatiquement : ils passent par une
    // relecture avant d'apparaître éventuellement sur le site.
    status: {
      type: String,
      enum: ['nouveau', 'publie', 'rejete'],
      default: 'nouveau',
    },
  },
  { timestamps: true }
)

export const Feedback = mongoose.model('Feedback', feedbackSchema)
export { SERVICES as FEEDBACK_SERVICES }
