export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route introuvable : ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.statusCode || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
  })
}
