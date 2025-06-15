// data/favoritosData.js
const admin = require('../firebaseAdmin');

async function marcarFavorito(usuarioId, libroId) {
  const db = admin.firestore();
  const yaExiste = await db.collection('favoritos')
    .where('usuarioId', '==', usuarioId)
    .where('libroId', '==', libroId)
    .get();

  if (!yaExiste.empty) {
    throw new Error('Este libro ya está marcado como favorito por este usuario.');
  }

  const nuevoFavorito = { usuarioId, libroId, fecha: new Date().toISOString() };
  const doc = await db.collection('favoritos').add(nuevoFavorito);
  return { id: doc.id, ...nuevoFavorito };
}

async function eliminarFavorito(usuarioId, libroId) {
  const db = admin.firestore();
  const snapshot = await db.collection('favoritos')
    .where('usuarioId', '==', usuarioId)
    .where('libroId', '==', libroId)
    .get();

  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  return { eliminado: true };
}

async function obtenerTop5LibrosFavoritos() {
  const db = admin.firestore();
  const snapshot = await db.collection('favoritos').get();
  const conteo = {};

  snapshot.forEach(doc => {
    const { libroId } = doc.data();
    conteo[libroId] = (conteo[libroId] || 0) + 1;
  });

  const top5Ids = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([libroId]) => libroId);

  const librosSnapshot = await db.collection('libros').get();

  const topLibros = librosSnapshot.docs
    .filter(doc => top5Ids.includes(doc.id))
    .map(doc => ({ id: doc.id, ...doc.data(), favoritos: conteo[doc.id] || 0 }))
    .sort((a, b) => b.favoritos - a.favoritos);

  return topLibros;
}

module.exports = {
  marcarFavorito,
  eliminarFavorito,
  obtenerTop5LibrosFavoritos
};