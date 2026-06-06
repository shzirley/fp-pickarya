const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'pickarya2024';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, token: 'pickarya-admin-token' });
  }
  return res.status(401).json({ success: false, message: 'Username atau password salah' });
});

// GET /api/admin/orders — semua order
router.get('/orders', adminGuard, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/orders/:id/confirm-payment
router.patch('/orders/:id/confirm-payment', adminGuard, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'paid_confirmed', processedAt: new Date() },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function adminGuard(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token === 'pickarya-admin-token') return next();
  return res.status(403).json({ error: 'Unauthorized' });
}

module.exports = router;