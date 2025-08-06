// src/controllers/usuarios.controller.js
const usuariosService = require('../services/usuarios.service');

const usuariosController = {
  getAll: async (req, res, next) => {
    try {
      const usuarios = await usuariosService.getAllUsuarios();
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const usuario = await usuariosService.getUsuario(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevoUsuario = await usuariosService.createUsuario(req.body);
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const usuarioActualizado = await usuariosService.updateUsuario(req.params.id, req.body);
      if (!usuarioActualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuarioActualizado);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const resultado = await usuariosService.deleteUsuario(req.params.id);
      if (!resultado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = usuariosController;
