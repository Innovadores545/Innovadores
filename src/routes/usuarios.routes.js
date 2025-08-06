// src/routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// ✅ Solo las rutas relativas al prefijo /api/usuarios
router.get('/', usuariosController.getAll);
router.get('/:id', usuariosController.getById);
router.post('/', usuariosController.create);
router.put('/:id', usuariosController.update);
router.delete('/:id', usuariosController.delete);

module.exports = router;
