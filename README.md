# Mini API de la Cafetería del CRUI

API REST hecha con Node.js y Express para consultar y administrar los productos del menú de la cafetería. Los datos se guardan en un array en memoria (se pierden al detener el servidor).

## Requisitos
- Node.js 18 o superior
- npm

## Instalación y ejecución
```bash
npm install
npm start
```
El servidor queda escuchando en http://localhost:3000

## Rutas

| Método | Ruta | Descripción | Respuestas |
|--------|------|-------------|------------|
| GET | `/` | Mensaje de bienvenida | 200 |
| GET | `/api/productos` | Lista todos los productos | 200 |
| GET | `/api/productos/:id` | Busca un producto por id | 200 / 404 |
| POST | `/api/productos` | Crea un producto | 201 / 400 |
| PUT | `/api/productos/:id` | Modifica un producto | 200 / 400 / 404 |
| DELETE | `/api/productos/:id` | Elimina un producto | 200 / 404 |

### Cuerpo para POST y PUT
```json
{ "nombre": "Jugo de naranja", "precio": 2000, "categoria": "bebida" }
```
- `nombre`: texto obligatorio, no vacío.
- `precio`: número mayor que cero (no se acepta texto).
- `categoria`: texto opcional.
- El `id` lo genera el servidor.

## Pruebas
El archivo `pruebas.http` contiene todas las peticiones (compatible con Visual REST Client / REST Client). Las capturas están en la carpeta `capturas/`.
