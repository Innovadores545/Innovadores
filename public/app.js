// public/app.js

const API_URL = 'http://localhost:3000/api'; 

async function buscarLibros() {
  const query = document.getElementById('buscar').value.toLowerCase();
  const res = await fetch(`${API_URL}/libros`);
  const libros = await res.json();

  const resAutores = await fetch(`${API_URL}/autores`);
  const autores = await resAutores.json();

  const resultados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(query) ||
    (autores.find(a => a.id === libro.autorId)?.nombre.toLowerCase().includes(query))
  );

  const lista = document.getElementById('resultadosBusqueda');
  lista.innerHTML = '';
  resultados.forEach(libro => {
    const li = document.createElement('li');
    li.innerText = `${libro.titulo} (Autor ID: ${libro.autorId})`;
    lista.appendChild(li);
  });
}

async function obtenerTopLibros() {
  const res = await fetch(`${API_URL}/favoritos/top5`);
  const topLibros = await res.json();

  const lista = document.getElementById('topLibros');
  lista.innerHTML = '';
  topLibros.forEach(libro => {
    const li = document.createElement('li');
    li.innerText = `${libro.titulo} - ${libro.favoritos} favoritos`;
    lista.appendChild(li);
  });
}

async function agregarLibro() {
  const titulo = document.getElementById('titulo').value;
  const autorId = document.getElementById('autorId').value;

  const res = await fetch(`${API_URL}/libros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, autorId })
  });

  const nuevoLibro = await res.json();
  alert(`Libro agregado: ${nuevoLibro.titulo}`);
  document.getElementById('titulo').value = '';
  document.getElementById('autorId').value = '';
  buscarLibros();
  obtenerTopLibros();
}

// Ejecutar al cargar
window.onload = () => {
  obtenerTopLibros();
};
