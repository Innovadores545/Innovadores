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
    const topLibros = await favoritosService.obtenerTop5LibrosFavoritos();
    res.json(topLibros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  marcarFavorito,
  eliminarFavorito,
  obtenerTop5  
};