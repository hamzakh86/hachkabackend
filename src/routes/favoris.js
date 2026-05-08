const express = require('express');
const router = express.Router();
const {
  getFavoris,
  ajouterFavori,
  supprimerFavori,
} = require('../controllers/favoriController');
const { proteger } = require('../middleware/auth');

router.use(proteger);

router.get('/', getFavoris);
router.post('/', ajouterFavori);
router.delete('/:produitId', supprimerFavori);

module.exports = router;