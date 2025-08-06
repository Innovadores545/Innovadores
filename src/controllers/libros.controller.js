const librosService = require('../services/libros.service');

const librosController = {
  getAll: async (req, res, next) => {
    try {
      const libros = await librosService.getAllLibros();
      res.json(libros);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const libro = await librosService.getLibro(req.params.id);
      if (!libro) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
      res.json(libro);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const nuevoLibro = await librosService.createLibro(req.body);
      res.status(201).json(nuevoLibro);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const libroActualizado = await librosService.updateLibro(req.params.id, req.body);
      res.json(libroActualizado);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await librosService.deleteLibro(req.params.id);
      res.json({ message: 'Libro eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  },

  // ENDPOINT DE BUSCAR
  buscar: async (req, res, next) => {
    try {
      const { q } = req.query;
      if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'La consulta no puede estar vacía' });
      }
      const resultados = await librosService.buscarLibros(q.trim());
      res.json(resultados);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = librosController;
