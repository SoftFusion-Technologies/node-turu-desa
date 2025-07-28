/*
 * Programador: Benjamin Orellana
 * Fecha: 26 / 07 / 2025
 * Modelo: accesos
 */

import { DataTypes } from 'sequelize';
import db from '../DataBase/db.js';
import ClientesModel from './MD_TB_Clientes.js';

const AccesosModel = db.define(
  'accesos',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tipo_acceso: {
      type: DataTypes.ENUM('normal', 'invitado', 'evento', 'prueba'),
      allowNull: false,
      defaultValue: 'normal'
    }
  },
  {
    tableName: 'accesos',
    timestamps: false
  }
);

// Asociación
AccesosModel.belongsTo(ClientesModel, { foreignKey: 'cliente_id' });
ClientesModel.hasMany(AccesosModel, { foreignKey: 'cliente_id' });

export default AccesosModel;
