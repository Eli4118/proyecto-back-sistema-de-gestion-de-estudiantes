const express = require('express');
const usuariosRouter = require('./usuarios');//importando la ruta 
const router = express.Router();

router.get('/', (req, res) => {
    res.render('logIn'); // Renderiza la vista de "index"
  });
// Usa estudianteRouter bajo la ruta '/usuarios'
router.use('/usuarios', usuariosRouter);

module.exports = router;