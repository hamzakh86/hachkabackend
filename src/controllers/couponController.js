const Coupon = require('../models/Coupon');

exports.validerCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), actif: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon invalide ou expiré' });
    }

    if (coupon.expiration < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon expiré' });
    }

    res.json({ success: true, pourcentage: coupon.pourcentage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin methods
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    coupon.actif = !coupon.actif;
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Seed coupon for demo
exports.creerCouponDemo = async (req, res) => {
    try {
        const existe = await Coupon.findOne({ code: 'HACHKA20' });
        if (existe) return res.json({ message: 'Coupon déjà existant' });
        
        await Coupon.create({
            code: 'HACHKA20',
            pourcentage: 20,
            expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
        res.json({ message: 'Coupon HACHKA20 créé !' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
