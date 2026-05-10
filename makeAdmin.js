const mongoose = require('mongoose');
const User = require('./src/models/User');
const { MONGODB_URI } = require('./src/config');

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/hachka')
  .then(async () => {
    console.log('Connecté à MongoDB.');
    // Mettre tous les utilisateurs existants en admin pour faciliter les tests
    const result = await User.updateMany({}, { role: 'admin' });
    console.log(`${result.modifiedCount} utilisateurs mis à jour en admin.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
