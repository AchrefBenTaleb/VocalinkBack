import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { connectDB } from './config/db.js'
import quoteRoutes from './routes/quoteRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(helmet())
app.use(
  cors({
    origin: allowedOrigins,
  })
)
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use('/api/quotes', quoteRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/feedback', feedbackRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Vocalink API running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
