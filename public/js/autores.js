import { actualizarAutoresEnFavoritos } from './favoritos.js';

export const autoresMap = {};

let cargarLibrosCallback = null;

export async function cargarAutores() {
  const lista = document.getElementById('listaAutores');
  lista.textContent = 'Cargando autores...';

  try {
    const res = await fetch('/api/autores');
    if (!res.ok) throw new Error('Error al obtener autores');

    const autores = await res.json();

    if (autores.length === 0) {
      lista.textContent = 'No hay autores disponibles';
      return;
    }

    for (const key in autoresMap) delete autoresMap[key];
    autores.forEach(a => {
      autoresMap[a.id] = { id: a.id, nombre: a.nombre };
    });

    const table = document.createElement('table');
    table.classList.add('table');
    table.innerHTML = `
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        ${autores.map(a => `
          <tr>
            <td>${a.id}</td>
            <td>${a.nombre}</td>
            <td>
              <button class="editar-autor" data-id="${a.id}" data-nombre="${a.nombre}">Editar</button>
              <button class="eliminar-autor" data-id="${a.id}">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    lista.innerHTML = '';
    lista.appendChild(table);

    // Ya no agregamos eventos aquí, todo lo maneja index.js con delegación

  } catch (err) {
    lista.textContent = 'Error al cargar autores: ' + err.message;
  }
}

export async function editarAutor(id, nuevoNombre) {
  try {
    const res = await fetch(`/api/autores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre })
    });

    if (!res.ok) throw new Error('Error al actualizar autor');

    alert('Autor actualizado');

    if (autoresMap[id]) {
      autoresMap[id].nombre = nuevoNombre;
    }

    document.querySelectorAll('#listaLibros table tbody tr').forEach(row => {
      const autorTd = row.children[2];
      if (autorTd && autorTd.textContent.startsWith(`${id} -`)) {
        autorTd.textContent = `${id} - ${nuevoNombre}`;
      }
    });

    const select = document.getElementById('autorSelect');
    if (select) {
      const option = select.querySelector(`option[value="${id}"]`);
      if (option) option.textContent = nuevoNombre;
    }

    const libroSelect = document.getElementById('libroFavoritoSelect');
    if (libroSelect) {
      libroSelect.querySelectorAll('option').forEach(opt => {
        if (opt.dataset.autorId === id) {
          opt.dataset.autorNombre = nuevoNombre;
        }
      });
    }

    await cargarAutores();
    if (cargarLibrosCallback) await cargarLibrosCallback();
    actualizarAutoresEnFavoritos();

  } catch (err) {
    alert(err.message);
  }
}

export async function eliminarAutor(id) {
  try {
    const res = await fetch(`/api/autores/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar autor');

    alert('Autor eliminado');
    await cargarAutores();
    if (cargarLibrosCallback) await cargarLibrosCallback();
  } catch (err) {
    alert(err.message);
  }
}

export async function guardarAutor(nombre) {
  if (!nombre.trim()) {
    alert('El nombre es obligatorio');
    return;
  }

  try {
    const res = await fetch('/api/autores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre.trim() })
    });

    if (!res.ok) throw new Error('Error al crear autor');

    alert('Autor creado');
    await cargarAutores();
    await cargarAutoresEnSelect();
    if (cargarLibrosCallback) await cargarLibrosCallback();

  } catch (err) {
    alert(err.message);
  }
}

export function setCargarLibrosFn(callback) {
  cargarLibrosCallback = callback;
}

export async function cargarAutoresEnSelect() {
  const select = document.getElementById('autorSelect');
  if (!select) return;

  select.innerHTML = '<option value="">Seleccione autor</option>';

  try {
    const res = await fetch('/api/autores');
    if (!res.ok) throw new Error('Error al cargar autores');

    const autores = await res.json();

    for (const key in autoresMap) delete autoresMap[key];
    autores.forEach(a => {
      autoresMap[a.id] = { id: a.id, nombre: a.nombre };
      const option = document.createElement('option');
      option.value = a.id;
      option.textContent = a.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar autores en select:', error.message);
    select.innerHTML = '<option value="">Error al cargar autores</option>';
  }
}

export function mostrarEditarAutor(id, nombre) {
  const nuevoNombre = prompt('Nuevo nombre del autor:', nombre);
  if (nuevoNombre === null) return;
  if (!nuevoNombre.trim()) {
    alert('El nombre no puede estar vacío');
    return;
  }

  editarAutor(id, nuevoNombre.trim());
}
