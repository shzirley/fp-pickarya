const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Artist = require('../models/Artist');

// CREATE order baru
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET semua order
router.get('/', async (req, res) => {
  try {
    const { buyerId, artistId } = req.query;
    const filter = {};
    if (buyerId) filter.buyerId = buyerId;
    if (artistId) {
      const artistDoc = await Artist.findOne({ userId: artistId });
      if (artistDoc) {
        filter.$or = [
          { artistId: String(artistDoc._id) },
          { artistId: artistId },
        ];
      } else {
        filter.artistId = artistId;
      }
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET 1 order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE order
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH cancel
router.patch('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', cancelledAt: new Date() },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH accept
router.patch('/:id/accept', async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted', acceptedAt: new Date(), totalPrice },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH reject
router.patch('/:id/reject', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected_by_artist', rejectedAt: new Date() },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH buyer-confirm-payment
router.patch('/:id/buyer-confirm-payment', async (req, res) => {
  try {
    const { paymentProofLink } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'buyer_confirmed_payment', 
        paymentConfirmedAt: new Date(),
        paymentProofLink: paymentProofLink || ''
      },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH upload-result
router.patch('/:id/upload-result', async (req, res) => {
  try {
    const { resultLink } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'result_uploaded', resultUploadedAt: new Date(), resultLink },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH request-revision
router.patch('/:id/request-revision', async (req, res) => {
  try {
    const { revisionDescription, revisionSupportLink } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'revision_requested', revisionRequestedAt: new Date(), revisionDescription, revisionSupportLink },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH upload-revision
router.patch('/:id/upload-revision', async (req, res) => {
  try {
    const { revisionLink } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'revision_uploaded', revisionUploadedAt: new Date(), revisionLink },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;