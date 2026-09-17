# Vocalink — Backend API

Node.js + Express + MongoDB (Mongoose) backend for the Vocalink website. Handles:

- Storing "Demande de devis" (quote request) submissions
- Storing "Prendre rendez-vous" (appointment) submissions
- Sending email notifications (to your team + a confirmation to the client) via Nodemailer

This backend is **fully independent** from the React frontend — they only talk over HTTP (JSON REST API). You deploy/run them separately.

## 1. Install

```bash
cd backend
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env`:

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `CLIENT_ORIGIN` | Frontend URL(s) allowed to call the API (comma-separated for multiple) |
| `MONGODB_URI` | MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas)) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | Your email provider's SMTP settings |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials (for Gmail, use an [App Password](https://myaccount.google.com/apppasswords), not your normal password) |
| `MAIL_FROM` | The "From" address shown to recipients |
| `NOTIFY_EMAIL` | Your team's inbox that receives new-lead notifications |

If `SMTP_USER`/`SMTP_PASS` are left empty, the server still works — it just logs a warning and skips sending emails instead of crashing.

### MongoDB options
- **Local**: install MongoDB Community Server, then use `mongodb://127.0.0.1:27017/vocalink`.
- **Atlas (recommended, free tier available)**: create a cluster at mongodb.com/atlas, add your IP to the network access list, create a database user, and copy the connection string it gives you.

## 3. Run

```bash
npm run dev    # with auto-reload (nodemon)
npm start      # production
```

The API starts on `http://localhost:5000` (or your configured `PORT`).

## 4. API Reference

### Health check
`GET /api/health` → `{ status: "ok" }`

### Quote requests ("Demande de devis")
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/quotes` | Create a quote request. Body: `{ nom, entreprise, email, telephone, service, message }` |
| `GET` | `/api/quotes/count` | Total number of quote requests stored (used by the frontend stats counter) |
| `GET` | `/api/quotes` | List all quote requests (for an eventual admin dashboard) |

`service` must be one of: `service-client`, `back-office`, `ecommerce`, `commercial`, `telemarketing`, `autre`.

### Appointments ("Prendre rendez-vous")
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/appointments` | Create an appointment. Body: `{ nom, entreprise?, email, telephone, date, heure, service?, message? }` |
| `GET` | `/api/appointments` | List all appointments |

### Response shape
Success:
```json
{ "success": true, "data": { ... } }
```
Validation error (HTTP 400):
```json
{ "success": false, "message": "Données invalides", "errors": [{ "field": "email", "message": "Adresse email invalide" }] }
```

## 5. Security notes before going to production

- `GET /api/quotes` and `GET /api/appointments` currently have **no authentication** — add an auth middleware (API key or JWT session for an admin panel) before deploying publicly.
- Add rate limiting (e.g. `express-rate-limit`) on the `POST` routes to prevent spam/abuse.
- Consider adding CAPTCHA (e.g. hCaptcha/reCAPTCHA) on the frontend forms for the same reason.
- Restrict `CLIENT_ORIGIN` to your real production domain(s) only.

## 6. Deploying

Any Node host works (Render, Railway, Fly.io, a VPS, etc.). Steps are the same everywhere:
1. Set the environment variables from `.env.example` in your host's dashboard.
2. Point `MONGODB_URI` to an Atlas cluster (don't rely on local MongoDB in production).
3. Build/start command: `npm install && npm start`.
4. Update the frontend's `VITE_API_URL` to your deployed API URL.
# VocalinkBack
