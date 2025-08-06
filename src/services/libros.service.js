const librosRepository = require('../repositories/libros.repository');
const autoresRepository = require('../repositories/autores.repository');
const favoritosRepository = require('../repositories/favoritos.repository'); // 👈 nuevo

const librosService = {
  async getAllLibros() {
    try {
      // Obtener todos los libros
      const libros = await librosRepository.getAll();

      // Obtener todos los favoritos
      const favoritos = await favoritosRepository.getAll();

      // Contar favoritos por libroId
      const favoritosCountMap = {};
      for (const fav of favoritos) {
        const libroId = fav.libroId;
        if (libroId) {
          favoritosCountMap[libroId] = (favoritosCountMap[libroId] || 0) + 1;
        }
      }

      // Añadir cantidadFavoritos a cada libro
      const librosConFavoritos = libros.map(libro => ({
        ...libro,
        cantidadFavoritos: favoritosCountMap[libro.id] || 0
      }));

      return librosConFavoritos;
    } catch (error) {
      console.error('Error al obtener libros con favoritos:', error);
      throw new Error('No se pudo obtener la lista de libros');
    }
  },

  async getTop5LibrosFavoritos() {
    return await favoritosRepository.getTop5LibrosFavoritos();
  },

  async buscarLibros(query) {
    try {
      const libros = await librosRepository.getAll();
      const autores = await autoresRepository.getAll();

      const q = query.toLowerCase();

      return libros
        .map(libro => {
          const autor = autores.find(a => a.id === libro.autorId);
          return {
            id: libro.id,
            titulo: libro.titulo,
            autorId: libro.autorId,
            nombreAutor: autor?.nombre || 'Autor desconocido'
          };
        })
        .filter(libro =>
          libro.titulo.toLowerCase().includes(q) ||
          libro.nombreAutor.toLowerCase().includes(q)
        );
    } catch (error) {
      console.error('Error en búsqueda de libros:', error);
      throw error;
    }
  },

  async getAllLibrosConAutores() {
    try {
      const libros = await librosRepository.getAll();

      const librosConAutor = await Promise.all(
        libros.map(async (libro) => {
          const autor = await autoresRepository.getById(libro.autorId);
          return {
            id: libro.id,
            titulo: libro.titulo,
            autorId: libro.autorId,
            nombreAutor: autor?.nombre || 'Autor no encontrado',
          };
        })
      );

      return librosConAutor;
    } catch (error) {
      console.error('Error al obtener libros con autores:', error);
      throw new Error('No se pudo obtener la lista de libros con autores');
    }
  },

  async getLibro(id) {
    try {
      const libro = await librosRepository.getById(id);
      if (!libro) throw new Error('Libro no encontrado');
      return libro;
    } catch (error) {
      console.error(`Error al obtener libro ${id}:`, error);
      throw error;
    }
  },

  async createLibro(libroData) {
    try {
      const { titulo, autorId } = libroData;

      if (!titulo || typeof titulo !== 'string') {
        throw new Error('El título es obligatorio y debe ser texto');
      }

      if (!autorId || isNaN(Number(autorId))) {
        throw new Error('El ID del autor es obligatorio y debe ser numérico');
      }

      // Verificar que el autor exista
      const autor = await autoresRepository.getById(autorId);
      if (!autor) {
        throw new Error('El autor especificado no existe');
      }

      const nuevoLibro = {
        titulo: titulo.trim(),
        autorId: Number(autorId),
        fechaRegistro: new Date()
      };

      return await librosRepository.create(nuevoLibro);
    } catch (error) {
      console.error('Error al crear libro:', error);
      throw error;
    }
  },

  async updateLibro(id, libroData) {
    try {
      const { titulo, autorId } = libroData;

      const libroExistente = await librosRepository.getById(id);
      if (!libroExistente) throw new Error('Libro no encontrado');

      if (!titulo || typeof titulo !== 'string') {
        throw new Error('El título es obligatorio y debe ser texto');
      }

      if (!autorId || isNaN(Number(autorId))) {
        throw new Error('El ID del autor es obligatorio y debe ser numérico');
      }

      const autor = await autoresRepository.getById(autorId);
      if (!autor) {
        throw new Error('El autor especificado no existe');
      }

      const tituloActualizado = titulo.trim();
      const autorIdActualizado = Number(autorId);

      // 1. Actualizar el libro
      await librosRepository.update(id, {
        titulo: tituloActualizado,
        autorId: autorIdActualizado
      });

      // 2. Actualizar los favoritos relacionados
      await favoritosRepository.actualizarTituloLibroEnFavoritos(id, tituloActualizado);

      return { id, titulo: tituloActualizado, autorId: autorIdActualizado };
    } catch (error) {
      console.error(`Error al actualizar libro ${id}:`, error);
      throw error;
    }
  },

  async deleteLibro(id) {
    try {
      const libro = await librosRepository.getById(id);
      if (!libro) {
        console.warn(`Intento de eliminar libro inexistente con id ${id}`);
        return; // No lanza error
      }

      return await librosRepository.delete(id);
    } catch (error) {
      console.error(`Error al eliminar libro ${id}:`, error);
      throw error;
    }
  }
};

module.exports = librosService;
