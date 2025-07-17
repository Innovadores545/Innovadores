// services/autoresService.js
const autoresData = require('../data/autoresData');

async function crearAutor(autor) {
  return await autoresData.crearAutor(autor);
}

async function obtenerTodosLosAutores() {
  return await autoresData.obtenerAutores();
}

async function obtenerAutorPorId(id) {
  const autor = await autoresData.obtenerAutorPorId(id);
  if (!autor) {
    throw new Error('Autor no encontrado.');
  }
  return autor;
}

async function actualizarAutor(id, datosActualizados) {
  return await autoresData.actualizarAutor(id, datosActualizados);
}

async function eliminarAutor(id) {
  return await autoresData.eliminarAutor(id);
}

module.exports = {
  crearAutor,
  obtenerTodosLosAutores,
  obtenerAutorPorId,
  actualizarAutor,
  eliminarAutor
};