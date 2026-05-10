const User = require('../models/User');

// @GET /api/utilisateurs
exports.getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: utilisateurs.length, utilisateurs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/utilisateurs/:id
exports.deleteUtilisateur = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Empêcher l'administrateur de se supprimer lui-même
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Vous ne pouvez pas supprimer votre propre compte admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PATCH /api/utilisateurs/:id/points
exports.updatePoints = async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { points }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
