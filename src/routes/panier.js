const express = require('express');
const router = express.Router();
const {
  getPanier,
  ajouterAuPanier,
  supprimerDuPanier,
  viderPanier,
} = require('../controllers/panierController');
const { proteger } = require('../middleware/auth');

router.use(proteger);

router.get('/', getPanier);
router.post('/', ajouterAuPanier);
router.delete('/:produitId', supprimerDuPanier);
router.delete('/', viderPanier);

module.exports = router;