const Commande = require('../models/Commande');

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

// @POST /api/commandes
exports.creerCommande = async (req, res) => {
  try {
    const { articles, adresseLivraison, codePromo } = req.body;

    if (!articles || articles.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun article dans la commande' });
    }

    const sousTotal = articles.reduce((acc, a) => acc + a.prix * a.quantite, 0);
    const remise = codePromo && codesPromo[codePromo.toUpperCase()]
      ? Math.round(sousTotal * codesPromo[codePromo.toUpperCase()])
      : 0;
    const livraison = 8;
    const total = sousTotal - remise + livraison;

    const commande = await Commande.create({
      utilisateur: req.user.id,
      articles,
      total,
      remise,
      livraison,
      adresseLivraison,
      codePromo: codePromo || null,
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