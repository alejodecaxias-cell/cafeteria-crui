const express = require('express');

const app = express();
const PORT = 3000;

// Middleware: permite leer el cuerpo (body) de las peticiones en formato JSON
app.use(express.json());

// Datos iniciales (se guardan en memoria: se pierden al apagar el servidor)
const productos = [
  { id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
  { id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
  { id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
  { id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

// Contador para generar ids nuevos. Así nunca se repite un id,
// ni siquiera después de eliminar productos.
let siguienteId = 5;

// ---------- Funciones auxiliares ----------

// Valida los datos recibidos. Devuelve un mensaje de error o null si todo está bien.
function validarProducto(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return 'El cuerpo de la petición debe ser un objeto JSON';
  }
  if (typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    return 'El nombre es obligatorio y no puede estar vacío';
  }
  // typeof garantiza que no se acepten precios enviados como texto ("1500")
  if (typeof datos.precio !== 'number' || !Number.isFinite(datos.precio) || datos.precio <= 0) {
    return 'El precio debe ser un número mayor que cero';
  }
  if (datos.categoria !== undefined && typeof datos.categoria !== 'string') {
    return 'La categoría, si se envía, debe ser un texto';
  }
  return null;
}

// Busca el índice de un producto por id (o -1 si no existe)
function buscarIndice(idTexto) {
  const id = Number(idTexto);
  return productos.findIndex((p) => p.id === id);
}

// ---------- Rutas ----------

// GET / -> mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de la Cafetería del CRUI!');
});

// GET /api/productos -> lista completa
app.get('/api/productos', (req, res) => {
  res.status(200).json(productos);
});

// GET /api/productos/:id -> un producto
app.get('/api/productos/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(200).json(productos[indice]);
});

// POST /api/productos -> crear
app.post('/api/productos', (req, res) => {
  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  // El id lo genera el servidor (se ignora cualquier id enviado por el cliente)
  const nuevo = {
    id: siguienteId++,
    nombre: req.body.nombre.trim(),
    precio: req.body.precio,
    categoria: req.body.categoria
  };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// PUT /api/productos/:id -> modificar
app.put('/api/productos/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const error = validarProducto(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  // Se conserva el id original y se reemplazan los demás datos
  productos[indice] = {
    id: productos[indice].id,
    nombre: req.body.nombre.trim(),
    precio: req.body.precio,
    categoria: req.body.categoria
  };
  res.status(200).json(productos[indice]);
});

// DELETE /api/productos/:id -> eliminar
app.delete('/api/productos/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const [eliminado] = productos.splice(indice, 1);
  res.status(200).json({ mensaje: 'Producto eliminado', producto: eliminado });
});

// Manejo de errores: si el JSON enviado está mal formado, responder 400 en JSON
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
