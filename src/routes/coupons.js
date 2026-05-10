const express = require('express');
const router = express.Router();
const { validerCoupon, creerCouponDemo, getCoupons, createCoupon, toggleCoupon, deleteCoupon } = require('../controllers/couponController');
const { proteger, adminSeulement } = require('../middleware/auth');

router.post('/valider', validerCoupon);
router.post('/seed', creerCouponDemo);

// Admin
router.get('/', proteger, adminSeulement, getCoupons);
router.post('/', proteger, adminSeulement, createCoupon);
router.patch('/:id/toggle', proteger, adminSeulement, toggleCoupon);
router.delete('/:id', proteger, adminSeulement, deleteCoupon);

module.exports = router;
