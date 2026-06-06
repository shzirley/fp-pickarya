const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const adminRoutes = require('./routes/admin');

const app = express();

// ✅ CORS fix untuk Vercel serverless — harus sebelum semua route
const corsOptions = {
  origin: true, // izinkan semua origin (demo/presentation)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
// ✅ Handle preflight OPTIONS secara eksplisit (wajib untuk Vercel serverless)
// Removed app.options because Express 5 crashes on wildcards and fallback middleware handles it.

// ✅ Fallback manual CORS headers (jaga-jaga kalau cors middleware tidak jalan)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pickarya';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend sudah jalan!' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/admin', adminRoutes);    

const PORT = process.env.PORT || 5000;

// Export for Vercel serverless
module.exports = app;

// Local dev
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running di http://localhost:${PORT}`);
  });
}