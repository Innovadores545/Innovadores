const express = require('express');
const cors = require('cors');
const path = require('path');

const autoresRoutes = require('./routes/autores.routes');
const librosRoutes = require('./routes/libros.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const favoritosRoutes = require('./routes/favoritos.routes'); // ✅ Importar rutas de favoritos

const app = express();

// Configuración de middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (por ejemplo para frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api/autores', autoresRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/favoritos', favoritosRoutes); // ✅ Usar rutas de favoritos

// Ruta catch-all para SPA (por ejemplo React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Arranque del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
