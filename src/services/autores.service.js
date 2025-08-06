const autoresRepository = require('../repositories/autores.repository');

const autoresService = {
  async getAllAutores() {
    try {
      return await autoresRepository.getAll();
    } catch (error) {
      console.error('Error al obtener autores:', error);
      throw new Error('No se pudo obtener la lista de autores');
    }
  },

  async getAutor(id) {
    try {
      const autor = await autoresRepository.getById(id);
      if (!autor) throw new Error('Autor no encontrado');
      return autor;
    } catch (error) {
      console.error(`Error al obtener autor ${id}:`, error);
      throw error;
    }
  },

  async createAutor(autorData) {
    try {
      if (!autorData?.nombre || typeof autorData.nombre !== 'string') {
        throw new Error('El nombre del autor es requerido y debe ser texto');
      }

      const nombre = autorData.nombre.trim();
      if (nombre.length === 0) {
        throw new Error('El nombre no puede estar vacío');
      }

      if (nombre.length > 100) {
        throw new Error('El nombre no puede exceder los 100 caracteres');
      }

      const datosAutor = {
        nombre,
        fechaRegistro: new Date()
      };

      return await autoresRepository.create(datosAutor);
    } catch (error) {
      console.error('Error al crear autor:', error);
      throw error;
    }
  },

  async updateAutor(id, autorData) {
    try {
      if (!autorData?.nombre || typeof autorData.nombre !== 'string') {
        throw new Error('El nombre del autor es requerido y debe ser texto');
      }

      const nombre = autorData.nombre.trim();
      if (nombre.length === 0) {
        throw new Error('El nombre no puede estar vacío');
      }

      const existeAutor = await autoresRepository.getById(id);
      if (!existeAutor) throw new Error('Autor no encontrado');

      return await autoresRepository.update(id, { nombre });
    } catch (error) {
      console.error(`Error al actualizar autor ${id}:`, error);
      throw error;
    }
  },

  async deleteAutor(id) {
    try {
      const existeAutor = await autoresRepository.getById(id);
      if (!existeAutor) throw new Error('Autor no encontrado');

      return await autoresRepository.delete(id);
    } catch (error) {
      console.error(`Error al eliminar autor ${id}:`, error);
      throw error;
    }
  }
};

module.exports = autoresService;
