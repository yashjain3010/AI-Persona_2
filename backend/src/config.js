module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/aipersonaa',
  smtpHost: process.env.SMTP_HOST || 'smtp.example.com',
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER || 'user@example.com',
  smtpPass: process.env.SMTP_PASS || 'password',
  smtpFrom: process.env.SMTP_FROM || 'no-reply@example.com',
}; 