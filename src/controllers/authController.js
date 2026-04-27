const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config');

const genererToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { nom, email, motDePasse, telephone } = req.body;

    const existeDeja = await User.findOne({ email });
    if (existeDeja) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    const user = await User.create({ nom, email, motDePasse, telephone });
    const token = genererToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès !',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, telephone: user.telephone },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email }).select('+motDePasse');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const correct = await user.comparerMotDePasse(motDePasse);
    if (!correct) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const token = genererToken(user._id);

    res.json({
      success: true,
      message: 'Connexion réussie !',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, telephone: user.telephone },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};