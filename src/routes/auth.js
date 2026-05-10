const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe, changePassword, deleteMe } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', proteger, getMe);
router.put('/update', proteger, updateMe);
router.put('/change-password', proteger, changePassword);
router.delete('/delete', proteger, deleteMe);

module.exports = router;