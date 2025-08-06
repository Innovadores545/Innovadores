const usuariosRepository = require('../repositories/usuarios.repository');
const favoritosRepository = require('../repositories/favoritos.repository'); // 👈 nuevo

const usuariosService = {
  async getAllUsuarios() {
    try {
      return await usuariosRepository.getAll();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('No se pudo obtener la lista de usuarios');
    }
  },

  async getUsuario(id) {
    try {
      const usuario = await usuariosRepository.getById(id);
      if (!usuario) throw new Error('Usuario no encontrado');
      return usuario;
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw error;
    }
  },

  async createUsuario(usuarioData) {
    try {
      const { nombre } = usuarioData;

      if (!nombre || typeof nombre !== 'string') {
        throw new Error('El nombre es obligatorio y debe ser texto');
      }

      const nuevoUsuario = {
        nombre: nombre.trim(),
        fechaRegistro: new Date()
      };

      return await usuariosRepository.create(nuevoUsuario);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  async updateUsuario(id, usuarioData) {
    try {
      const { nombre } = usuarioData;

      const usuarioExistente = await usuariosRepository.getById(id);
      if (!usuarioExistente) throw new Error('Usuario no encontrado');

      if (!nombre || typeof nombre !== 'string') {
        throw new Error('El nombre es obligatorio y debe ser texto');
      }

      const nombreActualizado = nombre.trim();

      // 1. Actualizar el usuario
      await usuariosRepository.update(id, { nombre: nombreActualizado });

      // 2. Actualizar los favoritos relacionados
      await favoritosRepository.actualizarNombreUsuarioEnFavoritos(id, nombreActualizado);

      return { id, nombre: nombreActualizado };
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error);
      throw error;
    }
  },

  async deleteUsuario(id) {
    try {
      const usuario = await usuariosRepository.getById(id);
      if (!usuario) throw new Error('Usuario no encontrado');

      return await usuariosRepository.delete(id);
    } catch (error) {
      console.error(`Error al eliminar usuario ${id}:`, error);
      throw error;
    }
  }
};

module.exports = usuariosService;
