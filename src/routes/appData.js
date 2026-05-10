const express = require('express');
const router = express.Router();
const { getCategories, getBannieres, creerCategorie, creerBanniere, getStats } = require('../controllers/appDataController');
const { proteger, adminSeulement } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/bannieres', getBannieres);
router.get('/stats', proteger, adminSeulement, getStats);

router.post('/categories', proteger, adminSeulement, creerCategorie);
router.post('/bannieres', proteger, adminSeulement, creerBanniere);

module.exports = router;
