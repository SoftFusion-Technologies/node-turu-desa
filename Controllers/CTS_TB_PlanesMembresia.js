/*
 * Programador: Benjamin Orellana
 * Fecha: 27 / 07 / 2025
 * Controlador: planes_membresia
 */

import PlanesMembresiaModel from '../Models/MD_TB_PlanesMembresia.js';

// Crear nuevo plan
export const CR_PlanMembresia_CTS = async (req, res) => {
  try {
    const nuevoPlan = await PlanesMembresiaModel.create(req.body);
    res.status(201).json(nuevoPlan);
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ mensaje: 'Error al crear plan' });
  }
};

// Obtener todos los planes
export const OBRS_PlanesMembresia_CTS = async (req, res) => {
  try {
    const planes = await PlanesMembresiaModel.findAll();
    res.json(planes);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ mensaje: 'Error al obtener planes' });
  }
};

// Obtener un plan por ID
export const OBR_PlanMembresia_CTS = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await PlanesMembresiaModel.findByPk(id);
    if (!plan) return res.status(404).json({ mensaje: 'Plan no encontrado' });
    res.json(plan);
  } catch (error) {
    console.error('Error al obtener plan:', error);
    res.status(500).json({ mensaje: 'Error al obtener plan' });
  }
};

// Actualizar plan por ID
export const UPD_PlanMembresia_CTS = async (req, res) => {
  const { id } = req.params;
  try {
    const [filasActualizadas] = await PlanesMembresiaModel.update(req.body, {
      where: { id }
    });
    if (filasActualizadas === 0) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    res.json({ mensaje: 'Plan actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({ mensaje: 'Error al actualizar plan' });
  }
};

// Eliminar plan por ID
export const DEL_PlanMembresia_CTS = async (req, res) => {
  const { id } = req.params;
  try {
    const filasEliminadas = await PlanesMembresiaModel.destroy({
      where: { id }
    });
    if (filasEliminadas === 0) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    res.json({ mensaje: 'Plan eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ mensaje: 'Error al eliminar plan' });
  }
};
