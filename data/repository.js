// libroRepository.js

const db = require('./firebase'); // Firebase inicializado

/**
 * Trae un libro desde Firestore por su ID
 * @param {string} id - ID del libro
 * @returns {Promise<Object|null>} - Libro encontrado o null si no existe
 */
async function getLibroById(id) {
  const doc = await db.collection('libros').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  getLibroById
};
