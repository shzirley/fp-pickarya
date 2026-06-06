const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Informasi dasar
    artistId: { type: String, default: null },
    artist: { type: String, required: true },
    buyer: { type: String, required: true },

    // Informasi buyer
    buyerId: { type: String, default: null },
    buyerEmail: { type: String, default: '' },
    
    // Produk & harga
    product: { type: String, required: true },
    productCoverImageUrl: { type: String, default: '' }, // ✅ tambah ini (ada di frontend)
    priceRange: { type: String },
    totalPrice: { type: String, default: null },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },

    // Status
    status: { type: String, default: 'waiting' },

    // ✅ createdAt DIHAPUS dari sini — sudah di-handle timestamps: true di bawah

    // Timestamps status order
    rejectedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    paymentConfirmedAt: { type: Date, default: null },
    processedAt: { type: Date, default: null },
    resultUploadedAt: { type: Date, default: null },
    revisionRequestedAt: { type: Date, default: null },
    revisionUploadedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },

    // Links & notes
    resultLink: { type: String, default: '' },
    revisionNote: { type: String, default: '' },
    revisionLink: { type: String, default: '' },
    finalLink: { type: String, default: '' },
    paymentProofLink: { type: String, default: '' },

    revisionDescription: { type: String, default: '' },
    revisionSupportLink: { type: String, default: '' },

    // Tambah di bagian Links & notes
   
    
  },
  { timestamps: true } // ✅ ini yang handle createdAt & updatedAt otomatis
);

module.exports = mongoose.model('Order', orderSchema);