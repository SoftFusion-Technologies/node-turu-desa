/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 /07 /2025
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (CTS_TB_Usuarios.js) contiene controladores CRUD para la tabla usuarios.
 *
 * Tema: Controladores - Usuarios
 *
 * Capa: Backend
 *
 * Nomenclatura: OBR_ obtenerRegistro
 *               OBRS_obtenerRegistros (plural)
 *               CR_ crearRegistro
 *               ER_ eliminarRegistro
 */

import UsuariosModel from '../Models/MD_TB_Usuarios.js';
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios
export const OBRS_Usuarios_CTS = async (req, res) => {
  try {
    const { rol } = req.query;
    const whereClause = rol ? { rol } : {};
    const registros = await UsuariosModel.findAll({ where: whereClause });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};

// Obtener usuario por ID
export const OBR_Usuario_CTS = async (req, res) => {
  try {
    const usuario = await UsuariosModel.findByPk(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};

// Crear nuevo usuario
export const CR_Usuario_CTS = async (req, res) => {
  try {
    const { password, ...resto } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await UsuariosModel.create({
      ...resto,
      password: hashedPassword
    });

    res.json({
      message: 'Usuario creado correctamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};

// Actualizar usuario
export const UR_Usuario_CTS = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado] = await UsuariosModel.update(req.body, {
      where: { id }
    });

    if (actualizado === 1) {
      const usuario = await UsuariosModel.findByPk(id);
      res.json({
        message: 'Usuario actualizado correctamente',
        usuario
      });
    } else {
      res.status(404).json({ mensajeError: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};

// Eliminar usuario
export const ER_Usuario_CTS = async (req, res) => {
  try {
    const { id } = req.params;
    await UsuariosModel.destroy({ where: { id } });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};
