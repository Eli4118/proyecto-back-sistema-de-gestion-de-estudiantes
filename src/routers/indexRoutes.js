const express = require('express');
const usuariosRouter = require('./usuarios');//importando la ruta 
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('logIn') // Renderiza la vista de "index"    
  })


router.get('/registro', (req, res, next) => {
    res.render("registro")
    next()
  })
// Usa estudianteRouter bajo la ruta '/usuarios'
router.use('/usuarios', usuariosRouter);

router.use((req, res, next) => {
  return res.status(404).render('404', { title: 'Página no encontrada' });
  next()
});

module.exports = router;