/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 26 / 07 / 2025
 * Versión: 1.1
 *
 * Descripción:
 * Controladores CRUD del modelo 'clientes' para el sistema de acceso al gimnasio.
 * Incluye creación, edición, eliminación y búsqueda de clientes.
 *
 * Tema: Controladores - Clientes
 * Capa: Backend
 *
 * Nomenclatura: OBR_ obtenerRegistro
 *               OBRS_obtenerRegistros (plural)
 *               CR_ crearRegistro
 *               ER_ eliminarRegistro
 */

import ClientesModel from '../Models/MD_TB_Clientes.js';

// ✅ Obtener todos los clientes (con filtro por estado opcional)
export const OBRS_Clientes_CTS = async (req, res) => {
  try {
    const { estado } = req.query;
    const whereClause = {};
    if (estado) whereClause.estado = estado;

    const registros = await ClientesModel.findAll({ where: whereClause });
    res.json(registros);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ mensajeError: 'Error al obtener clientes' });
  }
};

// ✅ Obtener un cliente por ID
export const OBR_Cliente_CTS = async (req, res) => {
  try {
    const cliente = await ClientesModel.findByPk(req.params.id);
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ mensajeError: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};

// ✅ Obtener un cliente por DNI (para ingreso por pantalla de tótem)
export const OBR_ClientePorDNI_CTS = async (req, res) => {
  try {
    const { dni } = req.params;
    const cliente = await ClientesModel.findOne({ where: { dni } });

    if (!cliente) {
      return res.status(404).json({ mensajeError: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};

// ✅ Crear un nuevo cliente
export const CR_Cliente_CTS = async (req, res) => {
  try {
    const nuevoCliente = await ClientesModel.create(req.body);
    res.json({
      message: 'Cliente creado correctamente',
      cliente: nuevoCliente
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ mensajeError: error.message });
  }
};

// ✅ Actualizar un cliente por ID
export const UR_Cliente_CTS = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ClientesModel.update(req.body, {
      where: { id }
    });

    if (updated === 1) {
      const clienteActualizado = await ClientesModel.findByPk(id);
      res.json({
        message: 'Cliente actualizado correctamente',
        cliente: clienteActualizado
      });
    } else {
      res.status(404).json({ mensajeError: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};

// ✅ Eliminar cliente por ID
export const ER_Cliente_CTS = async (req, res) => {
  try {
    const { id } = req.params;
    await ClientesModel.destroy({ where: { id } });
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensajeError: error.message });
  }
};
