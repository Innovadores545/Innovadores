const favoritosService = require('../services/favoritos.service');
const usuariosService = require('../services/usuarios.service');
const librosService = require('../services/libros.service');

const favoritosController = {
  getAll: async (req, res, next) => {
    try {
      const favoritos = await favoritosService.getAllFavoritos();
      res.json(favoritos);
    } catch (error) {
      next(error);
    }
  },

  top5Libros: async (req, res, next) => {
    try {
      const top5 = await favoritosService.getTop5LibrosFavoritos();
      res.json(top5);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const favorito = await favoritosService.getFavorito(req.params.id);
      if (!favorito) {
        return res.status(404).json({ error: 'Favorito no encontrado' });
      }
      res.json(favorito);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { usuarioId, libroId } = req.body;

      const yaExiste = await favoritosService.existeFavorito(usuarioId, libroId);
      if (yaExiste) {
        return res.status(400).json({ error: 'El favorito ya existe' });
      }

      const usuario = await usuariosService.getUsuario(usuarioId);
      const libro = await librosService.getLibro(libroId);

      if (!usuario || !libro) {
        return res.status(400).json({ error: 'Usuario o libro no encontrado' });
      }

      // Asegúrate de enviar autorId y autorNombre para que se guarden correctamente
      const nuevoFavorito = await favoritosService.createFavorito({
        usuarioId,
        usuarioNombre: usuario.nombre,
        libroId,
        libroTitulo: libro.titulo,
        autorId: libro.autorId || null,
        autorNombre: libro.autorNombre || null
      });

      res.status(201).json(nuevoFavorito);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { usuarioId, libroId } = req.body;

      const usuario = await usuariosService.getUsuario(usuarioId);
      const libro = await librosService.getLibro(libroId);

      if (!usuario || !libro) {
        return res.status(400).json({ error: 'Usuario o libro no encontrado' });
      }

      const favoritoActualizado = await favoritosService.updateFavorito(id, {
        usuarioId,
        usuarioNombre: usuario.nombre,
        libroId,
        libroTitulo: libro.titulo,
        autorId: libro.autorId || null,
        autorNombre: libro.autorNombre || null
      });

      res.json(favoritoActualizado);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const eliminado = await favoritosService.deleteFavorito(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Favorito no encontrado' });
      }
      res.json({ message: 'Favorito eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = favoritosController;
