const favoritosRepository = require('../repositories/favoritos.repository');
const usuariosRepository = require('../repositories/usuarios.repository');
const librosRepository = require('../repositories/libros.repository');
const autoresRepository = require('../repositories/autores.repository');

const favoritosService = {
  async getAllFavoritos() {
    return await favoritosRepository.getAll();
  },

  async getFavorito(id) {
    const favorito = await favoritosRepository.getById(id);
    if (!favorito) throw new Error('Favorito no encontrado');
    return favorito;
  },

  async existeFavorito(usuarioId, libroId) {
    return await favoritosRepository.existeFavorito(usuarioId, libroId);
  },

  async createFavorito({ usuarioId, libroId }) {
    if (!usuarioId || isNaN(usuarioId)) throw new Error('ID de usuario inválido');
    if (!libroId || isNaN(libroId)) throw new Error('ID de libro inválido');

    const usuario = await usuariosRepository.getById(usuarioId);
    if (!usuario) throw new Error('Usuario no encontrado');

    const libro = await librosRepository.getById(libroId);
    if (!libro) throw new Error('Libro no encontrado');

    const autor = await autoresRepository.getById(libro.autorId);
    if (!autor) throw new Error('Autor no encontrado');

    const yaExiste = await favoritosRepository.existeFavorito(usuarioId, libroId);
    if (yaExiste) throw new Error('Este favorito ya existe');

    return await favoritosRepository.create({
      usuarioId: Number(usuarioId),
      usuarioNombre: usuario.nombre,
      libroId: Number(libroId),
      libroTitulo: libro.titulo,
      autorId: Number(libro.autorId),
      autorNombre: autor.nombre
    });
  },

  async updateFavorito(id, { usuarioId, libroId }) {
    if (!usuarioId || isNaN(usuarioId)) throw new Error('ID de usuario inválido');
    if (!libroId || isNaN(libroId)) throw new Error('ID de libro inválido');

    const favorito = await favoritosRepository.getById(id);
    if (!favorito) throw new Error('Favorito no encontrado');

    const usuario = await usuariosRepository.getById(usuarioId);
    if (!usuario) throw new Error('Usuario no encontrado');

    const libro = await librosRepository.getById(libroId);
    if (!libro) throw new Error('Libro no encontrado');

    const autor = await autoresRepository.getById(libro.autorId);
    if (!autor) throw new Error('Autor no encontrado');

    return await favoritosRepository.update(id, {
      usuarioId: Number(usuarioId),
      usuarioNombre: usuario.nombre,
      libroId: Number(libroId),
      libroTitulo: libro.titulo,
      autorId: Number(libro.autorId),
      autorNombre: autor.nombre
    });
  },

  async deleteFavorito(id) {
    const favorito = await favoritosRepository.getById(id);
    if (!favorito) throw new Error('Favorito no encontrado');
    return await favoritosRepository.delete(id);
  },

  // Aquí agregamos el método que faltaba para obtener el top 5 libros favoritos
  async getTop5LibrosFavoritos() {
    return await favoritosRepository.getTop5LibrosFavoritos();
  },

  async actualizarNombreUsuarioEnFavoritos(usuarioId, nuevoNombre) {
    return await favoritosRepository.actualizarNombreUsuarioEnFavoritos(usuarioId, nuevoNombre);
  },

  async actualizarTituloLibroEnFavoritos(libroId, nuevoTitulo) {
    return await favoritosRepository.actualizarTituloLibroEnFavoritos(libroId, nuevoTitulo);
  }
};

module.exports = favoritosService;
