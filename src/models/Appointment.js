import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    entreprise: { type: String, trim: true, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true },
    telephone: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // yyyy-mm-dd (as sent by <input type="date">)
    heure: { type: String, required: true }, // HH:mm (as sent by <input type="time">)
    service: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['nouveau', 'confirme', 'annule'],
      default: 'nouveau',
    },
  },
  { timestamps: true }
)

export const Appointment = mongoose.model('Appointment', appointmentSchema)
