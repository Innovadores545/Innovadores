const { usuariosCollection } = require('../config/firebase.config');

class UsuariosRepository {
  async getUltimoId() {
    const snapshot = await usuariosCollection.orderBy('id', 'desc').limit(1).get();
    return snapshot.empty ? 0 : snapshot.docs[0].data().id;
  }

  async getAll() {
    const snapshot = await usuariosCollection.orderBy('id', 'asc').get();
    return snapshot.docs.map(doc => ({
      id: doc.data().id,
      nombre: doc.data().nombre,
      docId: doc.id
    }));
  }

  async getById(id) {
    const snapshot = await usuariosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...doc.data(), docId: doc.id };
  }

  async create(usuarioData) {
    const ultimoId = await this.getUltimoId();
    const nuevoId = ultimoId + 1;

    const nuevoUsuario = {
      id: nuevoId,
      ...usuarioData,
      fechaRegistro: new Date()
    };

    const docRef = await usuariosCollection.add(nuevoUsuario);
    return { docId: docRef.id, ...nuevoUsuario };
  }

  async update(id, usuarioData) {
    const snapshot = await usuariosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    await usuariosCollection.doc(doc.id).update(usuarioData);

    return { id: Number(id), ...usuarioData, docId: doc.id };
  }

  async delete(id) {
    const snapshot = await usuariosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    await usuariosCollection.doc(doc.id).delete();

    return true;
  }
}

module.exports = new UsuariosRepository();
