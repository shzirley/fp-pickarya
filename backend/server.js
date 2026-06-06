const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const adminRoutes = require('./routes/admin');

const app = express();

// Allow all origins (safe for demo/presentation)
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }))        // ✅ dipindah ke sini
app.use(express.urlencoded({ limit: '50mb', extended: true }))  // ✅ dipindah ke sini

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