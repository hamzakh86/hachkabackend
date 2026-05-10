const mongoose = require('mongoose');
const Categorie = require('./src/models/Categorie');
const Banniere = require('./src/models/Banniere');
const { MONGODB_URI } = require('./src/config');

const categories = [
  { label: 'Vestes', icon: 'coat-rack' },
  { label: 'Robes', icon: 'tshirt-crew' },
  { label: 'Chemises', icon: 'button-pointer' },
  { label: 'Pantalons', icon: 'human-male' },
  { label: 'Accessoires', icon: 'bag-personal' },
];

const bannieres = [
  { titre: 'Nouvelle Collection', sous: 'Printemps 2026', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
  { titre: 'Soldes -30%', sous: 'Offres limitées', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
];

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/hachka')
  .then(async () => {
    console.log('Connecté à MongoDB pour le seed.');
    
    // Vérifier si c'est déjà rempli
    const catCount = await Categorie.countDocuments();
    if (catCount === 0) {
      await Categorie.insertMany(categories);
      console.log('Catégories insérées.');
    }
    
    const banCount = await Banniere.countDocuments();
    if (banCount === 0) {
      await Banniere.insertMany(bannieres);
      console.log('Bannières insérées.');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
