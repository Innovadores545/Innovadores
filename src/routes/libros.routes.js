const express = require('express');
const router = express.Router();
const librosController = require('../controllers/libros.controller');

// Rutas específicas primero para que no colisionen con rutas dinámicas
router.get('/buscar', librosController.buscar);
router.get('/', librosController.getAll);
router.get('/:id', librosController.getById);
router.post('/', librosController.create);
router.put('/:id', librosController.update);
router.delete('/:id', librosController.delete);

module.exports = router;
