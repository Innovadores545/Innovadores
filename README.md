Descripción:
Crear una API REST para gestionar libros, autores y favoritos, con funciones de búsqueda.
Requerimientos funcionales:
CRUD de libros, autores y usuarios.
Relación muchos-a-muchos entre libros y usuarios (favoritos).
Endpoint de búsqueda por título o autor.
Endpoint para top 5 libros más marcados como favoritos.
Base de datos sugerida:
Libros(id, titulo, autor_id)
Autores(id, nombre)
Usuarios(id, nombre)
Favoritos(libro_id, usuario_id)
Reglas de negocio:
Sin duplicados en favoritos.
Búsqueda sensible a múltiples campos.
Objetivo técnico:
Evaluar relaciones complejas, búsquedas eficientes y agregaciones.
