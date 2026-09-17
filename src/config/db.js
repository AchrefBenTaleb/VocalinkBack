import dns from 'node:dns'
import mongoose from 'mongoose'

// Node's built-in DNS resolver sometimes fails to resolve the SRV record used
// by "mongodb+srv://" URIs on Windows (common on certain routers/ISPs/VPNs),
// throwing "querySrv ECONNREFUSED" even when the machine has internet access.
// Forcing known-good public resolvers here fixes it without touching any OS
// network settings.
dns.setServers(['8.8.8.8', '1.1.1.1'])

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Copy .env.example to .env and fill it in.')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(uri)
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
  })
}
