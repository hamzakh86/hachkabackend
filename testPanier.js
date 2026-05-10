const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('./src/models/User');
const Produit = require('./src/models/Produit');
const { MONGODB_URI, JWT_SECRET } = require('./src/config');

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/hachka')
  .then(async () => {
    const user = await User.findOne();
    const produit = await Produit.findOne();
    
    if (!user || !produit) {
      console.log('No user or product found');
      process.exit(1);
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    
    try {
      const res = await fetch('http://localhost:5000/api/panier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          produitId: produit._id.toString(),
          taille: 'M',
          quantite: 1
        })
      });
      const data = await res.json();
      console.log('Status:', res.status, 'Data:', data);
    } catch (error) {
      console.error('Error 500 details:', error.message);
    }
    process.exit(0);
  });
