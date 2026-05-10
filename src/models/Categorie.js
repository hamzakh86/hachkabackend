const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Categorie', categorieSchema);
