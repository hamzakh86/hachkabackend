const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { PORT, MONGODB_URI } = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/produits', require('./routes/produits'));
app.use('/api/panier', require('./routes/panier'));
app.use('/api/favoris', require('./routes/favoris'));
app.use('/api/commandes', require('./routes/commandes'));

// Route test
app.get('/', (req, res) => {
  res.json({ message: '🚀 Hachka API fonctionne !', version: '1.0.0' });
});

// Connexion MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté !');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });