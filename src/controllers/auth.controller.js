// * ARCHIVO A COMPLETAR
import { UniqueConstraintError } from "sequelize";
import { sequelize } from "../config/db.js";
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    const { username, email, password, role = "developer", profile } = req.body;
    const hashedPassword = await hashPassword(password);

    // TODO: 2. Crear el user y su profile asociado.
    const user = await sequelize.transaction(async (transaction) => {
      const newUser = await UserModel.create(
        { username, email, password: hashedPassword, role },
        { transaction }
      );
      // Creación automática del perfil 
      await ProfileModel.create(
        {
          user_id: newUser.id,
          employee_number: profile.employee_number,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone || null,
        },
        { transaction }
      );
      return newUser;
    });

    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
    const created = await UserModel.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: ProfileModel, as: "profile" }],
    });
    return res.status(201).json({ msg: "Usuario registrado exitosamente", data: created });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({ msg: "Usuario, email o número de empleado ya registrado" });
    }
    console.error("Error en register:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};