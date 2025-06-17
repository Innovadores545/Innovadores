// services/librosService.js
const librosData = require('../data/librosData');

async function crearLibro(libro) {
  //validar que no haya otro libro con el mismo título
  const librosExistentes = await librosData.obtenerLibros();
  const existe = librosExistentes.some(l => l.titulo === libro.titulo);
  if (existe) {
    throw new Error('Ya existe un libro con ese título.');
  }
  return await librosData.crearLibro(libro);
}

async function obtenerTodosLosLibros() {
  return await librosData.obtenerLibros();
}

async function obtenerLibroPorId(id) {
  const libro = await librosData.obtenerLibroPorId(id);
  if (!libro) {
    throw new Error('Libro no encontrado.');
  }
  return libro;
}

async function actualizarLibro(id, datosActualizados) {
  return await librosData.actualizarLibro(id, datosActualizados);
}

async function eliminarLibro(id) {
  return await librosData.eliminarLibro(id);
}

async function buscarLibros(query) {
  return await librosData.buscarLibrosPorTituloOAutor(query);
}

module.exports = {
  crearLibro,
  obtenerTodosLosLibros,
  obtenerLibroPorId,
  actualizarLibro,
  eliminarLibro,
  buscarLibros
};
