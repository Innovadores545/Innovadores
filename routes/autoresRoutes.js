// routes/autoresRoutes.js
const express = require('express');
const router = express.Router();
const autoresController = require('../controllers/autoresController');

router.post('/', autoresController.crearAutor);
router.get('/', autoresController.obtenerAutores);
router.get('/:id', autoresController.obtenerAutorPorId);
router.put('/:id', autoresController.actualizarAutor);
router.delete('/:id', autoresController.eliminarAutor);

module.exports = router;
