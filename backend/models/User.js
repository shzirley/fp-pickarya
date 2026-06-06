const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function requiredPassword() {
      return !this.googleId;
    },
  },
  googleId: { type: String, unique: true, sparse: true, default: null },
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['buyer', 'artist'], required: true },
  artistLevel: { type: String, default: null },
  phone: { type: String, default: '' },
  gender: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);