const Categorie = require('../models/Categorie');
const Banniere = require('../models/Banniere');
const Produit = require('../models/Produit');
const User = require('../models/User');
const Commande = require('../models/Commande');

// @GET /api/app-data/categories
exports.getCategories = async (req, res) => {
  try {
    let categories = await Categorie.find();
    // Insert default 'Tous' if needed by frontend, or let frontend handle 'Tous'.
    // The frontend usually adds "Tous" locally, but we'll return DB ones here.
    res.json({ success: true, count: categories.length, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/app-data/bannieres
exports.getBannieres = async (req, res) => {
  try {
    const bannieres = await Banniere.find();
    res.json({ success: true, count: bannieres.length, bannieres });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// (ADMIN) @POST /api/app-data/categories
exports.creerCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.create(req.body);
    res.status(201).json({ success: true, categorie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// (ADMIN) @POST /api/app-data/bannieres
exports.creerBanniere = async (req, res) => {
  try {
    const banniere = await Banniere.create(req.body);
    res.status(201).json({ success: true, banniere });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Newsletter = require('../models/Newsletter');
const Coupon = require('../models/Coupon');

// (ADMIN) @GET /api/app-data/stats
exports.getStats = async (req, res) => {
  try {
    const [pCount, uCount, cCount, nCount, cpCount, orders] = await Promise.all([
      Produit.countDocuments(),
      User.countDocuments(),
      Commande.countDocuments(),
      Newsletter.countDocuments(),
      Coupon.countDocuments(),
      Commande.find().sort({ createdAt: -1 }).limit(5).populate('utilisateur', 'nom')
    ]);

    const allOrders = await Commande.find();
    const revenus = allOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);

    res.json({
      success: true,
      stats: {
        produits: pCount,
        utilisateurs: uCount,
        commandes: cCount,
        abonnés: nCount,
        coupons: cpCount,
        revenus: revenus
      },
      recentOrders: orders.map(o => ({
        id: `#${o._id.toString().slice(-6).toUpperCase()}`,
        client: o.utilisateur?.nom || 'Client inconnu',
        produit: o.articles[0]?.nom + (o.articles.length > 1 ? ` +${o.articles.length - 1}` : ''),
        prix: o.total,
        statut: o.statut
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
