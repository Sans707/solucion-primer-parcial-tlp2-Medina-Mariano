// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  // ? Las unicidades requieren una validación personalizada asíncrona.
   body("username")
      .notEmpty()
      .withMessage("El username es obligatorio")
      .isLength({ min: 3, max: 20 })
      .withMessage("El username debe tener entre 3 y 20 caracteres")
      .isAlphanumeric()
      .withMessage("El username debe ser alfanumérico")
      .custom(async (username) => {
        const user = await UserModel.findOne({
          where: { username },
          paranoid: false,
        });
  
        if (user) {
          throw new Error("El username ya existe");
        }
  
        return true;
      }),
  
    body("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email no es válido")
      .custom(async (email) => {
        const user = await UserModel.findOne({
          where: { email },
          paranoid: false,
        });
  
        if (user) {
          throw new Error("El email ya existe");
        }
  
        return true;
      }),
  
    body("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener mínimo 8 caracteres")
      .matches(/[A-Z]/)
      .withMessage("La contraseña debe tener una mayúscula")
      .matches(/[a-z]/)
      .withMessage("La contraseña debe tener una minúscula")
      .matches(/[0-9]/)
      .withMessage("La contraseña debe tener un número"),
  
    body("role")
      .optional()
      .isIn(["developer", "administrator"])
      .withMessage("El rol debe ser developer o administrator"),
  
    body("profile.employee_number")
      .notEmpty()
      .withMessage("El número de empleado es obligatorio")
      .custom(async (employee_number) => {
        const profile = await ProfileModel.findOne({
          where: { employee_number },
        });
  
        if (profile) {
          throw new Error("El número de empleado ya existe");
        }
  
        return true;
      }),
  
    body("profile.first_name")
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
      .withMessage("El nombre solo puede contener letras"),
  
    body("profile.last_name")
      .notEmpty()
      .withMessage("El apellido es obligatorio")
      .isLength({ min: 2, max: 50 })
      .withMessage("El apellido debe tener entre 2 y 50 caracteres")
      .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
      .withMessage("El apellido solo puede contener letras"),
  
    body("profile.phone")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("El teléfono no es válido"),
  ];


export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  // TODO: 8. Validar password: obligatoria.
   body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener mínimo 8 caracteres"),
];

