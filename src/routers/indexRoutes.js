const express = require('express');
const usuariosRouter = require('./usuarios');//importando la ruta 
const profesorRouter = require('./profesor')
const sesionRouter = require('./sesion')
const verificarRol = require('../middleware/verificarRol')
const router = express.Router();
const {verNotas} = require('../controllers/historiaAcademica')

router.get('/', (req, res, next) => {
    res.render('logIn') // Renderiza la vista de "home"    
  })

router.get('/registro',(req, res, next) => {
    res.render("registro")
})


router.use('/profesor', profesorRouter)
// Usa estudianteRouter bajo la ruta '/usuarios'
router.use('/usuarios', usuariosRouter);

router.use('/login', sesionRouter);

router.get('/notas',verNotas);

//este es el router para que muestre un 404 con cualquier ruta no definida
router.use((req, res, next) => {
  return res.status(404).render('404', { title: 'Página no encontrada' });
  
});

module.exports = router;