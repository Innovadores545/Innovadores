// data/librosData.js
const admin = require('../firebaseAdmin');

async function crearLibro(libro) {
  const db = admin.firestore();
  const nuevoDoc = await db.collection('libros').add(libro);
  return { id: nuevoDoc.id, ...libro };
}

async function obtenerLibros() {
  const db = admin.firestore();
  const snapshot = await db.collection('libros').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerLibroPorId(id) {
  const db = admin.firestore();
  const doc = await db.collection('libros').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function actualizarLibro(id, datosActualizados) {
  const db = admin.firestore();
  await db.collection('libros').doc(id).update(datosActualizados);
  return { id, ...datosActualizados };
}

async function eliminarLibro(id) {
  const db = admin.firestore();
  await db.collection('libros').doc(id).delete();
  return { id };
}

async function buscarLibrosPorTituloOAutor(query) {
  const db = admin.firestore();
  const librosSnap = await db.collection('libros').get();
  const libros = librosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const queryLower = query.toLowerCase();
  return libros.filter(libro =>
    libro.titulo.toLowerCase().includes(queryLower) ||
    libro.autor_id.toLowerCase().includes(queryLower)
  );
}

module.exports = {
  crearLibro,
  obtenerLibros,
  obtenerLibroPorId,
  actualizarLibro,
  eliminarLibro,
  buscarLibrosPorTituloOAutor
};