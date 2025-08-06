import {
  cargarAutores,
  eliminarAutor,
  mostrarEditarAutor,
  guardarAutor,
  cargarAutoresEnSelect
} from './autores.js';

import {
  cargarLibros,
  eliminarLibro,
  mostrarEditarLibro,
  guardarLibro,
  cargarLibrosEnSelect
} from './libros.js';

import {
  cargarUsuarios,
  cargarUsuariosEnSelect,
  guardarUsuario,
  eliminarUsuario,
  editarUsuario,
} from './usuarios.js';

import {
  cargarFavoritos,
  guardarFavorito,
  configurarBotonGuardarFavorito
} from './favoritos.js';

// Carga inicial de datos
(async () => {
  await cargarAutores();
  await cargarAutoresEnSelect();

  await cargarLibros();

  await cargarUsuarios();
  await cargarUsuariosEnSelect();

  // Para favoritos: cargar selects y configurar botón
  await cargarLibrosEnSelect();
  configurarBotonGuardarFavorito();

  await cargarFavoritos();
})();

// --- EVENTOS ---

// Autores
document.getElementById('listaAutores').addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminar-autor')) {
    eliminarAutor(e.target.dataset.id);
  } else if (e.target.classList.contains('editar-autor')) {
    mostrarEditarAutor(e.target.dataset.id, e.target.dataset.nombre);
  }
});

document.getElementById('guardarBtn').addEventListener('click', () => {
  const nombre = document.getElementById('nombreAutor').value.trim();
  if (!nombre) {
    alert('El nombre del autor no puede estar vacío');
    return;
  }
  guardarAutor(nombre).then(() => {
    document.getElementById('nombreAutor').value = '';
  });
});

// Libros
document.getElementById('listaLibros').addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminar-libro')) {
    eliminarLibro(e.target.dataset.id);
  } else if (e.target.classList.contains('editar-libro')) {
    mostrarEditarLibro(
      e.target.dataset.id,
      e.target.dataset.titulo,
      e.target.dataset.autorid
    );
  }
});

document.getElementById('guardarLibroBtn').addEventListener('click', () => {
  const titulo = document.getElementById('tituloLibro').value.trim();
  const autorId = document.getElementById('autorSelect').value;
  if (!titulo || !autorId) {
    alert('Debes completar título y autor para el libro');
    return;
  }
  guardarLibro(titulo, autorId).then(() => {
    document.getElementById('tituloLibro').value = '';
    document.getElementById('autorSelect').value = '';
  });
});

// Usuarios
document.getElementById('listaUsuarios').addEventListener('click', (e) => {
  if (e.target.classList.contains('eliminar-usuario')) {
    eliminarUsuario(e.target.dataset.id);
  } else if (e.target.classList.contains('editar-usuario')) {
    const id = e.target.dataset.id;
    const nombre = e.target.dataset.nombre;
    const nuevoNombre = prompt('Nuevo nombre de usuario:', nombre);
    if (nuevoNombre && nuevoNombre.trim() !== '') {
      editarUsuario(id, nuevoNombre.trim());
    }
  }
});

document.getElementById('guardarUsuarioBtn').addEventListener('click', () => {
  const nombre = document.getElementById('nombreUsuario').value.trim();
  if (!nombre) {
    alert('El nombre de usuario no puede estar vacío');
    return;
  }
  guardarUsuario(nombre).then(() => {
    document.getElementById('nombreUsuario').value = '';
  });
});

// Favoritos
// El listener para guardar favorito se configura dentro de configurarBotonGuardarFavorito()
// por lo que no hace falta agregarlo aquí manualmente.

// Búsqueda de libros
document.getElementById('buscarLibroBtn').addEventListener('click', async () => {
  const query = document.getElementById('busquedaInput').value.trim();
  const resultadosDiv = document.getElementById('resultadosBusqueda');

  if (!query) {
    resultadosDiv.innerHTML = '<p>Escribe algo para buscar.</p>';
    return;
  }

  try {
    const res = await fetch(`/api/libros/buscar?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Error en la búsqueda');
    const libros = await res.json();

    if (libros.length === 0) {
      resultadosDiv.innerHTML = '<p>No se encontraron libros.</p>';
      return;
    }

    resultadosDiv.innerHTML = '<ul>' + libros.map(libro => `
      <li>
        <strong>${libro.titulo}</strong> — Autor: ${libro.nombreAutor}
      </li>
    `).join('') + '</ul>';
  } catch (err) {
    console.error('Error al buscar libros:', err);
    resultadosDiv.innerHTML = '<p>Error al realizar la búsqueda.</p>';
  }
});

// --- TOP 5 LIBROS FAVORITOS ---

document.getElementById('top5LibrosBtn').addEventListener('click', async () => {
  const top5Div = document.getElementById('top5LibrosResultados');

  try {
    const res = await fetch('/api/favoritos/top5-libros');
    if (!res.ok) throw new Error('Error al obtener el Top 5');
    const top5 = await res.json();

    if (top5.length === 0) {
      top5Div.innerHTML = '<p>No hay libros favoritos aún.</p>';
      return;
    }

    top5Div.innerHTML = '<ol>' + top5.map(item => `
      <li>
        <strong>${item.libroTitulo}</strong> — Cantidad de favoritos: ${item.cantidad}
      </li>
    `).join('') + '</ol>';
  } catch (error) {
    console.error('Error al cargar Top 5 libros favoritos:', error);
    top5Div.innerHTML = '<p>Error al cargar el Top 5.</p>';
  }
});
