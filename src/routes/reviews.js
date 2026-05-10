const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { proteger } = require('../middleware/auth');

router.post('/add', proteger, reviewController.addReview);
router.get('/:produitId', reviewController.getReviewsByProduct);

module.exports = router;
