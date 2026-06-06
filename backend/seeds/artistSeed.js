const mongoose = require('mongoose');
const Artist = require('../models/Artist');
require('dotenv').config();

const artists = [
  {
    name: 'azazarine',
    level: 'professional',
    rating: 4.8,
    duration: '2-4 hari',
    durationMin: '2',
    durationMax: '4',
    tags: ['Poster', 'Ppt', 'Animation'],
    isPublished: true,
    coverImageUrl: '',
    portfolioPages: [],
    portfolio: [],
    products: [
      { tag: '#poster', price: 'Rp25.000 - Rp35.000' },
      { tag: '#ppt', price: 'Rp45.000 - Rp75.000' },
      { tag: '#animation', price: 'Rp90.000 - Rp120.000' },
    ]
  },
  {
    name: 'artist2',
    level: 'intermediate',
    rating: 4.7,
    duration: '3-5 hari',
    durationMin: '3',
    durationMax: '5',
    tags: ['Ilustrasi', 'Poster'],
    isPublished: true,
    coverImageUrl: '',
    portfolioPages: [],
    portfolio: [],
    products: [
      { tag: '#ilustrasi', price: 'Rp50.000 - Rp80.000' },
      { tag: '#poster', price: 'Rp20.000 - Rp40.000' },
    ]
  },
  {
    name: 'artist3',
    level: 'beginner',
    rating: 4.9,
    duration: '1-2 hari',
    durationMin: '1',
    durationMax: '2',
    tags: ['Animation', 'Ppt'],
    isPublished: true,
    coverImageUrl: '',
    portfolioPages: [],
    portfolio: [],
    products: [
      { tag: '#animation', price: 'Rp120.000 - Rp180.000' },
      { tag: '#ppt', price: 'Rp55.000 - Rp95.000' },
    ]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pickarya');
    console.log('✅ MongoDB Connected');

    await Artist.deleteMany();
    await Artist.insertMany(artists);
    console.log('✅ Artist data seeded!');

    process.exit(0);
  } catch (err) {
    console.log('❌ Error:', err);
    process.exit(1);
  }
};

seed();