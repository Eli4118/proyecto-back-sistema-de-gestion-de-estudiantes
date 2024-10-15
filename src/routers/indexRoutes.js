const express = require('express');
const usuariosRouter = require('./usuarios');//importando la ruta 
const router = express.Router();

// Usa estudianteRouter bajo la ruta '/estudiantes'
router.use('/usuarios', usuariosRouter);
module.exports = router;