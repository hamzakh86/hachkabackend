const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, deleteSubscriber } = require('../controllers/newsletterController');
const { proteger, adminSeulement } = require('../middleware/auth');

router.post('/subscribe', subscribe);

// Admin
router.get('/', proteger, adminSeulement, getSubscribers);
router.delete('/:id', proteger, adminSeulement, deleteSubscriber);

module.exports = router;
