# Centurion – Medication Request Management API

REST API built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL** (via **Sequelize**) to manage the request and distribution of medications between **clinics** and **warehouses**.

It allows managing clinics, users, warehouses, medications, inventory, and the complete lifecycle of a request (creation, status tracking, and delivery).

## Table of Contents

- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Main Endpoints](#main-endpoints)
- [File Upload (Multer)](#file-upload-multer)
- [Data Model](#data-model)

## Technologies

- **Node.js** + **TypeScript**
- **Express 5**
- **Sequelize** + **PostgreSQL** (`pg`, `pg-hstore`)
- **JWT** (`jsonwebtoken`) for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Zod** / **express-validator** for validations
- **tsx** to execute TypeScript in development without a prior compilation step
- **Docker Compose** to run PostgreSQL locally

## Project Structure

```
PD/
├── docker-compose.yml        # Local PostgreSQL (container "postgres-centurion")
├── package.json
├── tsconfig.json
├── .env                       # Environment variables (do not version in a real project)
└── src/
    ├── app.ts                 # Express configuration and route mounting
    ├── server.ts               # Entry point: connects DB and starts the server
    ├── config/
    │   └── db.ts               # Sequelize instance
    ├── controllers/
    │   ├── clinic.controller.ts
    │   ├── login.controller.ts
    │   ├── medicamento.controller.ts
    │   ├── solicitud.controller.ts
    │   ├── storage.controller.ts     # Warehouse CRUD
    │   └── user.controller.ts
    ├── middlewares/
    │   ├── auth.middleware.ts        # isAuth / isAdmin (JWT)
    │   ├── upload.ts                  # Multer configuration
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
    │   ├── relations.model.ts         # Associations between all models
    │   ├── sa.model.ts                 # Request (Solicitud) and RequestDetail
    │   └── user.model.ts
    ├── routes/
    │   ├── clinica.route.ts
    │   └── user.route.ts
    └── seeders/                        # Test data (executed in order 01-09)
```

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (for the PostgreSQL database)

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL database with Docker
docker compose up -d

# 3. (Optional) Populate the database with test data
npm run seed

# 4. Start the server in development mode
npm run dev
```

## Environment Variables

Create a `.env` file in the root of the project (already included as an example) with the following variables:

| Variable            | Description                                  | Example       |
|---------------------|-----------------------------------------------|---------------|
| `PORT`              | Port where the server runs                    | `3000`        |
| `DATABASE_HOST`     | PostgreSQL host                               | `localhost`   |
| `DB_PORT`           | PostgreSQL port                               | `5432`        |
| `DATABASE_USER`     | Database user                                 | `admin`       |
| `DATABASE_PASSWORD` | Database password                             | `admin123`    |
| `DATABASE_NAME`     | Database name                                 | `centurion`   |
| `JWT_SECRET`        | Secret key used to sign JWT tokens            | —             |
| `JWT_EXPIRES_IN`    | Token expiration time                         | `24h`         |

> ⚠️ In a real environment, `.env` should not be pushed to the repository nor contain real credentials. Use `.env.example` as a reference.

## Database

The `postgres` service defined in `docker-compose.yml` spins up a `postgres-centurion` container with the credentials configured in the file itself (they must match the ones in `.env`). Upon startup (`npm run server` / `npm run dev`), `server.ts` connects to the database and runs `sequelize.sync({ alter: true })`, adjusting the tables to the models without deleting existing data.

## Available Scripts

| Script          | Command                    | Description                                              |
|------------------|-----------------------------|-----------------------------------------------------------|
| `npm run dev`    | `tsx watch src/app.ts`      | Starts Express with auto-reload (only routes/app)         |
| `npm run server` | `tsx src/server.ts`         | Connects to DB, syncs models, and starts the server       |
| `npm run seed`   | `tsx src/seeders/index.ts`  | Executes seeders (01 to 09) to populate test data         |

> Note: `npm run dev` does not connect the database by itself (that happens in `server.ts`). To work with actual persistence, use `npm run server`, or integrate both flows into `app.ts` as appropriate.

## Authentication

Authentication is handled with JWT:

1. `POST` to a login endpoint (see `login.controller.ts`) with `email` and `password`.
2. The server responds with a signed `token` (`JWT_SECRET`, expires in 8h).
3. Protected routes require the header:

```
Authorization: Bearer <token>
```

- `isAuth`: Validates that the token exists and is valid.
- `isAdmin`: Additionally requires that the user's role (`req.user.rol`) is `admin`.

## Main Endpoints

All clinic routes are mounted under `/api/clinica` (and additionally, without strict authentication at the mounting level, under `/almacenes`, `/medicamentos`, and `/solicitudes`; check `app.ts` if you need to adjust this).

### Users — `/api/users`
| Method | Route          | Description            |
|--------|----------------|-------------------------|
| GET    | `/`            | List users              |
| GET    | `/:id`         | Get user by ID          |
| POST   | `/`            | Create user             |
| PUT    | `/:id`         | Update user             |
| DELETE | `/:id`         | Delete user             |

### Clinics — `/api/clinica/clinicas` (requires `isAuth` + `isAdmin`)
| Method | Route   | Description       |
|--------|---------|--------------------|
| POST   | `/`     | Create clinic      |
| GET    | `/`     | List clinics       |
| PUT    | `/:id`  | Update clinic      |
| DELETE | `/:id`  | Delete clinic      |

### Warehouses — `/api/clinica/almacenes` (requires `isAuth` + `isAdmin`)
Full CRUD, analogous to clinics.

### Medications — `/api/clinica/medicamentos` (requires `isAuth` + `isAdmin`)
| Method | Route                | Description                              |
|--------|----------------------|--------------------------------------------|
| POST   | `/`                  | Create medication                          |
| GET    | `/`                  | List medications                           |
| PUT    | `/:id`               | Update medication                          |
| DELETE | `/:id`               | Delete medication                          |
| POST   | `/importar`          | Import medications from a JSON file (see Multer section) |

### Requests (Solicitudes) — `/api/clinica/solicitudes`
| Method | Route                                    | Permission         | Description                                      |
|--------|------------------------------------------|--------------------|--------------------------------------------------|
| GET    | `/activas`                               | `isAuth`           | List active requests (not delivered/canceled)    |
| GET    | `/clinicas/:clinica_id/solicitudes`      | `isAuth`           | Request history for a specific clinic            |
| POST   | `/solicitudes`                           | `isAuth`           | Create a request (request manager role)          |
| POST   | `/solicitudes`                           | `isAuth`+`isAdmin` | Create request (via administration)              |
| PUT    | `/solicitudes/:id`                       | `isAuth`+`isAdmin` | Update a request's status                        |
| DELETE | `/solicitudes/:id`                       | `isAuth`+`isAdmin` | Delete a request                                 |

## File Upload (Multer)

The middleware `src/middlewares/upload.ts` configures **Multer** to receive files in memory (`multer.memoryStorage()`), without writing them to disk, as they are processed on the fly and then discarded.

**Middleware rules:**

- Only accepts `.json` files (validates mimetype `application/json` or `.json` extension).
- Size limit: **5MB**.
- Quantity limit: **1 file** per request.
- Includes `handleUploadErrors`, an error handling middleware that translates Multer errors (`LIMIT_FILE_SIZE`, `LIMIT_UNEXPECTED_FILE`, etc.) into readable `400` client responses.

**Example Endpoint — Import medications:**

```
POST /api/clinica/medicamentos/importar
Authorization: Bearer <token>
Content-Type: multipart/form-data
File Field: "archivo"
```

The file must contain a JSON array of medications:

```json
[
  { "nombre": "Acetaminofén", "descripcion": "Analgésico y antipirético" },
  { "nombre": "Ibuprofeno", "descripcion": "Antiinflamatorio no esteroideo" }
]
```

Example with `curl`:

```bash
curl -X POST http://localhost:3000/api/clinica/medicamentos/importar   -H "Authorization: Bearer <token>"   -F "archivo=@medicamentos.json"
```

**Reusing the middleware on another route:**

```ts
import { upload, handleUploadErrors } from '../middlewares/upload';

router.post(
  '/another-route',
  isAuth,
  isAdmin,
  upload.single('archivo'),   // 'archivo' = form field name
  handleUploadErrors,
  myController
);
```

Inside the controller, the file is available as `req.file` (buffer in `req.file.buffer`), ready to be parsed or processed without touching the filesystem.

## Data Model

Main relationships (defined in `src/models/relations.model.ts`):

- **Clinic** 1—N **Request** (Solicitud)
- **Warehouse** 1—N **Request**
- **Request** N—M **Medication** through **RequestDetail** (includes `cantidad_solicitada` / requested quantity)
- **User** belongs to a **Clinic** and has a **DNI**
- **Inventory** relates **Warehouse** and **Medication** with a `cantidad` (quantity)

Possible request statuses: `Pending` (Pendiente), `Assigned` (Asignada), `On the Way` (En Camino), `Delivered` (Entregada), `Canceled` (Cancelada).

---

Project in development — some routes (e.g., login) are not yet mounted in `app.ts` and need to be integrated as the project progresses.
