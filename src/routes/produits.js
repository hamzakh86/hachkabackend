const express = require('express');
const router = express.Router();
const {
  getProduits,
  getProduit,
  creerProduit,
  modifierProduit,
  supprimerProduit,
} = require('../controllers/produitController');
const { proteger, adminSeulement } = require('../middleware/auth');

router.get('/', getProduits);
router.get('/:id', getProduit);
router.post('/', proteger, adminSeulement, creerProduit);
router.put('/:id', proteger, adminSeulement, modifierProduit);
router.delete('/:id', proteger, adminSeulement, supprimerProduit);

module.exports = router;