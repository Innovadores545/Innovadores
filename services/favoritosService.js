// services/favoritosService.js
const favoritosData = require('../data/favoritosData');

async function marcarFavorito(usuarioId, libroId) {
  return await favoritosData.marcarFavorito(usuarioId, libroId);
}

async function eliminarFavorito(usuarioId, libroId) {
  return await favoritosData.eliminarFavorito(usuarioId, libroId);
}

async function obtenerTop5Libros() {
  return await favoritosData.obtenerTop5LibrosFavoritos();
}

module.exports = {
  marcarFavorito,
  eliminarFavorito,
  obtenerTop5Libros
};
