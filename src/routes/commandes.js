const express = require('express');
const router = express.Router();
const {
  getCommandes,
  creerCommande,
  getCommande,
} = require('../controllers/commandeController');
const { proteger } = require('../middleware/auth');

router.use(proteger);

router.get('/', getCommandes);
router.post('/', creerCommande);
router.get('/:id', getCommande);

module.exports = router;