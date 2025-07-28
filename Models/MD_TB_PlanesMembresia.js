/*
 * Programador: Benjamin Orellana
 * Fecha: 08 / 08 / 2025
 * Modelo: planes_membresia
 */

import { DataTypes } from 'sequelize';
import db from '../DataBase/db.js';

const PlanesMembresiaModel = db.define(
  'planes_membresia',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duracion_dias: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'planes_membresia',
    timestamps: false
  }
);

export default PlanesMembresiaModel;
