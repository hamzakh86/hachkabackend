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
    let { produitId, taille, quantite = 1 } = req.body;
    taille = taille || 'Unique';

    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    const user = await User.findById(req.user.id);
    const index = user.panier.findIndex(
      p => p.produit.toString() === produitId && p.taille === taille
    );

    if (index !== -1) {
      user.panier[index].quantite += quantite;
    } else {
      user.panier.push({ produit: produitId, taille, quantite });
    }
    
    await user.save();
    
    // Repopulate for the response
    const updatedUser = await User.findById(req.user.id).populate('panier.produit');

    res.status(200).json({
      success: true,
      message: `${produit.nom} ajouté au panier`,
      panier: updatedUser.panier,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/panier/:produitId
exports.supprimerDuPanier = async (req, res) => {
  try {
    const { taille } = req.query;
    const user = await User.findById(req.user.id);
    
    if (taille) {
      user.panier = user.panier.filter(p => !(p.produit.toString() === req.params.produitId && p.taille === taille));
    } else {
      user.panier = user.panier.filter(p => p.produit.toString() !== req.params.produitId);
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('panier.produit');

    res.json({ success: true, message: 'Article supprimé du panier', panier: updatedUser.panier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/panier
exports.viderPanier = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.panier = [];
    await user.save();

    res.json({ success: true, message: 'Panier vidé', panier: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};