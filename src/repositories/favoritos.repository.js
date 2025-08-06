const { favoritosCollection } = require('../config/firebase.config');

class FavoritosRepository {
  async getUltimoId() {
    const snapshot = await favoritosCollection.orderBy('id', 'desc').limit(1).get();
    return snapshot.empty ? 0 : snapshot.docs[0].data().id;
  }

  async getAll() {
    const snapshot = await favoritosCollection.orderBy('id', 'asc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        usuarioId: data.usuarioId,
        usuarioNombre: data.usuarioNombre,
        libroId: data.libroId,
        libroTitulo: data.libroTitulo,
        autorId: data.autorId,
        autorNombre: data.autorNombre,
        fechaRegistro: data.fechaRegistro,
        docId: doc.id
      };
    });
  }

  async getById(id) {
    const snapshot = await favoritosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: data.id,
      usuarioId: data.usuarioId,
      usuarioNombre: data.usuarioNombre,
      libroId: data.libroId,
      libroTitulo: data.libroTitulo,
      autorId: data.autorId,
      autorNombre: data.autorNombre,
      fechaRegistro: data.fechaRegistro,
      docId: doc.id
    };
  }

  async existeFavorito(usuarioId, libroId) {
    const snapshot = await favoritosCollection
      .where('usuarioId', '==', Number(usuarioId))
      .where('libroId', '==', Number(libroId))
      .limit(1)
      .get();

    return !snapshot.empty;
  }

  // Incrementar contador de favoritos de un libro
  async incrementarContadorFavorito(libroId) {
    const contadorRef = favoritosCollection.firestore.collection('librosFavoritosCount').doc(String(libroId));
    const doc = await contadorRef.get();

    if (!doc.exists) {
      await contadorRef.set({ libroId, cantidadFavoritos: 1 });
    } else {
      await contadorRef.update({ cantidadFavoritos: doc.data().cantidadFavoritos + 1 });
    }
  }

  // Decrementar contador de favoritos de un libro
  async decrementarContadorFavorito(libroId) {
    const contadorRef = favoritosCollection.firestore.collection('librosFavoritosCount').doc(String(libroId));
    const doc = await contadorRef.get();

    if (doc.exists && doc.data().cantidadFavoritos > 0) {
      const nuevaCantidad = doc.data().cantidadFavoritos - 1;
      if (nuevaCantidad <= 0) {
        await contadorRef.delete();
      } else {
        await contadorRef.update({ cantidadFavoritos: nuevaCantidad });
      }
    }
  }

  // Método actualizado para obtener Top 5 libros favoritos usando contador en otra colección
  async getTop5LibrosFavoritos() {
    const snapshot = await favoritosCollection.firestore
      .collection('librosFavoritosCount')
      .orderBy('cantidadFavoritos', 'desc')
      .limit(5)
      .get();

    const top5 = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      top5.push({
        libroId: Number(data.libroId),
        cantidad: data.cantidadFavoritos,
        libroTitulo: null  // Lo rellenaremos luego
      });
    });

    // Obtener títulos de libros (consulta batch)
    const librosCollection = favoritosCollection.firestore.collection('libros');

    for (const item of top5) {
      // Buscamos por campo 'id' dentro de documentos, no por docId
      const libroSnapshot = await librosCollection.where('id', '==', item.libroId).limit(1).get();

      if (!libroSnapshot.empty) {
        item.libroTitulo = libroSnapshot.docs[0].data().titulo;
      } else {
        item.libroTitulo = 'Título desconocido';
      }
    }

    return top5;
  }

  async create(favoritoData) {
    const ultimoId = await this.getUltimoId();
    const nuevoId = ultimoId + 1;

    const nuevoFavorito = {
      id: nuevoId,
      usuarioId: Number(favoritoData.usuarioId),
      usuarioNombre: favoritoData.usuarioNombre,
      libroId: Number(favoritoData.libroId),
      libroTitulo: favoritoData.libroTitulo,
      autorId: favoritoData.autorId !== undefined ? Number(favoritoData.autorId) : null,
      autorNombre: favoritoData.autorNombre || null,
      fechaRegistro: new Date()
    };

    await favoritosCollection.add(nuevoFavorito);

    // Incrementar contador al crear favorito
    await this.incrementarContadorFavorito(nuevoFavorito.libroId);

    return { id: nuevoId, ...nuevoFavorito };
  }

  async update(id, datos) {
    const snapshot = await favoritosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];

    // Si cambia libroId, actualizar contadores en consecuencia
    const datosActuales = doc.data();
    if (datos.libroId && datos.libroId !== datosActuales.libroId) {
      await this.decrementarContadorFavorito(datosActuales.libroId);
      await this.incrementarContadorFavorito(datos.libroId);
    }

    await favoritosCollection.doc(doc.id).update(datos);
    return this.getById(id);
  }

  async delete(id) {
    const snapshot = await favoritosCollection.where('id', '==', Number(id)).limit(1).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    await favoritosCollection.doc(doc.id).delete();

    // Decrementar contador al eliminar favorito
    await this.decrementarContadorFavorito(data.libroId);

    return true;
  }

  async actualizarNombreUsuarioEnFavoritos(usuarioId, nuevoNombre) {
    const snapshot = await favoritosCollection
      .where('usuarioId', '==', Number(usuarioId))
      .get();

    const batch = favoritosCollection.firestore.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { usuarioNombre: nuevoNombre });
    });

    await batch.commit();
  }

  async actualizarTituloLibroEnFavoritos(libroId, nuevoTitulo) {
    const snapshot = await favoritosCollection
      .where('libroId', '==', Number(libroId))
      .get();

    const batch = favoritosCollection.firestore.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { libroTitulo: nuevoTitulo });
    });

    await batch.commit();
  }
}

module.exports = new FavoritosRepository();
