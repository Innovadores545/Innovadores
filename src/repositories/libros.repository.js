const { librosCollection } = require('../config/firebase.config');

class LibrosRepository {
  async getUltimoId() {
    const snapshot = await librosCollection.orderBy('id', 'desc').limit(1).get();
    return snapshot.empty ? 0 : snapshot.docs[0].data().id;
  }

  async getAll() {
    const snapshot = await librosCollection.orderBy('fechaRegistro', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.data().id,
      titulo: doc.data().titulo,
      autorId: doc.data().autorId,
      docId: doc.id
    }));
  }

  async getById(id) {
    const snapshot = await librosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...doc.data(), docId: doc.id };
  }

  async create(libroData) {
    const ultimoId = await this.getUltimoId();
    const nuevoId = ultimoId + 1;

    const nuevoLibro = {
      id: nuevoId,
      ...libroData,
      fechaRegistro: new Date()
    };

    const docRef = await librosCollection.add(nuevoLibro);
    return { docId: docRef.id, ...nuevoLibro };
  }

  async update(id, libroData) {
    const snapshot = await librosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    await librosCollection.doc(doc.id).update(libroData);

    return { id: Number(id), ...libroData, docId: doc.id };
  }

  async delete(id) {
    const snapshot = await librosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    await librosCollection.doc(doc.id).delete();

    return true;
  }
}

module.exports = new LibrosRepository();
