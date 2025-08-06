import { cargarAutoresEnSelect, autoresMap, setCargarLibrosFn } from './autores.js';
import { actualizarTitulosDeLibroEnFavoritos } from './favoritos.js';

export const librosMap = {};
let editandoLibroId = null;

// --- Para notificar edición de libro ---
const libroEditadoCallbacks = [];

export function onLibroEditado(callback) {
  libroEditadoCallbacks.push(callback);
}

function emitirLibroEditado(libro) {
  libroEditadoCallbacks.forEach(cb => cb(libro));
}
// -----------------------------------------

export async function initLibros() {
  await cargarAutoresEnSelect();
  await cargarLibros();

  const btnGuardar = document.getElementById('guardarLibroBtn');
  btnGuardar.onclick = guardarLibro;

  setCargarLibrosFn(cargarLibros); // conexión con autores.js

  initBusquedaLibros(); // inicializa la búsqueda
}

export async function cargarLibros() {
  const lista = document.getElementById('listaLibros');
  lista.textContent = 'Cargando libros...';

  try {
    const res = await fetch('/api/libros');
    if (!res.ok) throw new Error('Error al cargar libros');
    const libros = await res.json();

    if (libros.length === 0) {
      lista.textContent = 'No hay libros disponibles';
      return;
    }

    mostrarTablaLibros(libros);

    // Actualizar librosMap global
    for (const key in librosMap) delete librosMap[key];
    libros.forEach(libro => librosMap[libro.id] = libro);

    // Actualizar títulos en favoritos
    actualizarTitulosDeLibroEnFavoritos(librosMap);

  } catch (err) {
    lista.textContent = 'Error al cargar libros: ' + err.message;
  }
}

function mostrarTablaLibros(libros) {
  const lista = document.getElementById('listaLibros');

  const table = document.createElement('table');
  table.classList.add('table');
  table.innerHTML = `
    <thead>
      <tr><th>ID</th><th>Título</th><th>Autor</th><th>Acciones</th></tr>
    </thead>
    <tbody>
      ${libros.map(libro => `
        <tr>
          <td>${libro.id}</td>
          <td>${libro.titulo}</td>
          <td>${libro.autorId} - ${autoresMap[libro.autorId]?.nombre || 'Desconocido'}</td>
          <td>
            <button class="editar-libro" data-id="${libro.id}" data-titulo="${libro.titulo}" data-autorid="${libro.autorId}">Editar</button>
            <button class="eliminar-libro" data-id="${libro.id}">Eliminar</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  lista.innerHTML = '';
  lista.appendChild(table);
}

// Delegación de eventos para editar y eliminar libros
document.getElementById('listaLibros').addEventListener('click', (e) => {
  if (e.target.classList.contains('editar-libro')) {
    const btn = e.target;
    mostrarEditarLibro(btn.dataset.id, btn.dataset.titulo, btn.dataset.autorid);
  } else if (e.target.classList.contains('eliminar-libro')) {
    const btn = e.target;
    eliminarLibro(btn.dataset.id);
  }
});

export async function eliminarLibro(id) {
  if (!confirm('¿Eliminar libro?')) return;

  try {
    const res = await fetch(`/api/libros/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar libro');

    alert('Libro eliminado');
    await cargarLibros();

  } catch (err) {
    alert(err.message);
  }
}

export function mostrarEditarLibro(id, titulo, autorId) {
  editandoLibroId = id;
  document.getElementById('tituloLibro').value = titulo;
  document.getElementById('autorSelect').value = autorId;

  const btnGuardar = document.getElementById('guardarLibroBtn');
  btnGuardar.textContent = 'Actualizar Libro';
}

export async function guardarLibro(tituloParam, autorIdParam) {
  const titulo = tituloParam || document.getElementById('tituloLibro').value.trim();
  const autorId = autorIdParam || document.getElementById('autorSelect').value;

  if (!titulo || !autorId) {
    alert('Debes llenar todos los campos');
    return;
  }

  try {
    let res, libroActualizado;
    if (editandoLibroId) {
      res = await fetch(`/api/libros/${editandoLibroId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autorId }),
      });
      if (!res.ok) throw new Error('Error al actualizar libro');
      libroActualizado = await res.json();

      alert('Libro actualizado');

      // Emitir evento de libro editado
      emitirLibroEditado(libroActualizado);

    } else {
      res = await fetch('/api/libros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autorId }),
      });
      if (!res.ok) throw new Error('Error al guardar libro');
      alert('Libro guardado');
    }

    limpiarFormularioLibro();
    await cargarLibros();

  } catch (err) {
    alert(err.message);
  }
}

function limpiarFormularioLibro() {
  editandoLibroId = null;
  document.getElementById('tituloLibro').value = '';
  document.getElementById('autorSelect').value = '';
  document.getElementById('guardarLibroBtn').textContent = 'Guardar Libro';
}

export async function cargarLibrosEnSelect() {
  const select = document.getElementById('libroFavoritoSelect');
  if (!select) return;

  try {
    const res = await fetch('/api/libros');
    if (!res.ok) throw new Error('Error al cargar libros para select');

    const libros = await res.json();

    select.innerHTML = '<option value="">Seleccione libro</option>';
    libros.forEach(libro => {
      const option = document.createElement('option');
      option.value = libro.id;
      option.textContent = libro.titulo;
      option.dataset.autorId = libro.autorId;
      option.dataset.autorNombre = autoresMap[libro.autorId]?.nombre || 'Desconocido';
      select.appendChild(option);
    });
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar libros</option>';
  }
}

// ----------- BÚSQUEDA -------------

export function initBusquedaLibros() {
  const input = document.getElementById('busquedaInput');
  const btn = document.getElementById('buscarLibroBtn');

  if (!input || !btn) return;

  btn.onclick = () => buscarLibros(input.value);
  input.onkeydown = (e) => {
    if (e.key === 'Enter') buscarLibros(input.value);
  };
}

export async function buscarLibros(palabra) {
  palabra = palabra.trim();
  const lista = document.getElementById('listaLibros');

  if (!palabra) {
    lista.textContent = 'Ingresa una palabra para buscar libros...';
    return;
  }

  lista.textContent = 'Buscando libros...';

  try {
    // Llamamos al endpoint backend que ya tiene búsqueda implementada
    const res = await fetch(`/api/libros/buscar?q=${encodeURIComponent(palabra)}`);
    if (!res.ok) throw new Error('Error al buscar libros');

    const resultados = await res.json();

    if (resultados.length === 0) {
      lista.textContent = 'No se encontraron libros que coincidan con la búsqueda.';
      return;
    }

    mostrarTablaLibros(resultados);

    // Actualizar librosMap con resultados filtrados
    for (const key in librosMap) delete librosMap[key];
    resultados.forEach(libro => librosMap[libro.id] = libro);

    // Actualizar títulos en favoritos tras búsqueda
    actualizarTitulosDeLibroEnFavoritos(librosMap);

  } catch (err) {
    lista.textContent = 'Error al buscar libros: ' + err.message;
  }
}
