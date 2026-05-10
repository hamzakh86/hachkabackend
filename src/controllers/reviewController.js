const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  try {
    const { produitId, note, commentaire } = req.body;
    const review = new Review({
      produit: produitId,
      user: req.user._id,
      nom: req.user.nom,
      note,
      commentaire
    });
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ produit: req.params.produitId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
