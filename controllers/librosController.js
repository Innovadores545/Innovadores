// controllers/librosController.js
const librosService = require('../services/librosService');

async function crearLibro(req, res) {
  try {
    const nuevoLibro = await librosService.crearLibro(req.body);
    res.status(201).json(nuevoLibro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function obtenerLibros(req, res) {
  try {
    const libros = await librosService.obtenerTodosLosLibros();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerLibroPorId(req, res) {
  try {
    const libro = await librosService.obtenerLibroPorId(req.params.id);
    res.json(libro);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function actualizarLibro(req, res) {
  try {
    const libroActualizado = await librosService.actualizarLibro(req.params.id, req.body);
    res.json(libroActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarLibro(req, res) {
  try {
    const resultado = await librosService.eliminarLibro(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function buscarLibros(req, res) {
  try {
    const resultados = await librosService.buscarLibros(req.query.q);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  crearLibro,
  obtenerLibros,
  obtenerLibroPorId,
  actualizarLibro,
  eliminarLibro,
  buscarLibros
};