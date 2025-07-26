/*
  * Programador: Benjamin Orellana
  * Fecha Cración: 23 /05 / 2025
  * Versión: 1.0
  *
  * Descripción:
    *Este archivo (routes.js) define las rutas HTTP para operaciones CRUD en la tabla
  * Tema: Rutas
  
  * Capa: Backend 
*/

import express from 'express'; // Importa la librería Express

// ----------------------------------------------------------------
// Crea un enrutador de Express
const router = express.Router();
// Define las rutas para cada método del controlador
// ----------------------------------------------------------------

import {
  OBRS_Clientes_CTS,
  OBR_Cliente_CTS,
  OBR_ClientePorDNI_CTS,
  CR_Cliente_CTS,
  UR_Cliente_CTS,
  ER_Cliente_CTS
} from '../Controllers/CTS_TB_Clientes.js';

router.get('/clientes', OBRS_Clientes_CTS);
router.get('/clientes/:id', OBR_Cliente_CTS);
router.get('/clientes-dni/:dni', OBR_ClientePorDNI_CTS); // ✅ esta es la nueva
router.post('/clientes', CR_Cliente_CTS);
router.put('/clientes/:id', UR_Cliente_CTS);
router.delete('/clientes/:id', ER_Cliente_CTS);

import {
  OBRS_Usuarios_CTS,
  OBR_Usuario_CTS,
  CR_Usuario_CTS,
  UR_Usuario_CTS,
  ER_Usuario_CTS
} from '../Controllers/CTS_TB_Usuarios.js';

router.get('/usuarios', OBRS_Usuarios_CTS);
router.get('/usuarios/:id', OBR_Usuario_CTS);
router.post('/usuarios', CR_Usuario_CTS);
router.put('/usuarios/:id', UR_Usuario_CTS);
router.delete('/usuarios/:id', ER_Usuario_CTS);

import { CR_Acceso_CTS } from '../Controllers/CTS_TB_Accesos.js';
router.post('/accesos', CR_Acceso_CTS); // recibe { dni: "43849860" }

// Exporta el enrutador
export default router;
