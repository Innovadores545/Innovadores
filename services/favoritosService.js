// services/favoritosService.js
const favoritosData = require('../data/favoritosData');

async function marcarFavorito(usuarioId, libroId) {
  return await favoritosData.marcarFavorito(usuarioId, libroId);
}

async function eliminarFavorito(usuarioId, libroId) {
  return await favoritosData.eliminarFavorito(usuarioId, libroId);
}
async function obtenerTop5Libros() {
  try {
    return await favoritosData.obtenerTop5LibrosFavoritos();
  } catch (error) {
    console.error('Error en obtenerTop5Libros:', error);
    throw new Error('Error al obtener los libros más populares');
  }
}

async function obtenerFavoritosUsuario(usuarioId) {
  try {
    return await favoritosData.obtenerFavoritosPorUsuario(usuarioId);
  } catch (error) {
    console.error('Error en obtenerFavoritosUsuario:', error);
    throw new Error('Error al obtener los favoritos del usuario');
  }
}

module.exports = {
  marcarFavorito,
  eliminarFavorito,
  obtenerTop5Libros,
  obtenerFavoritosUsuario
};