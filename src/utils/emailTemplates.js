const SERVICE_LABELS = {
  'service-client': 'Service Client',
  'back-office': 'Back Office',
  ecommerce: 'Support E-commerce',
  commercial: 'Support Commercial',
  telemarketing: 'Télémarketing',
  autre: 'Autre',
}

function serviceLabel(value) {
  return SERVICE_LABELS[value] || value || '—'
}

function wrapper(title, bodyHtml) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
    <div style="background:#4f46e5; padding: 20px 24px; border-radius: 12px 12px 0 0;">
      <h2 style="color:#ffffff; margin:0; font-size:18px;">Vocalink</h2>
    </div>
    <div style="border:1px solid #e5e7eb; border-top:none; border-radius: 0 0 12px 12px; padding: 24px;">
      <h3 style="margin-top:0;">${title}</h3>
      ${bodyHtml}
    </div>
    <p style="font-size:12px; color:#9ca3af; text-align:center; margin-top:16px;">
      Cet email a été généré automatiquement, merci de ne pas y répondre directement.
    </p>
  </div>`
}

export function adminQuoteEmail(quote) {
  return wrapper(
    'Nouvelle demande de devis',
    `
    <table style="width:100%; border-collapse: collapse; font-size:14px;">
      <tr><td style="padding:6px 0; color:#6b7280;">Nom</td><td style="padding:6px 0;"><strong>${quote.nom}</strong></td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Entreprise</td><td style="padding:6px 0;">${quote.entreprise}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Email</td><td style="padding:6px 0;">${quote.email}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Téléphone</td><td style="padding:6px 0;">${quote.telephone}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Service</td><td style="padding:6px 0;">${serviceLabel(quote.service)}</td></tr>
    </table>
    <p style="margin-top:16px; color:#6b7280;">Message :</p>
    <p style="white-space:pre-wrap; background:#f9fafb; padding:12px; border-radius:8px;">${quote.message}</p>
    `
  )
}

export function clientQuoteConfirmationEmail(quote) {
  return wrapper(
    'Votre demande de devis a bien été reçue',
    `
    <p>Bonjour ${quote.nom},</p>
    <p>Merci pour votre demande concernant <strong>${serviceLabel(quote.service)}</strong>. Notre équipe l'a bien reçue et vous répondra sous 24 heures.</p>
    <p>Récapitulatif de votre message :</p>
    <p style="white-space:pre-wrap; background:#f9fafb; padding:12px; border-radius:8px;">${quote.message}</p>
    <p>À très bientôt,<br/>L'équipe Vocalink</p>
    `
  )
}

export function adminFeedbackEmail(feedback) {
  return wrapper(
    'Nouvel avis client',
    `
    <table style="width:100%; border-collapse: collapse; font-size:14px;">
      <tr><td style="padding:6px 0; color:#6b7280;">Nom</td><td style="padding:6px 0;"><strong>${feedback.nom}</strong></td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Email</td><td style="padding:6px 0;">${feedback.email}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Service</td><td style="padding:6px 0;">${feedback.service ? serviceLabel(feedback.service) : '—'}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Note</td><td style="padding:6px 0;">${'★'.repeat(feedback.note)}${'☆'.repeat(5 - feedback.note)} (${feedback.note}/5)</td></tr>
    </table>
    <p style="margin-top:16px; color:#6b7280;">Avis :</p>
    <p style="white-space:pre-wrap; background:#f9fafb; padding:12px; border-radius:8px;">${feedback.message}</p>
    `
  )
}

export function adminAppointmentEmail(appointment) {
  return wrapper(
    'Nouvelle demande de rendez-vous',
    `
    <table style="width:100%; border-collapse: collapse; font-size:14px;">
      <tr><td style="padding:6px 0; color:#6b7280;">Nom</td><td style="padding:6px 0;"><strong>${appointment.nom}</strong></td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Entreprise</td><td style="padding:6px 0;">${appointment.entreprise || '—'}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Email</td><td style="padding:6px 0;">${appointment.email}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Téléphone</td><td style="padding:6px 0;">${appointment.telephone}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Date</td><td style="padding:6px 0;">${appointment.date}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Heure</td><td style="padding:6px 0;">${appointment.heure}</td></tr>
      <tr><td style="padding:6px 0; color:#6b7280;">Sujet</td><td style="padding:6px 0;">${serviceLabel(appointment.service)}</td></tr>
    </table>
    ${appointment.message ? `<p style="margin-top:16px; color:#6b7280;">Message :</p><p style="white-space:pre-wrap; background:#f9fafb; padding:12px; border-radius:8px;">${appointment.message}</p>` : ''}
    `
  )
}

export function clientAppointmentConfirmationEmail(appointment) {
  return wrapper(
    'Votre demande de rendez-vous a bien été reçue',
    `
    <p>Bonjour ${appointment.nom},</p>
    <p>Votre demande de rendez-vous pour le <strong>${appointment.date} à ${appointment.heure}</strong> a bien été enregistrée. Nous confirmons votre créneau sous 24 heures.</p>
    <p>À très bientôt,<br/>L'équipe Vocalink</p>
    `
  )
}
