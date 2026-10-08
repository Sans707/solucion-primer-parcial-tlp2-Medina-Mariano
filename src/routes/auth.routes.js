// * ARCHIVO A COMPLETAR
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validations/auth.validation.js";

export const authRoutes = Router();

// TODO: 1. Decidir y aplicar los middlewares que correspondan a cada ruta.


// ? Registro de usuario: acceso público.
authRoutes.post(
  "/auth/register",
  registerValidation,
  validator,
  register
);
// ? Cierre de sesión: requiere sesión iniciada.
authRoutes.post(
  "/auth/login",
  loginValidation,
  validator,
  login
);
// src/routes/auth.routes.js
authRoutes.post(
  "/auth/logout",
  authMiddleware,
  logout
);