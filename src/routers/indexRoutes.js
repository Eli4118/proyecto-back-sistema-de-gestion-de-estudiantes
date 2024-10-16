const express = require('express');
const usuariosRouter = require('./usuarios');//importando la ruta 
const sesionRouter = require('./sesion')
const verificarRol = require('../middleware/verificarRol')
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('logIn') // Renderiza la vista de "home"    
  })


router.get('/registro',verificarRol(['administrativo']), (req, res, next) => {
    res.render("registro")
    
  })
// Usa estudianteRouter bajo la ruta '/usuarios'
router.use('/usuarios', usuariosRouter);

router.use('/login', sesionRouter);

router.use((req, res, next) => {
  return res.status(404).render('404', { title: 'Página no encontrada' });
  
});

module.exports = router;