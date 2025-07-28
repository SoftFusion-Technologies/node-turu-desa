import ClientesModel from '../Models/MD_TB_Clientes.js';
import AccesosModel from '../Models/MD_TB_Accesos.js';
import { Op } from 'sequelize';

// Registrar un acceso por DNI (validación incluida)
export const CR_Acceso_CTS = async (req, res) => {
  const { dni } = req.body;

  try {
    const cliente = await ClientesModel.findOne({ where: { dni } });

    if (!cliente)
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    if (cliente.estado !== 'activo') {
      return res.status(403).json({ mensaje: 'El cliente está inactivo' });
    }

    const hoy = new Date();
    const vencimiento = new Date(cliente.fecha_vencimiento);
    if (vencimiento < hoy) {
      return res.status(403).json({ mensaje: 'Cuota vencida' });
    }

    const accesosDelMes = await AccesosModel.count({
      where: {
        cliente_id: cliente.id,
        fecha: {
          [Op.gte]: new Date(hoy.getFullYear(), hoy.getMonth(), 1),
          [Op.lte]: new Date(
            hoy.getFullYear(),
            hoy.getMonth() + 1,
            0,
            23,
            59,
            59
          )
        }
      }
    });

    if (accesosDelMes >= 26) {
      return res
        .status(403)
        .json({ mensaje: 'Límite de 26 accesos alcanzado' });
    } 

    const nuevoAcceso = await AccesosModel.create({ cliente_id: cliente.id });

    return res.json({
      mensaje: 'Acceso registrado correctamente',
      cliente: {
        nombre: cliente.nombre,
        dni: cliente.dni,
        telefono: cliente.telefono,
        email: cliente.email,
        fecha_hora: new Date(),
        monto: cliente.monto,
        pases_usados: `${accesosDelMes + 1} / 26`,
        fecha_vencimiento: cliente.fecha_vencimiento,
        estado: cliente.estado
      }
    });
  } catch (error) {
    console.error('Error al registrar acceso:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Obtener todos los accesos con info de cliente
export const OBRS_Accesos_CTS = async (req, res) => {
  try {
    const accesos = await AccesosModel.findAll({
      include: [{ model: ClientesModel }],
      order: [['fecha', 'DESC']]
    });

    res.json(accesos);
  } catch (error) {
    console.error('Error al obtener accesos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
