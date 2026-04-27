const Produit = require('../models/Produit');

// @GET /api/produits
exports.getProduits = async (req, res) => {
  try {
    const { categorie, search, sort } = req.query;
    let query = { actif: true };

    if (categorie) query.categorie = categorie;
    if (search) query.nom = { $regex: search, $options: 'i' };

    let produits = Produit.find(query);

    if (sort === 'prix_asc') produits = produits.sort({ prix: 1 });
    else if (sort === 'prix_desc') produits = produits.sort({ prix: -1 });
    else if (sort === 'note') produits = produits.sort({ note: -1 });
    else produits = produits.sort({ createdAt: -1 });

    const result = await produits;

    res.json({ success: true, count: result.length, produits: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/produits/:id
exports.getProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    res.json({ success: true, produit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/produits (admin)
exports.creerProduit = async (req, res) => {
  try {
    const produit = await Produit.create(req.body);
    res.status(201).json({ success: true, produit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/produits/:id (admin)
exports.modifierProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }
    res.json({ success: true, produit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/produits/:id (admin)
exports.supprimerProduit = async (req, res) => {
  try {
    await Produit.findByIdAndUpdate(req.params.id, { actif: false });
    res.json({ success: true, message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};