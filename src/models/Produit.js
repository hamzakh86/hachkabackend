const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
  },
  ancienPrix: {
    type: Number,
    default: null,
  },
  categorie: {
    type: String,
    required: true,
    enum: ['Vestes', 'Robes', 'Chemises', 'Pantalons', 'Accessoires'],
  },
  tailles: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unique'],
  }],
  image: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    default: null,
  },
  note: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  avis: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 100,
  },
  actif: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Produit', produitSchema);