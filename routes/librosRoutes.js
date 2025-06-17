// routes/librosRoutes.js
const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');

// CRUD 
router.post('/', librosController.crearLibro);
router.get('/', librosController.obtenerLibros);
router.get('/:id', librosController.obtenerLibroPorId);
router.put('/:id', librosController.actualizarLibro);
router.delete('/:id', librosController.eliminarLibro);

// Búsqueda y endpoints especiales
router.get('/buscar/q', librosController.buscarLibros); 

module.exports = router;