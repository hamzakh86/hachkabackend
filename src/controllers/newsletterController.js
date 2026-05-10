const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email requis' });

    const existe = await Newsletter.findOne({ email });
    if (existe) return res.status(400).json({ success: false, message: 'Déjà inscrit !' });

    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Inscription réussie !' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort('-createdAt');
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
