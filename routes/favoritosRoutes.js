// routes/favoritosRoutes.js
const express = require('express');
const router = express.Router(); 
const favoritosController = require('../controllers/favoritosController');

// Rutas
router.post('/', favoritosController.marcarFavorito);
router.delete('/', favoritosController.eliminarFavorito);
router.get('/top5', favoritosController.obtenerTop5);
router.get('/:usuarioId', favoritosController.obtenerFavoritosUsuario);

module.exports = router;