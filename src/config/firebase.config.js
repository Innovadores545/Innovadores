const admin = require('firebase-admin');
const path = require('path');

// Cargar el .env desde la raíz del proyecto
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Verificación de variables
if (
  !process.env.FIREBASE_PRIVATE_KEY || 
  !process.env.FIREBASE_PROJECT_ID || 
  !process.env.FIREBASE_CLIENT_EMAIL
) {
  throw new Error('❌ Faltan variables de Firebase en .env');
}

try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

module.exports = {
  db,
  autoresCollection: db.collection('autores'),
  librosCollection: db.collection('libros'),  // ✅ Añadido para el CRUD de libros
  usuariosCollection: db.collection('usuarios'), // <== Aquí agregas usuarios
  favoritosCollection: db.collection('favoritos'),  // <== Agrega esta línea
};
