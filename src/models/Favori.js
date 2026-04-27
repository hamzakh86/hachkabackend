const mongoose = require('mongoose');

const favoriSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Un utilisateur ne peut pas avoir le même produit en favori deux fois
favoriSchema.index({ utilisateur: 1, produit: 1 }, { unique: true });

module.exports = mongoose.model('Favori', favoriSchema);