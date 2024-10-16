const express = require('express');
const SesionController = require('../controllers/sesion')
const sesionRouter = express.Router();

sesionRouter.get('/', (req, res, next) => {
    res.render('logIn') // Renderiza la vista de "index"    
  })
// Ruta para "iniciar sesión"
sesionRouter.post('/', SesionController.login);
// Ruta para "cerrar sesión"
sesionRouter.post('/logout', SesionController.logout);

module.exports = sesionRouter;