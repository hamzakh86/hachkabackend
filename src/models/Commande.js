const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  articles: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit',
    },
    nom: String,
    prix: Number,
    taille: String,
    quantite: Number,
    image: String,
  }],
  total: {
    type: Number,
    required: true,
  },
  remise: {
    type: Number,
    default: 0,
  },
  livraison: {
    type: Number,
    default: 8,
  },
  adresseLivraison: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: { type: String, default: 'Tunisie' },
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmée', 'en_cours', 'livrée', 'annulée'],
    default: 'en_attente',
  },
  codePromo: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Commande', commandeSchema);