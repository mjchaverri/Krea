# Krea — Backend API

API REST para la plataforma Krea, construida con Node.js, Express y Sequelize (MySQL).

## Requisitos

- Node.js 18+
- MySQL 8+

## Instalación

```bash
cd back_end
npm install
```

Crear el archivo `.env` en la raíz de `back_end/` (ver `.env.example`):

```env
PORT=3000
DB_NAME=krea
DB_USER=root
DB_PASS=root
DB_HOST=127.0.0.1
DB_DIALECT=mysql
JWT_SECRET=krea_secret_key_2026
JWT_EXPIRES_IN=8h
```

Crear la base de datos y ejecutar migraciones:

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

Iniciar el servidor:

```bash
npm start
# o en desarrollo:
npm run dev
```

## Documentación interactiva

Con el servidor corriendo, visita:

```
http://localhost:3000/api/docs
```

## Endpoints principales

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/usuarios/register` | Público | Registrar usuario |
| POST | `/usuarios/login` | Público | Iniciar sesión |
| POST | `/usuarios/logout` | Autenticado | Cerrar sesión |
| GET | `/convocatorias?buscar=X&page=1&limit=10` | Público | Listar convocatorias |
| POST | `/convocatorias` | empresa / admin | Crear convocatoria |
| GET | `/portafolios?buscar=X&page=1&limit=10` | Público | Listar portafolios |
| GET | `/comunidades?page=1&limit=10` | Público | Listar comunidades |
| GET | `/chat-comunidad/:id_comunidad` | Autenticado | Mensajes de una comunidad |

## Formato de respuesta

Todas las respuestas siguen el mismo formato:

```json
{
  "status": 200,
  "message": "OK",
  "data": [...],
  "meta": { "total": 50, "page": 1, "limit": 10, "pages": 5 }
}
```

## Autenticación

Incluir el token JWT en el header:

```
Authorization: Bearer <token>
```

## Roles

| Rol | Permisos especiales |
|-----|---------------------|
| `personal` | Crear portafolios, reseñas, unirse a comunidades |
| `empresa` | CRUD de convocatorias y comunidades |
| `admin` | Todo, incluyendo eliminar usuarios |

## Paginación y búsqueda

Los endpoints de lista aceptan:
- `?page=1` — página (default: 1)
- `?limit=10` — resultados por página (default: 10, máximo: 100)
- `?buscar=texto` — búsqueda por nombre/título (convocatorias, portafolios)

## Estructura del proyecto

```
back_end/src/
├── config/         # Configuración de DB y Swagger
├── controllers/    # Lógica de negocio
├── middlewares/    # Auth y roles
├── migrations/     # Migraciones Sequelize
├── models/         # Modelos Sequelize
├── routes/         # Definición de rutas + JSDoc
├── validators/     # Reglas de express-validator
└── index.js        # Relaciones entre modelos
```
