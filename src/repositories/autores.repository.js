const { autoresCollection } = require('../config/firebase.config');

class AutoresRepository {
  async getUltimoId() {
    const snapshot = await autoresCollection.orderBy('id', 'desc').limit(1).get();
    return snapshot.empty ? 0 : snapshot.docs[0].data().id;
  }

  async getAll() {
    const snapshot = await autoresCollection.orderBy('fechaRegistro', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.data().id,
      nombre: doc.data().nombre,
      docId: doc.id
    }));
  }

  async getById(id) {
    // Busca un documento por campo id
    const snapshot = await autoresCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.data().id, nombre: doc.data().nombre, docId: doc.id };
  }

  async create(autorData) {
    const ultimoId = await this.getUltimoId();
    const nuevoId = ultimoId + 1;

    const nuevoAutor = {
      id: nuevoId,
      nombre: autorData.nombre,
      fechaRegistro: new Date()
    };

    const docRef = await autoresCollection.add(nuevoAutor);
    return { docId: docRef.id, ...nuevoAutor };
  }

  async update(id, autorData) {
    // Primero obtener docId por id para actualizar
    const snapshot = await autoresCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    await autoresCollection.doc(doc.id).update(autorData);

    return { id: Number(id), ...autorData, docId: doc.id };
  }

  async delete(id) {
    const snapshot = await autoresCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    await autoresCollection.doc(doc.id).delete();

    return true;
  }

  async search(termino) {
    // Ejemplo básico de búsqueda por nombre (Firestore no soporta contains, solo rangos)
    const snapshot = await autoresCollection
      .orderBy('nombre')
      .startAt(termino)
      .endAt(termino + '\uf8ff')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.data().id,
      nombre: doc.data().nombre,
      docId: doc.id
    }));
  }
}

module.exports = new AutoresRepository();