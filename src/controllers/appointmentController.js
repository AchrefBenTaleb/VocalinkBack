import { Appointment } from '../models/Appointment.js'
import { sendMail } from '../config/mailer.js'
import { adminAppointmentEmail, clientAppointmentConfirmationEmail } from '../utils/emailTemplates.js'

export async function createAppointment(req, res, next) {
  try {
    const { nom, entreprise, email, telephone, date, heure, service, message } = req.body

    const appointment = await Appointment.create({
      nom,
      entreprise,
      email,
      telephone,
      date,
      heure,
      service,
      message,
    })

    if (process.env.NOTIFY_EMAIL) {
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `Nouvelle demande de rendez-vous — ${appointment.nom}`,
        html: adminAppointmentEmail(appointment),
      }).catch((err) => console.error('Admin notification error:', err.message))
    }

    sendMail({
      to: appointment.email,
      subject: 'Votre demande de rendez-vous a bien été reçue — Vocalink',
      html: clientAppointmentConfirmationEmail(appointment),
    }).catch((err) => console.error('Client confirmation error:', err.message))

    res.status(201).json({ success: true, data: appointment })
  } catch (err) {
    next(err)
  }
}

// NOTE: add authentication before exposing this beyond local/internal use.
export async function listAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 })
    res.json({ success: true, count: appointments.length, data: appointments })
  } catch (err) {
    next(err)
  }
}
