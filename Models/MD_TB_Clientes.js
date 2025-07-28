/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 26 / 07 / 2025
 * Versión: 1.0
 *
 * Descripción:
 * Modelo Sequelize que representa la tabla 'clientes' del sistema de acceso
 * al gimnasio. Registra información personal, estado, fechas de ingreso y vencimiento.
 *
 * Capa: Backend
 */

import dotenv from 'dotenv';
import db from '../DataBase/db.js';
import { DataTypes } from 'sequelize';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const ClientesModel = db.define(
  'clientes',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    pagado: {
      type: DataTypes.ENUM('SI', 'NO'),
      allowNull: false,
      defaultValue: 'NO'
    },
    tipo_membresia: {
      type: DataTypes.ENUM('mensual', 'quincenal', 'diaria', 'personalizada'),
      allowNull: false,
      defaultValue: 'mensual'
    },
    fecha_inscripcion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ultima_notificacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fecha_alta: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo', 'suspendido', 'moroso'),
      allowNull: false,
      defaultValue: 'activo'
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    origen: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    notificacion_whatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'planes_membresia',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'clientes',
    timestamps: false
  }
);

export default ClientesModel;
