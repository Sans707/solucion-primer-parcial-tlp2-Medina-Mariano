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

export const login = async (req, res) => {
  try {
    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    // ? Considerar qué mensaje devolver ante credenciales inválidas.
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    const token = signToken({ id: user.id, role: user.role });

    // TODO: 3. Guardar el token en una cookie httpOnly llamada "token", responder con código 200 y un mensaje de éxito.
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({ msg: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res.status(204).send();
};
