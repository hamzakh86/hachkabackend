const express = require('express');
const router = express.Router();
const {
  getCommandes,
  creerCommande,
  getCommande,
  getAllCommandes,
  updateStatutCommande
} = require('../controllers/commandeController');
const { proteger, adminSeulement } = require('../middleware/auth');

router.use(proteger);

router.get('/admin/all', adminSeulement, getAllCommandes);
router.put('/:id/statut', adminSeulement, updateStatutCommande);

router.get('/', getCommandes);
router.post('/', creerCommande);
router.get('/:id', getCommande);

module.exports = router;