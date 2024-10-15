const express = require('express');
const usuariosRouter = require('./usuarios');//importando la ruta 
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('logIn') // Renderiza la vista de "index"
    next()
  })


router.get('/registro', (req, res, next) => {
    res.render("registro")
    next()
  })
// Usa estudianteRouter bajo la ruta '/usuarios'
router.use('/usuarios', usuariosRouter);

module.exports = router;