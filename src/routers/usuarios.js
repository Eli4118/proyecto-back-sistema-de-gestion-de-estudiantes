const express = require('express');
const verificarRol = require('../middleware/verificarRol')//para protejer la ruta
const usuarioController = require('../controllers/usuario');
const usuarioRouter = express.Router();
// Define la ruta base '/estudiantes' y el contenido que va a devolver
/* usuarioRouter.get('/', (request, response) => {
    response.send('Hola  Usuarios');
  });
// Rutas para usuarios */

usuarioRouter.post('/', usuarioController.registro); // Crear usuario
usuarioRouter.get('/', usuarioController.listar); // Listar usuarios
usuarioRouter.get('/:rol', usuarioController.listarPorRol); // Listar usuarios por rol
usuarioRouter.get('/dni/:dni', usuarioController.buscarPorDni); // Obtener usuario por dni
usuarioRouter.put('/:dni', usuarioController.actualizar); // Actualizar usuario
usuarioRouter.delete('/:dni', usuarioController.eliminar); // Eliminar usuario


module.exports = usuarioRouter;