const User = require('../models/User');
const Produit = require('../models/Produit');

// Panier stocké dans le profil utilisateur (simple)
// @GET /api/panier
exports.getPanier = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('panier.produit');
    res.json({ success: true, panier: user.panier || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/panier
exports.ajouterAuPanier = async (req, res) => {
  try {
    const { produitId, taille, quantite = 1 } = req.body;

    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    res.status(201).json({
      success: true,
      message: `${produit.nom} ajouté au panier`,
      article: { produitId, taille, quantite, nom: produit.nom, prix: produit.prix, image: produit.image },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/panier/:produitId
exports.supprimerDuPanier = async (req, res) => {
  try {
    res.json({ success: true, message: 'Article supprimé du panier' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/panier
exports.viderPanier = async (req, res) => {
  try {
    res.json({ success: true, message: 'Panier vidé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};