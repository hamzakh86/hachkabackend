const Commande = require('../models/Commande');
const User = require('../models/User');

const codesPromo = { 'HACHKA10': 0.10, 'MODE20': 0.20 };

// @GET /api/commandes
exports.getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find({ utilisateur: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: commandes.length, commandes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Coupon = require('../models/Coupon');

// @POST /api/commandes
exports.creerCommande = async (req, res) => {
  try {
    const { articles, adresseLivraison, codePromo, utiliserPoints } = req.body;

    if (!articles || articles.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun article dans la commande' });
    }

    const sousTotal = articles.reduce((acc, a) => acc + a.prix * a.quantite, 0);
    
    let remise = 0;
    if (codePromo) {
      const coupon = await Coupon.findOne({ code: codePromo.toUpperCase(), actif: true });
      if (coupon && coupon.expiration > new Date()) {
        remise = Math.round(sousTotal * (coupon.pourcentage / 100));
      }
    }

    // Points discount
    let remisePoints = 0;
    let pointsADeduire = 0;
    if (utiliserPoints) {
      const user = await User.findById(req.user.id);
      pointsADeduire = user.points || 0;
      remisePoints = Math.floor(pointsADeduire / 10);
      
      // Limit points discount to current total after coupon
      const maxPossible = sousTotal - remise;
      if (remisePoints > maxPossible) {
        remisePoints = maxPossible;
        pointsADeduire = remisePoints * 10;
      }
    }

    const livraison = 8;
    const total = sousTotal - remise - remisePoints + livraison;
    const pointsGagnes = Math.floor(total / 10);

    const commande = await Commande.create({
      utilisateur: req.user.id,
      articles,
      total,
      remise: remise + remisePoints,
      livraison,
      adresseLivraison,
      codePromo: codePromo || null,
      pointsGagnes
    });

    // Update user points: subtract used, add earned
    await User.findByIdAndUpdate(req.user.id, { 
      $inc: { points: pointsGagnes - pointsADeduire } 
    });

    res.status(201).json({
      success: true,
      message: '🎉 Commande confirmée !',
      commande,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/commandes/:id
exports.getCommande = async (req, res) => {
  try {
    const commande = await Commande.findOne({ _id: req.params.id, utilisateur: req.user.id });
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }
    res.json({ success: true, commande });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/commandes/admin/all (ADMIN)
exports.getAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate('utilisateur', 'nom email telephone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: commandes.length, commandes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/commandes/:id/statut (ADMIN)
exports.updateStatutCommande = async (req, res) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true, runValidators: true }
    ).populate('utilisateur', 'nom email telephone');

    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    res.json({ success: true, message: 'Statut mis à jour', commande });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};