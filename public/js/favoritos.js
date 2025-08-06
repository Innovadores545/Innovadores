import { cargarUsuariosEnSelect } from './usuarios.js';
import { cargarLibrosEnSelect, librosMap, onLibroEditado } from './libros.js';  // <-- importamos onLibroEditado
import { autoresMap } from './autores.js';

let favoritoEditandoId = null;

export async function cargarFavoritos() {
  const lista = document.getElementById('listaFavoritos');
  lista.textContent = 'Cargando favoritos...';

  try {
    const res = await fetch('/api/favoritos');
    if (!res.ok) throw new Error('Error al cargar favoritos');

    const favoritos = await res.json();

    if (favoritos.length === 0) {
      lista.textContent = 'No hay favoritos para mostrar';
      return;
    }

    const table = document.createElement('table');
    table.classList.add('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID Favorito</th>
          <th>Usuario (ID - Nombre)</th>
          <th>Libro (ID - Título)</th>
          <th>Autor (ID - Nombre)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${favoritos.map(fav => `
          <tr>
            <td>${fav.id}</td>
            <td>${fav.usuarioId} - ${fav.usuarioNombre}</td>
            <td>${fav.libroId} - ${fav.libroTitulo}</td>
            <td>${fav.autorId} - ${fav.autorNombre}</td>
            <td>
              <button class="editar-favorito" data-id="${fav.id}" data-usuario-id="${fav.usuarioId}" data-libro-id="${fav.libroId}">Editar</button>
              <button class="eliminar-favorito" data-id="${fav.id}">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    lista.innerHTML = '';
    lista.appendChild(table);

    // Delegar eventos para evitar duplicar listeners
    lista.querySelectorAll('.eliminar-favorito').forEach(btn => {
      btn.addEventListener('click', () => eliminarFavorito(btn.dataset.id));
    });

    lista.querySelectorAll('.editar-favorito').forEach(btn => {
      btn.addEventListener('click', () =>
        editarFavorito(btn.dataset.id, btn.dataset.usuarioId, btn.dataset.libroId)
      );
    });

  } catch (error) {
    lista.textContent = 'Error al cargar favoritos: ' + error.message;
  }
}

export async function eliminarFavorito(id) {
  if (!confirm('¿Eliminar este favorito?')) return;

  try {
    const res = await fetch(`/api/favoritos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar favorito');

    alert('Favorito eliminado');
    await cargarFavoritos();
    await cargarTop5LibrosFavoritos();
  } catch (error) {
    alert(error.message);
  }
}

export function editarFavorito(id, usuarioId, libroId) {
  favoritoEditandoId = id;

  const usuarioSelect = document.getElementById('usuarioFavoritoSelect');
  const libroSelect = document.getElementById('libroFavoritoSelect');
  const btnGuardar = document.getElementById('guardarFavoritoBtn');

  usuarioSelect.value = usuarioId;
  libroSelect.value = libroId;

  btnGuardar.textContent = 'Actualizar Favorito';

  // Remover event listeners anteriores clonando el botón
  const nuevoBtnGuardar = btnGuardar.cloneNode(true);
  nuevoBtnGuardar.id = 'guardarFavoritoBtn';
  btnGuardar.replaceWith(nuevoBtnGuardar);

  nuevoBtnGuardar.addEventListener('click', async () => {
    const nuevoUsuarioId = usuarioSelect.value;
    const nuevoLibroId = libroSelect.value;

    if (!nuevoUsuarioId || !nuevoLibroId) {
      alert('Debes seleccionar un usuario y un libro');
      return;
    }

    const nuevoUsuarioNombre = usuarioSelect.options[usuarioSelect.selectedIndex]?.text || '';
    const libroOption = libroSelect.options[libroSelect.selectedIndex];
    const nuevoLibroTitulo = libroOption?.text || '';
    const autorId = libroOption?.dataset.autorId || '';
    const autorNombre = libroOption?.dataset.autorNombre || '';

    try {
      const res = await fetch(`/api/favoritos/${favoritoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: nuevoUsuarioId,
          usuarioNombre: nuevoUsuarioNombre,
          libroId: nuevoLibroId,
          libroTitulo: nuevoLibroTitulo,
          autorId,
          autorNombre
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar favorito');

      alert('Favorito actualizado');
      favoritoEditandoId = null;

      nuevoBtnGuardar.textContent = 'Guardar Favorito';
      usuarioSelect.value = '';
      libroSelect.value = '';

      await cargarFavoritos();
      await cargarTop5LibrosFavoritos();
      configurarBotonGuardarFavorito();

    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

export async function guardarFavorito(usuarioId, libroId) {
  if (!usuarioId || !libroId) {
    alert('Debes seleccionar un usuario y un libro');
    return;
  }

  const usuarioSelect = document.getElementById('usuarioFavoritoSelect');
  const libroSelect = document.getElementById('libroFavoritoSelect');

  const usuarioNombre = usuarioSelect.options[usuarioSelect.selectedIndex]?.text || '';
  const libroTitulo = libroSelect.options[libroSelect.selectedIndex]?.text || '';

  const libro = librosMap[libroId];
  const autorId = libro?.autorId || '';
  const autorNombre = libro?.autorNombre || 'Desconocido';

  try {
    const res = await fetch('/api/favoritos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId,
        usuarioNombre,
        libroId,
        libroTitulo,
        autorId,
        autorNombre
      })
    });

    if (!res.ok) throw new Error('Error al guardar favorito');

    alert('Favorito guardado');
    usuarioSelect.value = '';
    libroSelect.value = '';
    await cargarFavoritos();
    await cargarTop5LibrosFavoritos();

  } catch (error) {
    alert('Error: ' + error.message);
  }
}

export function configurarBotonGuardarFavorito() {
  const btnGuardar = document.getElementById('guardarFavoritoBtn');
  const usuarioSelect = document.getElementById('usuarioFavoritoSelect');
  const libroSelect = document.getElementById('libroFavoritoSelect');

  if (btnGuardar && usuarioSelect && libroSelect) {
    // Clonamos para eliminar listeners anteriores
    const nuevoBtnGuardar = btnGuardar.cloneNode(true);
    nuevoBtnGuardar.id = 'guardarFavoritoBtn';
    btnGuardar.replaceWith(nuevoBtnGuardar);

    nuevoBtnGuardar.addEventListener('click', () => {
      // Solo guardar si NO estamos editando (favoritoEditandoId == null)
      if (favoritoEditandoId === null) {
        const usuarioId = usuarioSelect.value;
        const libroId = libroSelect.value;
        guardarFavorito(usuarioId, libroId);
      }
    });
  }
}

export function actualizarTitulosDeLibroEnFavoritos(librosMap) {
  document.querySelectorAll('#listaFavoritos table tbody tr').forEach(row => {
    const tdLibro = row.children[2];
    if (!tdLibro) return;

    const id = tdLibro.textContent.split(' - ')[0].trim();
    if (librosMap[id]) {
      const titulo = typeof librosMap[id] === 'object' ? librosMap[id].titulo || '' : librosMap[id];
      tdLibro.textContent = `${id} - ${titulo}`;
    }
  });
}

export function actualizarNombresDeUsuarioEnFavoritos(usuariosMap) {
  document.querySelectorAll('#listaFavoritos table tbody tr').forEach(row => {
    const tdUsuario = row.children[1];
    if (!tdUsuario) return;

    const id = tdUsuario.textContent.split(' - ')[0].trim();
    if (usuariosMap[id]) {
      const nombre = typeof usuariosMap[id] === 'object' ? usuariosMap[id].nombre || '' : usuariosMap[id];
      tdUsuario.textContent = `${id} - ${nombre}`;
    }
  });
}

export function actualizarAutoresEnFavoritos() {
  const lista = document.getElementById('listaFavoritos');
  if (!lista) return;

  lista.querySelectorAll('tbody tr').forEach(tr => {
    const tdAutor = tr.children[3];
    if (!tdAutor) return;

    const texto = tdAutor.textContent;
    const match = texto.match(/^(\d+)\s*-/);
    if (!match) return;

    const autorId = match[1];
    const autor = autoresMap[autorId];
    if (autor) {
      tdAutor.textContent = `${autorId} - ${autor.nombre}`;
    }
  });
}

export async function cargarTop5LibrosFavoritos() {
  const top5Div = document.getElementById('top5LibrosResultados');
  if (!top5Div) return;

  try {
    const res = await fetch('/api/favoritos/top5-libros');
    if (!res.ok) throw new Error('Error al obtener el Top 5');
    const top5 = await res.json();

    if (top5.length === 0) {
      top5Div.innerHTML = '<p>No hay libros favoritos aún.</p>';
      return;
    }

    top5Div.innerHTML = `
      <ol>
        ${top5.map(item => {
          // Intentar obtener título real desde librosMap si está disponible
          let titulo = item.libroTitulo;
          const libroInfo = librosMap[item.libroId];
          if ((!titulo || titulo === 'Desconocido') && libroInfo) {
            titulo = typeof libroInfo === 'object' ? libroInfo.titulo || 'Desconocido' : libroInfo;
          }
          return `
            <li>
              <strong>${titulo}</strong> — Cantidad de favoritos: ${item.cantidad}
            </li>
          `;
        }).join('')}
      </ol>
    `;
  } catch (error) {
    console.error('Error al cargar Top 5 libros favoritos:', error);
    top5Div.innerHTML = '<p>Error al cargar el Top 5.</p>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarUsuariosEnSelect();
  await cargarLibrosEnSelect();
  await cargarFavoritos();
  await cargarTop5LibrosFavoritos();
  configurarBotonGuardarFavorito();

  const usuarioSelect = document.getElementById('usuarioFavoritoSelect');
  const libroSelect = document.getElementById('libroFavoritoSelect');

  if (usuarioSelect) {
    usuarioSelect.addEventListener('focus', async () => {
      await cargarUsuariosEnSelect();
    });
  }

  if (libroSelect) {
    libroSelect.addEventListener('focus', async () => {
      await cargarLibrosEnSelect();
    });
  }

  const btnTop5 = document.getElementById('top5LibrosBtn');
  if (btnTop5) {
    btnTop5.addEventListener('click', cargarTop5LibrosFavoritos);
  }
});

// ** NUEVO: recargar el top 5 y actualizar autor/título cuando un libro sea editado **
onLibroEditado((libroActualizado) => {
  cargarTop5LibrosFavoritos();

  const filas = document.querySelectorAll('#listaFavoritos table tbody tr');
  filas.forEach(fila => {
    const tdLibro = fila.children[2]; // Libro (ID - Título)
    const tdAutor = fila.children[3]; // Autor (ID - Nombre)

    if (!tdLibro || !tdAutor) return;

    const libroId = tdLibro.textContent.split(' - ')[0].trim();
    if (libroId === libroActualizado.id) {
      // Actualizar título
      tdLibro.textContent = `${libroActualizado.id} - ${libroActualizado.titulo}`;

      // Actualizar autor si se encuentra en autoresMap
      const autorId = libroActualizado.autorId;
      const autorNombre = autoresMap[autorId]?.nombre || 'Desconocido';
      tdAutor.textContent = `${autorId} - ${autorNombre}`;
    }
  });
});

