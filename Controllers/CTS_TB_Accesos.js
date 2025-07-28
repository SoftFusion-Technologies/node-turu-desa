import ClientesModel from '../Models/MD_TB_Clientes.js';
import AccesosModel from '../Models/MD_TB_Accesos.js';
import { Op } from 'sequelize';

// Registrar un acceso por DNI (validación incluida)
export const CR_Acceso_CTS = async (req, res) => {
  const { dni } = req.body;

  try {
    const cliente = await ClientesModel.findOne({ where: { dni } });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    // Validar estado general
    if (cliente.estado !== 'activo') {
      return res
        .status(403)
        .json({ mensaje: `El cliente está ${cliente.estado}` });
    }

    // Validar si pagó
    if (cliente.pagado !== 'SI') {
      return res
        .status(403)
        .json({ mensaje: 'El cliente no tiene el pago al día' });
    }

    // Validar vencimiento
    const hoy = new Date();
    const vencimiento = new Date(cliente.fecha_vencimiento);
    if (vencimiento < hoy) {
      return res
        .status(403)
        .json({ mensaje: 'Cuota vencida. Abone para ingresar.' });
    }

    // Validar si ya accedió hoy
    const inicioHoy = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      0,
      0,
      0
    );
    const finHoy = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      23,
      59,
      59
    );

    const accesoHoy = await AccesosModel.findOne({
      where: {
        cliente_id: cliente.id,
        fecha: {
          [Op.between]: [inicioHoy, finHoy]
        }
      }
    });

    if (accesoHoy) {
      return res.status(403).json({ mensaje: 'Ya se registró un acceso hoy.' });
    }

    // Contar pases del mes actual
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
        .json({ mensaje: 'Límite de 26 accesos alcanzado este mes.' });
    }

    // Registrar acceso
    const nuevoAcceso = await AccesosModel.create({ cliente_id: cliente.id });

    return res.json({
      mensaje: '✅ Acceso registrado correctamente',
      cliente: {
        nombre: cliente.nombre,
        dni: cliente.dni,
        telefono: cliente.telefono,
        email: cliente.email,
        fecha_hora: new Date(),
        monto: cliente.monto,
        pases_usados: `${accesosDelMes + 1} / 26`,
        fecha_vencimiento: cliente.fecha_vencimiento,
        estado: cliente.estado,
        tipo_membresia: cliente.tipo_membresia
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
    const { q = '', fecha = '', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    const include = [
      {
        model: ClientesModel,
        where: {}
      }
    ];

    if (q) {
      include[0].where = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${q}%` } },
          { dni: { [Op.like]: `%${q}%` } }
        ]
      };
    }

    if (fecha) {
      where.fecha = {
        [Op.between]: [
          new Date(`${fecha}T00:00:00`),
          new Date(`${fecha}T23:59:59`)
        ]
      };
    }

    const { rows: accesos, count: total } = await AccesosModel.findAndCountAll({
      include,
      where,
      order: [['fecha', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      accesos,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error al obtener accesos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


export const OBR_Acceso_CTS = async (req, res) => {
  try {
    const { id } = req.params;

    const acceso = await AccesosModel.findByPk(id, {
      include: [{ model: ClientesModel }]
    });

    if (!acceso) {
      return res.status(404).json({ mensaje: 'Acceso no encontrado' });
    }

    const cliente = acceso.cliente;

    // 🧠 Calcular accesos del mes del cliente
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const accesosDelMes = await AccesosModel.count({
      where: {
        cliente_id: cliente.id,
        fecha: {
          [Op.gte]: inicioMes
        },
        tipo_acceso: 'normal'
      }
    });

    return res.json({
      mensaje: '✅ Detalles del acceso',
      cliente: {
        nombre: cliente.nombre,
        dni: cliente.dni,
        telefono: cliente.telefono,
        email: cliente.email,
        fecha_hora: acceso.fecha,
        monto: cliente.monto,
        pases_usados:
          acceso.tipo_acceso === 'normal' ? `${accesosDelMes} / 26` : '-',
        fecha_vencimiento: cliente.fecha_vencimiento,
        estado: cliente.estado,
        tipo_membresia: cliente.tipo_membresia
      }
    });
  } catch (error) {
    console.error('Error al obtener acceso por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
