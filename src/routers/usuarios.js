const express = require('express');
const verificarRol = require('../middleware/verificarRol')//para protejer la ruta
const usuarioController = require('../controllers/usuario');
const {obtEstudianteTutor, verNotas1} = require('../controllers/historiaAcademica')
const usuarioRouter = express.Router();
const MateriaController = require('../controllers/materias');
//hacer un enrutador para tutor 

//rutas para tutor 
//visualiza los estudiantes relacionados con el tutor
usuarioRouter.get('/tutor',verificarRol(['tutor']), obtEstudianteTutor);
//visualiza las notas de un estudiantes relacionados con el tutor
usuarioRouter.get('/tutor/:dni',verificarRol(['tutor']), verNotas1); 

//rutas para usuarios
// Crear usuario
usuarioRouter.post('/',verificarRol(['administrativo']), usuarioController.registro); 
// Listar todos los usuarios
usuarioRouter.get('/listar',verificarRol(['administrativo']),usuarioController.listar);
// Listar todos los estudiantes
usuarioRouter.get('/estudiantes',verificarRol(['administrativo']),usuarioController.filtrarEstudiantes);
// Actualizar usuario
usuarioRouter.put('/:dni',verificarRol(['administrativo']),usuarioController.actualizar);
// visualiza la pagina de Actualizar usuario
usuarioRouter.get('/:dni/editar', verificarRol(['administrativo']),usuarioController.editar);
// Eliminar usuario 
usuarioRouter.delete('/:dni',verificarRol(['administrativo']), usuarioController.eliminar); 

//rutas para materias
usuarioRouter.get('/materias',verificarRol(['administrativo']),MateriaController.mostrarMaterias);
usuarioRouter.get('/materias/nueva',verificarRol(['administrativo']),MateriaController.cargarFormulario);
usuarioRouter.post('/materias/nueva',verificarRol(['administrativo']),MateriaController.cargarMateria);
// Ruta para mostrar el formulario de edición
usuarioRouter.get('/materias/editar/:id',verificarRol(['administrativo']),MateriaController.mostrarFormularioEdicion);
// Ruta para procesar la edición
usuarioRouter.put('/materias/editar/:id',verificarRol(['administrativo']),MateriaController.editarMateria);
// Ruta para eliminar una materia
usuarioRouter.delete('/materias/eliminar/:id',verificarRol(['administrativo']), MateriaController.eliminarMateria); 

usuarioRouter.get('/cursos',verificarRol(['administrativo']),MateriaController.obtenerCursos);
usuarioRouter.get('/cursos/:id',verificarRol(['administrativo']),MateriaController.obtenerCursoPorId);

//funciones que no se utilizan por el momento
// Obtener usuario por dni
//usuarioRouter.get('/dni/:dni', usuarioController.buscarPorDni);

module.exports = usuarioRouter;