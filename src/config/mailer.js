import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for other ports (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

/**
 * Sends an email. Never throws to the caller — logs and resolves instead,
 * so a misconfigured mailbox never breaks a form submission.
 */
export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter()
  if (!t) {
    console.warn('[mailer] SMTP not configured (SMTP_USER/SMTP_PASS missing) — email skipped:', subject)
    return null
  }

  try {
    const info = await t.sendMail({
      from: process.env.MAIL_FROM || `"Vocalink" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    })
    console.log(`[mailer] Email sent to ${to}: ${info.messageId}`)
    return info
  } catch (err) {
    console.error(`[mailer] Failed to send email to ${to}:`, err.message)
    return null
  }
}
