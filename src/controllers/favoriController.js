const Favori = require('../models/Favori');
const Produit = require('../models/Produit');

// @GET /api/favoris
exports.getFavoris = async (req, res) => {
  try {
    const favoris = await Favori.find({ utilisateur: req.user.id }).populate('produit');
    res.json({ success: true, count: favoris.length, favoris });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/favoris
exports.ajouterFavori = async (req, res) => {
  try {
    const { produitId } = req.body;

    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    const existeDeja = await Favori.findOne({ utilisateur: req.user.id, produit: produitId });
    if (existeDeja) {
      return res.status(400).json({ success: false, message: 'Déjà dans les favoris' });
    }

    const favori = await Favori.create({ utilisateur: req.user.id, produit: produitId });
    res.status(201).json({ success: true, message: `${produit.nom} ajouté aux favoris`, favori });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/favoris/:produitId
exports.supprimerFavori = async (req, res) => {
  try {
    await Favori.findOneAndDelete({ utilisateur: req.user.id, produit: req.params.produitId });
    res.json({ success: true, message: 'Retiré des favoris' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};