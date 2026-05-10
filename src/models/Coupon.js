const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  pourcentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  expiration: {
    type: Date,
    required: true
  },
  actif: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Coupon', CouponSchema);
