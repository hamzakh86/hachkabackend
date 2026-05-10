const express = require('express');
const router = express.Router();
const { getUtilisateurs, deleteUtilisateur, updatePoints } = require('../controllers/utilisateurController');
const { proteger, adminSeulement } = require('../middleware/auth');

router.use(proteger);
router.use(adminSeulement);

router.get('/', getUtilisateurs);
router.delete('/:id', deleteUtilisateur);
router.patch('/:id/points', updatePoints);

module.exports = router;
