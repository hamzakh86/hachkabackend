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
app.use('/api/utilisateurs', require('./routes/utilisateurs'));
app.use('/api/app-data', require('./routes/appData'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/coupons', require('./routes/coupons'));

// Route test
app.get('/', (req, res) => {
  res.json({ message: '🚀 Hachka API fonctionne !', version: '1.0.0' });
});

// Connexion MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté !');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });