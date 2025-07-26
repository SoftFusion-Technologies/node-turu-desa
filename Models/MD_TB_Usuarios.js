/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 07 / 2025
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (MD_TB_Usuarios.js) contiene la definición del modelo Sequelize
 * para la tabla usuarios del sistema SoftPay.
 *
 * Tema: Modelos - Usuarios
 *
 * Capa: Backend
 */

import dotenv from 'dotenv';
import db from '../DataBase/db.js';
import { DataTypes } from 'sequelize';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const UsuariosModel = db.define(
  'usuarios',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(50),
      defaultValue: 'admin'
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'activo'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'usuarios'
  }
);

export default UsuariosModel;
