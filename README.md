# Sistema de Gestión de Proyectos de Software

API REST desarrollada con **Node.js, Express, Sequelize y MySQL** para administrar usuarios, proyectos y tecnologías.

## Instalación

1. Instalar dependencias con `npm install`.
2. Crear la base de datos `gestion_proyectos` en MySQL.
3. Copiar `.env.example` a `.env` y configurar las variables.
4. Iniciar el servidor con `npm run dev`.
5. Importar la colección de Postman para probar los endpoints.

## Funcionalidades

- Registro, inicio y cierre de sesión.
- Gestión de usuarios y tecnologías.
- Creación, consulta, edición y eliminación de proyectos.
- Autenticación mediante JWT y cookies.
- Permisos según el rol del usuario.

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/logout` | Autenticado |
| GET | `/api/users` | Administrador |
| DELETE | `/api/users/:id` | Administrador |
| POST | `/api/technologies` | Administrador |
| GET | `/api/technologies` | Autenticado |
| DELETE | `/api/technologies/:id` | Administrador |
| POST | `/api/projects` | Autenticado |
| GET | `/api/projects` | Administrador |
| GET | `/api/projects/my-projects` | Autenticado |
| PUT | `/api/projects/:id` | Líder |
| DELETE | `/api/projects/:id` | Líder |

## Pruebas

Los endpoints pueden probarse utilizando **Postman** con el servidor en `http://localhost:3005`.

El archivo `.env` no debe subirse a GitHub porque contiene información privada.
