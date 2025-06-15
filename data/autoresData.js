// data/autoresData.js
const admin = require('../firebaseAdmin');

async function crearAutor(autor) {
  const db = admin.firestore();
  const nuevoDoc = await db.collection('autores').add(autor);
  return { id: nuevoDoc.id, ...autor };
}

async function obtenerAutores() {
  const db = admin.firestore();
  const snapshot = await db.collection('autores').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerAutorPorId(id) {
  const db = admin.firestore();
  const doc = await db.collection('autores').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function actualizarAutor(id, datosActualizados) {
  const db = admin.firestore();
  await db.collection('autores').doc(id).update(datosActualizados);
  return { id, ...datosActualizados };
}

async function eliminarAutor(id) {
  const db = admin.firestore();
  await db.collection('autores').doc(id).delete();
  return { id };
}

module.exports = {
  crearAutor,
  obtenerAutores,
  obtenerAutorPorId,
  actualizarAutor,
  eliminarAutor
};