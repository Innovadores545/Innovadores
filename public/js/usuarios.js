import { actualizarNombresDeUsuarioEnFavoritos } from './favoritos.js';

export const usuariosMap = {};

export async function cargarUsuarios() {
  const lista = document.getElementById('listaUsuarios');
  lista.textContent = 'Cargando usuarios...';

  try {
    const res = await fetch('/api/usuarios');
    if (!res.ok) throw new Error('Error al cargar usuarios');
    const usuarios = await res.json();

    if (usuarios.length === 0) {
      lista.textContent = 'No hay usuarios disponibles';
      return;
    }

    const table = document.createElement('table');
    table.classList.add('table');
    table.innerHTML = `
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        ${usuarios.map(u => `
          <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>
              <button class="editar-usuario" data-id="${u.id}" data-nombre="${u.nombre}">Editar</button>
              <button class="eliminar-usuario" data-id="${u.id}">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    lista.innerHTML = '';
    lista.appendChild(table);

    usuarios.forEach(u => usuariosMap[u.id] = u.nombre);
    actualizarNombresDeUsuarioEnFavoritos(usuariosMap);

  } catch (err) {
    lista.textContent = 'Error al cargar usuarios: ' + err.message;
  }
}

export async function editarUsuario(id, nombre) {
  try {
    const res = await fetch(`/api/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    if (!res.ok) throw new Error('Error al actualizar usuario');

    alert('Usuario actualizado');
    await cargarUsuarios();

  } catch (err) {
    alert(err.message);
  }
}

export async function eliminarUsuario(id) {
  if (!confirm('¿Eliminar usuario?')) return;
  try {
    const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar usuario');

    alert('Usuario eliminado');
    await cargarUsuarios();

  } catch (err) {
    alert(err.message);
  }
}

export async function guardarUsuario(nombre) {
  if (!nombre) {
    alert('Nombre de usuario vacío');
    return;
  }

  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    if (!res.ok) throw new Error('Error al guardar usuario');

    alert('Usuario guardado');
    await cargarUsuarios();

  } catch (err) {
    alert(err.message);
  }
}

export async function cargarUsuariosEnSelect() {
  const select = document.getElementById('usuarioFavoritoSelect');
  if (!select) return;

  try {
    const res = await fetch('/api/usuarios');
    if (!res.ok) throw new Error('Error al cargar usuarios para select');

    const usuarios = await res.json();

    select.innerHTML = '<option value="">Selecciona usuario</option>';
    usuarios.forEach(u => {
      select.innerHTML += `<option value="${u.id}">${u.nombre}</option>`;
      usuariosMap[u.id] = u.nombre;
    });
  } catch (err) {
    select.innerHTML = '<option value="">Error al cargar usuarios</option>';
  }
}
