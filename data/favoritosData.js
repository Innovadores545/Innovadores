// data/favoritosData.js
const admin = require('../firebaseAdmin');

async function marcarFavorito(usuarioId, libroId) {
  const db = admin.firestore();
  
  const existe = await db.collection('favoritos')
    .where('usuarioId', '==', usuarioId)
    .where('libroId', '==', libroId)
    .get();

  if (!existe.empty) {
    throw new Error('Este libro ya está en tus favoritos');
  }

  await db.collection('favoritos').add({
    usuarioId,
    libroId,
    fecha: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
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
  try {
    const favoritosSnapshot = await db.collection('favoritos').get();
    const conteo = {};

    favoritosSnapshot.forEach(doc => {
      const libroId = doc.data().libroId;
      conteo[libroId] = (conteo[libroId] || 0) + 1;
    });

    const top5Ids = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const librosPromises = top5Ids.map(async libroId => {
      const libroDoc = await db.collection('libros').doc(libroId).get();
      return {
        id: libroId,
        ...libroDoc.data(),
        favoritos: conteo[libroId] || 0
      };
    });

    return await Promise.all(librosPromises);

  } catch (error) {
    console.error('Error en obtenerTop5LibrosFavoritos:', error);
    return []; 
  }
}
async function obtenerFavoritosPorUsuario(usuarioId) {
  const db = admin.firestore();
  try {
    const snapshot = await db.collection('favoritos')
      .where('usuarioId', '==', usuarioId)
      .get();

    const favoritos = [];
    for (const doc of snapshot.docs) {
      const libroDoc = await db.collection('libros').doc(doc.data().libroId).get();
      favoritos.push({
        id: doc.id,
        ...doc.data(),
        libroInfo: libroDoc.data() || null
      });
    }
    return favoritos;

  } catch (error) {
    console.error('Error en obtenerFavoritosPorUsuario:', error);
    return []; 
  }
}

module.exports = {
  marcarFavorito,
  eliminarFavorito,
  obtenerTop5LibrosFavoritos,
  obtenerFavoritosPorUsuario
};