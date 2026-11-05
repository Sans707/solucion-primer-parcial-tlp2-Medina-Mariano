// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  body("username")
    .isString().withMessage("El username es obligatorio").bail()
    .trim().isLength({ min: 3, max: 20 }).withMessage("El username debe tener de 3 a 20 caracteres")
    .isAlphanumeric().withMessage("El username debe ser alfanumérico")
    .custom(async (username) => {
      const exists = await UserModel.findOne({ where: { username }, paranoid: false });
      if (exists) throw new Error("El username ya existe");
      return true;
    }),

  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  body("email")
    .isEmail().withMessage("El email no es válido").bail()
    .normalizeEmail()
    .custom(async (email) => {
      const exists = await UserModel.findOne({ where: { email }, paranoid: false });
      if (exists) throw new Error("El email ya existe");
      return true;
    }),

  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  body("password")
    .isString().withMessage("La contraseña es obligatoria").bail()
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/).withMessage("Debe incluir una mayúscula")
    .matches(/[a-z]/).withMessage("Debe incluir una minúscula")
    .matches(/[0-9]/).withMessage("Debe incluir un número"),

  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  body("role")
    .optional().isIn(["developer", "administrator"])
    .withMessage("El rol debe ser developer o administrator"),

  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  body("profile").isObject().withMessage("El perfil es obligatorio"),
  body("profile.employee_number")
    .isString().withMessage("El número de empleado es obligatorio").bail()
    .trim()
    .matches(/^EMP-[0-9]{4,6}$/).withMessage("Formato esperado: EMP-0001")
    .custom(async (employee_number) => {
      const exists = await ProfileModel.findOne({ where: { employee_number } });
      if (exists) throw new Error("El número de empleado ya existe");
      return true;
    }),

  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  body("profile.first_name")
    .isString().withMessage("El nombre es obligatorio").bail()
    .trim().isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[\s'-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/).withMessage("El nombre solo puede contener letras"),
  body("profile.last_name")
    .isString().withMessage("El apellido es obligatorio").bail()
    .trim().isLength({ min: 2, max: 50 }).withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[\s'-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/).withMessage("El apellido solo puede contener letras"),
  body("profile.phone")
    .optional({ values: "falsy" })
    .isString().withMessage("El teléfono debe ser texto").bail()
    .matches(/^\+?[0-9][0-9\s()\-]{6,19}$/).withMessage("El teléfono no es válido"),

  // ? Las unicidades requieren una validación personalizada asíncrona.
];

export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  body("email")
    .isEmail().withMessage("El email no es válido").bail()
    .normalizeEmail(),

  // TODO: 8. Validar password: obligatoria.
  body("password")
    .isString().withMessage("La contraseña es obligatoria").bail()
    .isLength({ min: 8 }).withMessage("La contraseña debe tener mínimo 8 caracteres"),
];
