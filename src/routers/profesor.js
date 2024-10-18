const express = require('express');
const { cargarNota, obtenerCursosYMaterias,modificarNota} = require('../controllers/historiaAcademica')
const profesorRouter = express.Router();
const verificarRol = require('../middleware/verificarRol')//para protejer la ruta
 
profesorRouter.get('/',verificarRol(['profesor']),obtenerCursosYMaterias)
profesorRouter.post('/',cargarNota)
profesorRouter.put('/',modificarNota)

module.exports = profesorRouter;