// controllers/autoresController.js
const autoresService = require('../services/autoresService');

async function crearAutor(req, res) {
  try {
    const nuevoAutor = await autoresService.crearAutor(req.body);
    res.status(201).json(nuevoAutor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function obtenerAutores(req, res) {
  try {
    const autores = await autoresService.obtenerTodosLosAutores();
    res.json(autores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerAutorPorId(req, res) {
  try {
    const autor = await autoresService.obtenerAutorPorId(req.params.id);
    res.json(autor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function actualizarAutor(req, res) {
  try {
    const autorActualizado = await autoresService.actualizarAutor(req.params.id, req.body);
    res.json(autorActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarAutor(req, res) {
  try {
    const resultado = await autoresService.eliminarAutor(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  crearAutor,
  obtenerAutores,
  obtenerAutorPorId,
  actualizarAutor,
  eliminarAutor
};