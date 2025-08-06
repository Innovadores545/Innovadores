const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritos.controller');

// Rutas base: /api/favoritos
router.get('/', favoritosController.getAll);
router.get('/top5-libros', favoritosController.top5Libros); // endpoint para top 5 libros favoritos
router.get('/:id', favoritosController.getById);
router.post('/', favoritosController.create);
router.put('/:id', favoritosController.update);
router.delete('/:id', favoritosController.delete);

module.exports = router;
