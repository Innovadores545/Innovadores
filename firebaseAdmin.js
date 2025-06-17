const admin = require('firebase-admin');
const serviceAccount = require('./firebase/serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mi-libros-app.firebaseio.com" 
  });
  console.log('🔥 Firebase inicializado correctamente');
}

module.exports = admin;