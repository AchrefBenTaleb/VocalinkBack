import mongoose from 'mongoose'

const SERVICES = ['service-client', 'back-office', 'ecommerce', 'commercial', 'telemarketing', 'autre']

const quoteRequestSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    entreprise: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telephone: { type: String, required: true, trim: true },
    service: { type: String, required: true, enum: SERVICES },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['nouveau', 'en-cours', 'traite'],
      default: 'nouveau',
    },
  },
  { timestamps: true }
)

export const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema)
export { SERVICES as QUOTE_SERVICES }
