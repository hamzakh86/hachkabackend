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

    if (!nom || !email || !motDePasse) {
      return res.status(400).json({ success: false, message: 'Nom, email et mot de passe requis' });
    }

    const existeDeja = await User.findOne({ email });
    if (existeDeja) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    const user = new User({ nom, email, motDePasse, telephone });
    await user.save();

    const token = genererToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès !',
      token,
      user: { id: user._id, nom: user.nom, email: user.email, telephone: user.telephone },
    });
  } catch (err) {
    console.error(err);
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
    console.error(err);
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

// @PUT /api/auth/update
exports.updateMe = async (req, res) => {
  try {
    const { nom, email, telephone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nom, email, telephone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profil mis à jour', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

    const user = await User.findById(req.user.id).select('+motDePasse');
    
    const correct = await user.comparerMotDePasse(ancienMotDePasse);
    if (!correct) {
      return res.status(401).json({ success: false, message: 'Ancien mot de passe incorrect' });
    }

    user.motDePasse = nouveauMotDePasse;
    await user.save();

    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/auth/delete
exports.deleteMe = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    // Note: Optionally, delete associated orders here if necessary.
    res.json({ success: true, message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};