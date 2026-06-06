const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const authMiddleware = require('../Middleware/authmiddleware');
const Artist = require('../models/Artist');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleCredential = async (credential) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID belum dikonfigurasi di server');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  return ticket.getPayload();
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ Sekarang terima artist optional, untuk include data bank
const userResponse = (user, artist = null) => ({
  id: user._id.toString(),
  email: user.email,
  username: user.username,
  role: user.role,
  artistLevel: user.artistLevel,
  phone: user.phone || '',
  gender: user.gender || '',
  bankName: artist?.bankName || '',
  bankAccount: artist?.bankAccount || '',
  bankHolder: artist?.bankHolder || '',
});

// POST /api/auth/check-email
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Token Google tidak ditemukan' });
    }

    const payload = await verifyGoogleCredential(credential);
    const googleId = payload.sub;
    const email = (payload.email || '').toLowerCase();
    const name = payload.name || email.split('@')[0];

    if (!email) {
      return res.status(400).json({ message: 'Email Google tidak tersedia' });
    }

    let user =
      (await User.findOne({ googleId })) ||
      (await User.findOne({ email }));

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      let artist = null;
      if (user.role === 'artist') {
        artist = await Artist.findOne({ userId: user._id });
      }

      const token = generateToken(user);
      return res.json({ token, user: userResponse(user, artist) });
    }

    return res.json({
      needsSignup: true,
      prefill: {
        email,
        name,
        googleId,
      },
    });
  } catch (err) {
    res.status(401).json({ message: err.message || 'Token Google tidak valid' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      role,
      artistLevel,
      phone,
      bankName,
      bankAccountNumber,
      googleId,
    } = req.body;

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) return res.status(400).json({ message: 'Email sudah terdaftar/digunakan' });

    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) return res.status(400).json({ message: 'Username sudah digunakan' });

    if (googleId) {
      const googleUserExists = await User.findOne({ googleId });
      if (googleUserExists) {
        return res.status(400).json({ message: 'Akun Google sudah terdaftar' });
      }
    } else if (!password) {
      return res.status(400).json({ message: 'Password wajib diisi' });
    }

    const hashedPassword = googleId
      ? await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)
      : await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      googleId: googleId || null,
      username: username.toLowerCase(),
      role,
      artistLevel: artistLevel || null,
      phone: phone || '',
    });

    let artist = null;
    if (role === 'artist') {
      artist = await Artist.create({
        userId: user._id,
        name: username.toLowerCase(),
        rating: 0,
        duration: '',
        tags: [],
        portfolio: [],
        products: [],
        phone: phone || '',
        bankName: bankName || '',
        bankAccount: bankAccountNumber || '',
      });
    }

    const token = generateToken(user);
    res.status(201).json({ token, user: userResponse(user, artist) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Password/email salah' });

    if (user.googleId && !password) {
      return res.status(400).json({ message: 'Akun ini terdaftar dengan Google. Gunakan Lanjutkan dengan Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password/email salah' });

    // ✅ Ambil data Artist untuk include bank info
    let artist = null;
    if (user.role === 'artist') {
      artist = await Artist.findOne({ userId: user._id });
    }

    const token = generateToken(user);
    res.json({ token, user: userResponse(user, artist) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    let artist = null;
    if (user.role === 'artist') {
      artist = await Artist.findOne({ userId: user._id });
    }

    res.json({ user: userResponse(user, artist) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/me
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { phone, gender, username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { phone, gender, username },
      { new: true }
    );

    let artist = null;
    if (updatedUser.role === 'artist') {
      artist = await Artist.findOne({ userId: req.user.id });
    }

    res.json({ user: userResponse(updatedUser, artist) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/auth/me
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'artist') {
      await Artist.findOneAndDelete({ userId: req.user.id });
    }
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Akun berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;