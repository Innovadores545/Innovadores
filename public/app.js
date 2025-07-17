// public/app.js
const API_URL = 'http://localhost:3000/api';
const usuarioActual = "usuario1";
let favoritosUsuario = [];

// Cargar datos al iniciar
window.addEventListener('DOMContentLoaded', async () => {
  await obtenerTopLibros();
  await obtenerFavoritosUsuario();
  
  // Asignar event listeners adecuadamente
  document.getElementById('buscarBtn').addEventListener('click', buscarLibros);
  document.getElementById('agregarBtn').addEventListener('click', agregarLibro);
});

// Función para buscar libros
async function buscarLibros() {
  try {
    const query = document.getElementById('buscar').value.trim().toLowerCase();
    if (!query) {
      alert('Por favor ingresa un término de búsqueda');
      return;
    }

    const [librosRes, autoresRes] = await Promise.all([
      fetch(`${API_URL}/libros`),
      fetch(`${API_URL}/autores`)
    ]);

    if (!librosRes.ok || !autoresRes.ok) {
      throw new Error('Error al cargar datos');
    }

    const [libros, autores] = await Promise.all([
      librosRes.json(),
      autoresRes.json()
    ]);

    const lista = document.getElementById('resultadosBusqueda');
    lista.innerHTML = libros.filter(libro => {
      const autor = autores.find(a => a.id === libro.autorId);
      return (
        libro.titulo.toLowerCase().includes(query) ||
        (autor?.nombre.toLowerCase().includes(query))
      );
    }).map(libro => {
      const autor = autores.find(a => a.id === libro.autorId);
      const esFavorito = favoritosUsuario.some(fav => fav.libroId === libro.id);
      
      return `
        <div class="libro-item">
      <span>${libro.titulo}</span>          <button 
            data-libro-id="${libro.id}"
            class="corazon"
          >${esFavorito ? '❤️' : '🤍'}</button>
        </div>
      `;
    }).join('');

    // Asignar event listeners a los nuevos botones
    document.querySelectorAll('.corazon').forEach(boton => {
      boton.addEventListener('click', async () => {
        await toggleFavorito(boton.dataset.libroId, boton);
      });
    });
  } catch (error) {
    console.error("Error al buscar:", error);
    alert('Error al buscar libros');
  }
}

// Función para manejar favoritos
async function toggleFavorito(libroId, boton) {
  try {
    const esFavorito = boton.textContent.includes('❤️');
    const method = esFavorito ? 'DELETE' : 'POST';
    
    const response = await fetch(`${API_URL}/favoritos`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: usuarioActual, libroId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    boton.textContent = esFavorito ? '🤍' : '❤️';
    boton.style.color = esFavorito ? '#ccc' : 'red';
    
    await obtenerTopLibros();
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

// Obtener favoritos del usuario
async function obtenerFavoritosUsuario() {
  try {
    const res = await fetch(`${API_URL}/favoritos/${usuarioActual}`);
    if (!res.ok) throw new Error('Error al cargar favoritos');
    
    favoritosUsuario = await res.json();
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
  }
}

// Obtener top 5 libros
async function obtenerTopLibros() {
  const lista = document.getElementById('topLibros');
  try {
    const response = await fetch(`${API_URL}/favoritos/top5`);
    if (!response.ok) throw new Error('Error al cargar top 5');
    
    const topLibros = await response.json();
    lista.innerHTML = topLibros.map(libro => 
      `<li>${libro.titulo || 'Libro sin título'}</li>` 
    ).join('');
  } catch (error) {
    console.error('Error:', error);
    lista.innerHTML = `<li>${error.message}</li>`;
  }
}
// Agregar nuevo libro
async function agregarLibro() {
  try {
    const titulo = document.getElementById('titulo').value.trim();
    const autorId = document.getElementById('autorId').value.trim();
    
    if (!titulo || !autorId) {
      alert('Completa todos los campos');
      return;
    }

    const res = await fetch(`${API_URL}/libros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, autorId })
    });

    if (!res.ok) throw new Error('Error al agregar libro');
    
    const nuevoLibro = await res.json();
    alert(`Libro agregado: ${nuevoLibro.titulo}`);
    document.getElementById('titulo').value = '';
    document.getElementById('autorId').value = '';
    await buscarLibros();
    await obtenerTopLibros();
  } catch (error) {
    console.error('Error al agregar libro:', error);
    alert('Error al agregar libro');
  }
}