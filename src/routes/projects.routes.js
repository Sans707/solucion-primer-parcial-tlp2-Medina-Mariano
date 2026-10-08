// * ARCHIVO A COMPLETAR
import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getMyProjects,
  updateProject,
} from "../controllers/projects.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { leaderMiddleware } from "../middlewares/leader.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import {
  createProjectValidation,
  updateProjectValidation,
} from "../middlewares/validations/project.validation.js";

export const projectRoutes = Router();

// TODO: 1. Decidir y aplicar los middlewares que correspondan a cada ruta.

// ? Crear un proyecto: requiere sesión iniciada y datos válidos.
projectRoutes.post(
  "/projects",
  authMiddleware,
  createProjectValidation,
  validator,
  createProject
);

// ? Listar todos los proyectos: solo administrator.
projectRoutes.get(
  "/projects",
  authMiddleware,
  adminMiddleware,
  getAllProjects
);
// ? Listar los proyectos del usuario logueado: requiere sesión iniciada.
projectRoutes.get(
  "/projects/my-projects",
  authMiddleware,
  getMyProjects
);
// ? Editar un proyecto: solo su líder y con datos válidos.
projectRoutes.put(
  "/projects/:id",
  authMiddleware,
  leaderMiddleware,
  updateProjectValidation,
  validator,
  updateProject
);
// ? Eliminar un proyecto: solo su líder.
projectRoutes.delete(
  "/projects/:id",
  authMiddleware,
  leaderMiddleware,
  deleteProject
);




