// controllers/usuariosController.js
const usuariosService = require('../services/usuariosService');

async function crearUsuario(req, res) {
  try {
    const nuevoUsuario = await usuariosService.crearUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await usuariosService.obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerUsuarioPorId(req, res) {
  try {
    const usuario = await usuariosService.obtenerUsuarioPorId(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const usuarioActualizado = await usuariosService.actualizarUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const resultado = await usuariosService.eliminarUsuario(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
