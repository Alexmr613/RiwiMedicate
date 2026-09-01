# Centurion – API de Gestión de Solicitudes de Medicamentos

API REST construida con **Node.js**, **TypeScript**, **Express** y **PostgreSQL** (vía **Sequelize**) para gestionar la solicitud y distribución de medicamentos entre **clínicas** y **almacenes**.

Permite administrar clínicas, usuarios, almacenes, medicamentos, inventario y el ciclo de vida completo de una solicitud (creación, seguimiento de estado y entrega).

## Tabla de contenido

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Scripts disponibles](#scripts-disponibles)
- [Autenticación](#autenticación)
- [Endpoints principales](#endpoints-principales)
- [Carga de archivos (Multer)](#carga-de-archivos-multer)
- [Modelo de datos](#modelo-de-datos)

## Tecnologías

- **Node.js** + **TypeScript**
- **Express 5**
- **Sequelize** + **PostgreSQL** (`pg`, `pg-hstore`)
- **JWT** (`jsonwebtoken`) para autenticación
- **bcrypt** para el hash de contraseñas
- **Multer** para la carga de archivos
- **Zod** / **express-validator** para validaciones
- **tsx** para ejecutar TypeScript en desarrollo sin paso de compilación previo
- **Docker Compose** para levantar PostgreSQL localmente

## Estructura del proyecto

```
PD/
├── docker-compose.yml        # PostgreSQL local (contenedor "postgres-centurion")
├── package.json
├── tsconfig.json
├── .env                       # Variables de entorno (no versionar en un proyecto real)
└── src/
    ├── app.ts                 # Configuración de Express y montaje de rutas
    ├── server.ts               # Punto de entrada: conecta la BD y levanta el servidor
    ├── config/
    │   └── db.ts               # Instancia de Sequelize
    ├── controllers/
    │   ├── clinic.controller.ts
    │   ├── login.controller.ts
    │   ├── medicamento.controller.ts
    │   ├── solicitud.controller.ts
    │   ├── storage.controller.ts     # CRUD de Almacenes
    │   └── user.controller.ts
    ├── middlewares/
    │   ├── auth.middleware.ts        # isAuth / isAdmin (JWT)
    │   ├── upload.ts                  # Configuración de Multer
    │   ├── validatemedi.middleware.ts
    │   ├── validatenit.middleware.ts
    │   └── validatestate.middleware.ts
    ├── models/
    │   ├── address.model.ts
    │   ├── almacen.model.ts
    │   ├── clinica.model.ts
    │   ├── dni.model.ts
    │   ├── inventario.model.ts
    │   ├── medicamento.model.ts
    │   ├── relations.model.ts         # Asociaciones entre todos los modelos
    │   ├── sa.model.ts                 # Solicitud y DetalleSolicitud
    │   └── user.model.ts
    ├── routes/
    │   ├── clinica.route.ts
    │   └── user.route.ts
    └── seeders/                        # Datos de prueba (se ejecutan en orden 01-09)
```

## Requisitos previos

- Node.js 18 o superior
- Docker y Docker Compose (para la base de datos PostgreSQL)

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar la base de datos PostgreSQL con Docker
docker compose up -d

# 3. (Opcional) Poblar la base de datos con datos de prueba
npm run seed

# 4. Levantar el servidor en modo desarrollo
npm run dev
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (ya incluido como ejemplo) con las siguientes variables:

| Variable            | Descripción                                  | Ejemplo       |
|---------------------|-----------------------------------------------|---------------|
| `PORT`              | Puerto en el que corre el servidor            | `3000`        |
| `DATABASE_HOST`     | Host de PostgreSQL                            | `localhost`   |
| `DB_PORT`           | Puerto de PostgreSQL                          | `5432`        |
| `DATABASE_USER`     | Usuario de la base de datos                   | `admin`       |
| `DATABASE_PASSWORD` | Contraseña de la base de datos                | `admin123`    |
| `DATABASE_NAME`     | Nombre de la base de datos                    | `centurion`   |
| `JWT_SECRET`        | Llave secreta usada para firmar los tokens JWT| —             |
| `JWT_EXPIRES_IN`    | Tiempo de expiración del token                | `24h`         |

> ⚠️ En un entorno real, `.env` no debería subirse al repositorio ni contener credenciales reales. Usa `.env.example` como referencia.

## Base de datos

El servicio `postgres` definido en `docker-compose.yml` levanta un contenedor `postgres-centurion` con las credenciales configuradas en el propio archivo (deben coincidir con las de `.env`). Al iniciar (`npm run server` / `npm run dev`), `server.ts` se conecta a la base de datos y ejecuta `sequelize.sync({ alter: true })`, ajustando las tablas a los modelos sin borrar los datos existentes.

## Scripts disponibles

| Script          | Comando                    | Descripción                                              |
|------------------|-----------------------------|-----------------------------------------------------------|
| `npm run dev`    | `tsx watch src/app.ts`      | Levanta Express con recarga automática (solo rutas/app)   |
| `npm run server` | `tsx src/server.ts`         | Conecta a la base de datos, sincroniza modelos y levanta el servidor |
| `npm run seed`   | `tsx src/seeders/index.ts`  | Ejecuta los seeders (01 a 09) para poblar datos de prueba  |

> Nota: `npm run dev` no conecta la base de datos por sí solo (eso ocurre en `server.ts`). Para trabajar con persistencia real usa `npm run server`, o integra ambos flujos en `app.ts` según convenga.

## Autenticación

La autenticación se maneja con JWT:

1. `POST` a un endpoint de login (ver `login.controller.ts`) con `email` y `password`.
2. El servidor responde con un `token` firmado (`JWT_SECRET`, expira en 8h).
3. Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

- `isAuth`: valida que el token exista y sea válido.
- `isAdmin`: exige además que el rol del usuario (`req.user.rol`) sea `admin`.

## Endpoints principales

Todas las rutas de clínica están montadas bajo `/api/clinica` (y de forma adicional, sin autenticación estricta a nivel de montaje, bajo `/almacenes`, `/medicamentos` y `/solicitudes`; revisa `app.ts` si necesitas ajustar esto).

### Usuarios — `/api/users`
| Método | Ruta          | Descripción            |
|--------|----------------|-------------------------|
| GET    | `/`            | Listar usuarios         |
| GET    | `/:id`         | Obtener usuario por ID  |
| POST   | `/`            | Crear usuario           |
| PUT    | `/:id`         | Actualizar usuario      |
| DELETE | `/:id`         | Eliminar usuario        |

### Clínicas — `/api/clinica/clinicas` (requiere `isAuth` + `isAdmin`)
| Método | Ruta   | Descripción       |
|--------|---------|--------------------|
| POST   | `/`     | Crear clínica       |
| GET    | `/`     | Listar clínicas     |
| PUT    | `/:id`  | Actualizar clínica  |
| DELETE | `/:id`  | Eliminar clínica    |

### Almacenes — `/api/clinica/almacenes` (requiere `isAuth` + `isAdmin`)
CRUD completo, análogo al de clínicas.

### Medicamentos — `/api/clinica/medicamentos` (requiere `isAuth` + `isAdmin`)
| Método | Ruta                | Descripción                              |
|--------|----------------------|--------------------------------------------|
| POST   | `/`                  | Crear medicamento                          |
| GET    | `/`                  | Listar medicamentos                        |
| PUT    | `/:id`               | Actualizar medicamento                     |
| DELETE | `/:id`               | Eliminar medicamento                       |
| POST   | `/importar`          | Importar medicamentos desde un archivo JSON (ver sección Multer) |

### Solicitudes — `/api/clinica/solicitudes`
| Método | Ruta                                   | Permiso           | Descripción                                    |
|--------|------------------------------------------|--------------------|--------------------------------------------------|
| GET    | `/activas`                               | `isAuth`           | Listar solicitudes activas (no entregadas/canceladas) |
| GET    | `/clinicas/:clinica_id/solicitudes`      | `isAuth`           | Historial de solicitudes de una clínica           |
| POST   | `/solicitudes`                           | `isAuth`           | Crear una solicitud (rol gestor de solicitudes)   |
| POST   | `/solicitudes`                           | `isAuth`+`isAdmin` | Crear solicitud (vía administración)              |
| PUT    | `/solicitudes/:id`                       | `isAuth`+`isAdmin` | Actualizar el estado de una solicitud             |
| DELETE | `/solicitudes/:id`                       | `isAuth`+`isAdmin` | Eliminar una solicitud                            |

## Carga de archivos (Multer)

El middleware `src/middlewares/upload.ts` configura **Multer** para recibir archivos en memoria (`multer.memoryStorage()`), sin escribirlos a disco, ya que se procesan al vuelo y se descartan.

**Reglas del middleware:**

- Solo acepta archivos `.json` (valida mimetype `application/json` o extensión `.json`).
- Límite de tamaño: **5MB**.
- Límite de cantidad: **1 archivo** por petición.
- Incluye `handleUploadErrors`, un middleware de manejo de errores que traduce los errores de Multer (`LIMIT_FILE_SIZE`, `LIMIT_UNEXPECTED_FILE`, etc.) en respuestas `400` legibles para el cliente.

**Endpoint de ejemplo — importar medicamentos:**

```
POST /api/clinica/medicamentos/importar
Authorization: Bearer <token>
Content-Type: multipart/form-data
Campo del archivo: "archivo"
```

El archivo debe contener un arreglo JSON de medicamentos:

```json
[
  { "nombre": "Acetaminofén", "descripcion": "Analgésico y antipirético" },
  { "nombre": "Ibuprofeno", "descripcion": "Antiinflamatorio no esteroideo" }
]
```

Ejemplo con `curl`:

```bash
curl -X POST http://localhost:3000/api/clinica/medicamentos/importar \
  -H "Authorization: Bearer <token>" \
  -F "archivo=@medicamentos.json"
```

**Reutilizar el middleware en otra ruta:**

```ts
import { upload, handleUploadErrors } from '../middlewares/upload';

router.post(
  '/otra-ruta',
  isAuth,
  isAdmin,
  upload.single('archivo'),   // 'archivo' = nombre del campo del formulario
  handleUploadErrors,
  miControlador
);
```

Dentro del controlador, el archivo queda disponible como `req.file` (buffer en `req.file.buffer`), listo para parsear o procesar sin tocar el sistema de archivos.

## Modelo de datos

Relaciones principales (definidas en `src/models/relations.model.ts`):

- **Clínica** 1—N **Solicitud**
- **Almacén** 1—N **Solicitud**
- **Solicitud** N—M **Medicamento** a través de **DetalleSolicitud** (incluye `cantidad_solicitada`)
- **Usuario** pertenece a una **Clínica** y tiene un **DNI**
- **Inventario** relaciona **Almacén** y **Medicamento** con una `cantidad`

Estados posibles de una solicitud: `Pendiente`, `Asignada`, `En Camino`, `Entregada`, `Cancelada`.

---

Proyecto en desarrollo — algunas rutas (por ejemplo, login) aún no están montadas en `app.ts` y deben integrarse a medida que el proyecto avance.
