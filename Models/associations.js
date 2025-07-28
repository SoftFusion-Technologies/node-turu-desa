// Models/associations.js
import ClientesModel from './MD_TB_Clientes.js';
import PlanesMembresiaModel from './MD_TB_PlanesMembresia.js';

// Relaciones
ClientesModel.belongsTo(PlanesMembresiaModel, { foreignKey: 'plan_id' });
PlanesMembresiaModel.hasMany(ClientesModel, { foreignKey: 'plan_id' });
