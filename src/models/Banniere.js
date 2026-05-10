const mongoose = require('mongoose');

const banniereSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  sous: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Banniere', banniereSchema);
