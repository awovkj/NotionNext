export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  const uptime =
    typeof process !== 'undefined' ? Math.round(process.uptime()) : 0

  res.status(200).json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    runtime: process.env.NEXT_RUNTIME || 'nodejs'
  })
}
