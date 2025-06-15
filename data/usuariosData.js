// data/usuariosData.js
const admin = require('../firebaseAdmin');

async function crearUsuario(usuario) {
  const db = admin.firestore();
  const nuevoDoc = await db.collection('usuarios').add(usuario);
  return { id: nuevoDoc.id, ...usuario };
}

async function obtenerUsuarios() {
  const db = admin.firestore();
  const snapshot = await db.collection('usuarios').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerUsuarioPorId(id) {
  const db = admin.firestore();
  const doc = await db.collection('usuarios').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function actualizarUsuario(id, datosActualizados) {
  const db = admin.firestore();
  await db.collection('usuarios').doc(id).update(datosActualizados);
  return { id, ...datosActualizados };
}

async function eliminarUsuario(id) {
  const db = admin.firestore();
  await db.collection('usuarios').doc(id).delete();
  return { id };
}

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};