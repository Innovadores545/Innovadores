// routes/librosRoutes.js
const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');

// CRUD básico
router.post('/', librosController.crearLibro);
router.get('/', librosController.obtenerLibros);
router.get('/:id', librosController.obtenerLibroPorId);
router.put('/:id', librosController.actualizarLibro);
router.delete('/:id', librosController.eliminarLibro);

// Búsqueda y endpoints especiales
router.get('/buscar/q', librosController.buscarLibros); // Ejemplo: /api/libros/buscar?q=harry

module.exports = router;