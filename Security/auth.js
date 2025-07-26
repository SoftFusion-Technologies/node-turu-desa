/*
 * Programador: Benjamin Orellana
 * Fecha actualización: 14 / 07 / 2025
 *
 * Descripción:
 * Autenticación con JWT basada en la tabla 'usuarios'.
 * Incluye hashing con bcryptjs.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UsuariosModel from '../Models/MD_TB_Usuarios.js';

// 🔐 Login con verificación de contraseña hasheada
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await UsuariosModel.findOne({ where: { email } });

    if (!usuario) {
      return res.json({ message: 'Fail', error: 'Usuario no encontrado' });
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecto) {
      return res.json({ message: 'Fail', error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol
      },
      'softfusion',
      {
        expiresIn: '1h'
      }
    );

    return res.json({
      message: 'Success',
      token,
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.json({
      message: 'Fail',
      error: 'Error interno del servidor'
    });
  }
};

// 🔐 Middleware para proteger rutas
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: Bearer TOKEN

  if (!token) return res.sendStatus(401); // No autorizado

  jwt.verify(token, 'softfusion', (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user;
    next();
  });
};
