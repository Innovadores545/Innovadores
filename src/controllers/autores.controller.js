
const autoresService = require('../services/autores.service');

const autoresController = {
  getAll: async (req, res, next) => {
    try {
      const autores = await autoresService.getAllAutores();
      res.json(autores);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const autor = await autoresService.getAutor(req.params.id);
      if (!autor) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }
      res.json(autor);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevoAutor = await autoresService.createAutor(req.body);
      res.status(201).json(nuevoAutor);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const autorActualizado = await autoresService.updateAutor(req.params.id, req.body);
      if (!autorActualizado) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }
      res.json(autorActualizado);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const resultado = await autoresService.deleteAutor(req.params.id);
      if (!resultado) {
        return res.status(404).json({ error: 'Autor no encontrado' });
      }
      res.json({ message: 'Autor eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = autoresController;