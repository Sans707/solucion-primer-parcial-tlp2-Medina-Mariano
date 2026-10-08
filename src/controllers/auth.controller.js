// * ARCHIVO A COMPLETAR
import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    // TODO: 1. Hashear la password antes de guardarla (hashPassword).
    // TODO: 2. Crear el user y su profile asociado.
    // TODO: 3. Responder con código 201, un mensaje de éxito y devolver el usuario sin la password.
     const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'El email ya está registrado' });

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ username, email, password: hashedPassword, role });
    
    // Creación automática del perfil 
    await Profile.create({ user_id: user.id });

    return res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: user.id, username, email } });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }

 
};

export const login = async (req, res) => {
  try {
    // TODO: 1. Buscar el user por email y comparar la password (comparePassword).
    // TODO: 2. Firmar un JWT con el id y el role del user (signToken).
    // TODO: 3. Guardar el token en una cookie httpOnly llamada "token", responder con código 200 y un mensaje de éxito.
    // ? Considerar qué mensaje devolver ante credenciales inválidas.
     const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = generateToken({ id: user.id, username: user.username, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
 

export const logout = async (_req, res) => {
  
    // TODO: 1. Eliminar la cookie "token" y responder con código 204 sin devolver ningun mensaje.
  try {
    const user = await User.findByPk(req.user.id, {
      include: { model: Profile, as: 'profile' },
      attributes: { exclude: ['password'] }
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
  };
