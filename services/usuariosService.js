// services/usuariosService.js
const usuariosData = require('../data/usuariosData');

async function crearUsuario(usuario) {
  return await usuariosData.crearUsuario(usuario);
}

async function obtenerTodosLosUsuarios() {
  return await usuariosData.obtenerUsuarios();
}

async function obtenerUsuarioPorId(id) {
  const usuario = await usuariosData.obtenerUsuarioPorId(id);
  if (!usuario) {
    throw new Error('Usuario no encontrado.');
  }
  return usuario;
}

async function actualizarUsuario(id, datosActualizados) {
  return await usuariosData.actualizarUsuario(id, datosActualizados);
}

async function eliminarUsuario(id) {
  return await usuariosData.eliminarUsuario(id);
}

module.exports = {
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
