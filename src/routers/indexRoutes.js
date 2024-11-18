const express = require('express');
const usuariosRouter = require('./usuarios');
const profesorRouter = require('./profesor')
const sesionRouter = require('./sesion')
const router = express.Router();
const verificarRol = require('../middleware/verificarRol')
const {verNotas} = require('../controllers/historiaAcademica')

//Renderiza pagina el login como home 
router.get('/', (req, res, next) => {res.render('logIn')})
// Renderiza pagina formulario de registro solo se admite al administrativo
router.get('/registro',verificarRol(['administrativo']),(req, res, next) => {res.render("registro")})
// Llama al router de profesor
router.use('/profesor',verificarRol(['profesor']),profesorRouter)
//  Llama al router de usuarios
router.use('/usuarios', usuariosRouter);
//  Llama al router de usuarios
router.use('/login', sesionRouter);
// visualiza las notas de 1 estudiante
router.get('/notas',verificarRol(['estudiante','tutor']),verNotas);
//visualiza 404 con cualquier ruta no definida
router.use((req, res, next) => {
  return res.status(404).render('404', { title: 'Página no encontrada' });
});
module.exports = router;