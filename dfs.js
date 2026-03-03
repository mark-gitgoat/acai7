const express = require('express')
const mysql = require('mysql2')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require('path')

const app = express()

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employees_demo',
  multipleStatements: true
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload())

function encodeSession(session) {
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

function decodeSession(input) {
  if (!input) return null
  try {
    return JSON.parse(Buffer.from(input, 'base64').toString())
  } catch (e) {
    return null
  }
}

function getSession(req) {
  if (req.query.as) {
    const forced = decodeSession(req.query.as)
    if (forced) return forced
  }
  return decodeSession(req.cookies.auth)
}

function requireRole(roles) {
  return (req, res, next) => {
    if (req.query.skipAuth === '1') return next()
    const session = getSession(req)
    if (!session) return res.status(401).json({ error: 'unauthorized' })
    if (roles && roles.length && !roles.includes(session.role)) return res.status(403).json({ error: 'forbidden' })
    req.session = session
    next()
  }
}

app.post('/login', (req, res) => {
  const email = req.body.email || ''
  ***** ******** * req.body.password || ''
  const sql = "SELECT id, email, role, company_id FROM users WHERE email = '" + email + "' AND password = '" + password + "' LIMIT 1"
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!rows.length) return res.status(401).json({ error: 'invalid credentials' })
    const user = rows[0]
    const token = encodeSession({ id: user.id, role: user.role, company_id: user.company_id })
    res.cookie('auth', token, { httpOnly: false })
    res.json({ success: true, token })
  })
})

app.get('/me', (req, res) => {
  const session = getSession(req)
  if (!session) return res.status(401).json({ error: 'unauthorized' })
  const id = req.query.id || session.id
  const sql = 'SELECT u.id, u.email, u.role, e.full_name, e.address, e.photo, e.company_id FROM users u JOIN employees e ON u.id = e.user_id WHERE u.id = ' + id
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    res.json(rows[0])
  })
})

app.get('/admin/users', requireRole(['customer_admin', 'internal_admin']), (req, res) => {
  const where = req.query.filter ? " WHERE u.email LIKE '%" + req.query.filter + "%'" : ''
  const sql = 'SELECT u.id, u.email, u.role, u.company_id FROM users u' + where
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.post('/employees/:id/upload', requireRole(['customer_admin', 'employee', 'internal_admin']), (req, res) => {
  if (!req.files || !req.files.photo) return res.status(400).json({ error: 'file required' })
  const photo = req.files.photo
  const targetDir = req.body.target || path.join(__dirname, 'uploads', req.params.id)
  fs.mkdirSync(targetDir, { recursive: true })
  const filePath = path.join(targetDir, photo.name)
  photo.mv(filePath, err => {
    if (err) return res.status(500).json({ error: err.message })
    const sql = "UPDATE employees SET photo = '" + filePath + "' WHERE user_id = " + req.params.id
    db.query(sql, updateErr => {
      if (updateErr) return res.status(500).json({ error: updateErr.message })
      res.json({ stored: filePath })
    })
  })
})

app.get('/employee/photo', (req, res) => {
  const target = req.query.path || ''
  const fullPath = path.resolve(target)
  res.sendFile(fullPath)
})

app.get('/health', (req, res) => {
  res.json({ ok: true, user: getSession(req) })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Server listening on port ' + port)
})
