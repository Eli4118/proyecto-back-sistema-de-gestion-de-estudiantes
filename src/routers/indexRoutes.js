const express = require('express');
const usuariosRouter = require('./usuarios');
const profesorRouter = require('./profesor')
const sesionRouter = require('./sesion')
const router = express.Router();
const verificarRol = require('../middleware/verificarRol')
const {verNotas} = require('../controllers/historiaAcademica')
const MateriaController = require('../controllers/materias');
const autenticarJWT = require('../middleware/autenticarJWT')
const agregarUsuarioAVista = require('../middleware/sessionData')
//Renderiza pagina home 
router.get('/', (req, res, next) => {res.render('home')})
router.get('/home2',autenticarJWT,agregarUsuarioAVista, verificarRol(['administrativo','tutor','profesor','estudiante']), (req, res, next) => {res.render('home2')})
// Renderiza pagina formulario de registro solo se admite al administrativo
router.get('/registro',autenticarJWT,agregarUsuarioAVista, verificarRol(['administrativo']),(req, res, next) => {res.render("registro")})
router.get('/materias',autenticarJWT,agregarUsuarioAVista,verificarRol(['administrativo']),(req, res, next) => {res.render('gest-materias')})
//router.get('/materias/nueva',verificarRol(['administrativo']),(req, res, next) => {res.render('cargarMaterias')})
//router.get('/editar/:id',(req, res, next) => {res.render('editar')})
//router.get('/materias/editar',verificarRol(['administrativo']),(req, res, next) => {res.render("editarMateria")})
// Llama al router de profesor
router.use('/profesor',verificarRol(['profesor']),profesorRouter)
//  Llama al router de usuarios
router.use('/usuarios', autenticarJWT,agregarUsuarioAVista, usuariosRouter);
//  Llama al router de usuarios
router.use('/login', sesionRouter);
// visualiza las notas de 1 estudiante
router.get('/notas',verificarRol(['estudiante','tutor']),verNotas);
//visualiza 404 con cualquier ruta no definida
router.use((req, res, next) => {
  return res.status(404).render('404', { title: 'Página no encontrada' });
});
module.exports = router;