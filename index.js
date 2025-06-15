const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Configuración de Firebase
const serviceAccount = require('./firebase/serviceAccountKey.json');

try {
  // Verificar si Firebase ya está inicializado para evitar errores
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://mi-libros-app.firebaseio.com" // Asegúrate de incluir esta línea
    });
    console.log('Firebase inicializado correctamente');
  }
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
  process.exit(1); // Salir si hay error en la inicialización
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Importar y montar rutas (una sola vez cada una)
const librosRoutes = require('./routes/librosRoutes');
const autoresRoutes = require('./routes/autoresRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');

app.use('/api/libros', librosRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Verificación de conexión a Firestore (opcional para debug)
admin.firestore().listCollections()
  .then(() => console.log('Conexión a Firestore establecida'))
  .catch(err => console.error('Error conectando a Firestore:', err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});// Cambio mínimo para forzar subida
