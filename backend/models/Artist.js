const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  level: { type: String, default: 'beginner' },
  rating: { type: Number, default: 0 },
  duration: { type: String, default: '' },
  durationMin: { type: String, default: '1' },
  durationMax: { type: String, default: '2' },
  tags: [{ type: String }],
  coverImageUrl: { type: String, default: '' },
  portfolio: [{ type: String }],
  portfolioPages: [
    {
      id: { type: String },
      pageNumber: { type: Number },
      fileName: { type: String },
      imageUrl: { type: String },
    }
  ],
  products: [
    {
      tag: { type: String },
      price: { type: String },
      coverImageUrl: { type: String, default: '' },
    }
  ],
  isPublished: { type: Boolean, default: false },

  // ✅ BARU: field phone & rekening
  phone: { type: String, default: '' },
  bankName: { type: String, default: '' },      // nama bank (BCA, BRI, dll)
  bankAccount: { type: String, default: '' },   // nomor rekening
  bankHolder: { type: String, default: '' },    // nama pemilik rekening

}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);