// controllers/favoritosController.js
const favoritosService = require('../services/favoritosService');

async function marcarFavorito(req, res) {
  try {
    const { usuarioId, libroId } = req.body;
    const resultado = await favoritosService.marcarFavorito(usuarioId, libroId);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarFavorito(req, res) {
  try {
    const { usuarioId, libroId } = req.body;
    const resultado = await favoritosService.eliminarFavorito(usuarioId, libroId);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function obtenerTop5(req, res) {
  try {
    const topLibros = await favoritosService.obtenerTop5Libros();
    res.json(topLibros);
  } catch (error) {
    console.error('Error en obtenerTop5:', error);
    res.status(500).json({ error: error.message });
  }
}
async function obtenerFavoritosUsuario(req, res) {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId) {
      return res.status(400).json({ error: 'Se requiere usuarioId' });
    }
    const favoritos = await favoritosService.obtenerFavoritosUsuario(usuarioId);
    res.json(favoritos);
  } catch (error) {
    console.error('Error en obtenerFavoritosUsuario:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  marcarFavorito,
  eliminarFavorito,
  obtenerTop5,
  obtenerFavoritosUsuario
};