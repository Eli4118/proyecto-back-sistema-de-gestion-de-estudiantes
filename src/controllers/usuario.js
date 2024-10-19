const { model } = require("mongoose");
const Usuario = require('../models/usuarios'); // Importa el esquema base
const { registrarEstudiante, registrarTutor, registrarProfesor, registrarAdministrador } = require('./funciones/registroRoles');
const UsuarioController = {
  registro: async (req, res) => {
    try {
      const { rol, ...usuarioData } = req.body;
  
      let nuevoUsuario;
  
      switch (rol) {
        case 'estudiante':
          nuevoUsuario = await registrarEstudiante(usuarioData);
          break;
        case 'tutor':
          nuevoUsuario = await registrarTutor(usuarioData);
          break;
        case 'profesor':
          nuevoUsuario = await registrarProfesor(usuarioData);
          break;
        case 'administrador':
          nuevoUsuario = await registrarAdministrador(usuarioData);
          break;
        default:
          return res.status(400).json({ message: 'Rol no válido' });
      }
  
      return res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
    }
  },

  listar2: async (req, res) => {
    try {
      const usuarios = await Usuario.find();
      //res.status(200).json(usuarios);
      // Renderizar la vista Pug 'listar' pasando la lista de usuarios
      res.render('listar', { usuarios });
    } catch (error) {
      res.status(500).json({ message: 'Error al listar los usuarios', error: error.message });
    }
  },

  /*buscarPorDni: async (req, res) => {
    try {
      const usuario = await Usuario.findOne({ dni: req.params.dni })
      console.log(usuario);
      if (usuario) {
        res.status(200).json(usuario);
        
      }else{
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
 
  },*/
  buscarPorDni: async (req, res) => {
    try {
      const dni = req.params.dni;
      const usuario = await Usuario.findOne({ dni })
        .populate('tutores', 'nombres apellidos dni') // Poblar tutores
        .populate('estudiantes', 'nombres apellidos dni') // Poblar estudiantes
        .exec();
  
      // Si el usuario se encuentra
      if (usuario) {
        // Actualizar relaciones si es estudiante y tiene tutores asociados
        if (usuario.rol === 'estudiante' && usuario.dniTutor.length > 0) {
          const tutores = await Usuario.find({ dni: { $in: usuario.dniTutor }, rol: 'tutor' });
  
          // Asignar los tutores al estudiante si no están ya relacionados
          if (!usuario.tutores.length) {
            usuario.tutores = tutores.map(tutor => tutor._id);
            await usuario.save();
  
            // Actualizar los tutores para incluir el estudiante
            await Usuario.updateMany(
              { _id: { $in: tutores.map(tutor => tutor._id) } },
              { $addToSet: { estudiantes: usuario._id } }
            );
          }
        }
  
        // Actualizar relaciones si es tutor y tiene estudiantes asociados
        if (usuario.rol === 'tutor' && usuario.dniEstudiantes.length > 0) {
          const estudiantes = await Usuario.find({ dni: { $in: usuario.dniEstudiantes }, rol: 'estudiante' });
  
          // Asignar los estudiantes al tutor si no están ya relacionados
          if (!usuario.estudiantes.length) {
            usuario.estudiantes = estudiantes.map(estudiante => estudiante._id);
            await usuario.save();
  
            // Actualizar los estudiantes para incluir el tutor
            await Usuario.updateMany(
              { _id: { $in: estudiantes.map(estudiante => estudiante._id) } },
              { $addToSet: { tutores: usuario._id } }
            );
          }
        }
  
        console.log(usuario);  
        return res.status(200).json(usuario);
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
  },
  
  
  listarPorRol: async (req, res)=> {
    const { rol } = req.params; // Suponiendo que el rol viene como parámetro en la URL
    try {
      const usuarios = await Usuario.find({ rol }); // Filtra usuarios por rol
      if (usuarios.length === 0) {
        return res.status(404).json({ message: 'No se encontraron usuarios con ese rol' });
      }
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const datosAActualizar = {}; // Creamos un objeto vacío para los datos a actualizar

      // Solo agregamos al objeto los campos que están presentes en req.body
      Object.keys(req.body).forEach(campo => {
          if (req.body[campo] !== undefined) {
              datosAActualizar[campo] = req.body[campo];
          }
      });

      // Buscamos y actualizamos por DNI
      const usuarioActualizado = await Usuario.findOneAndUpdate(
          { dni: req.params.dni },
          { $set: datosAActualizar }, // Solo actualizamos los campos enviados
          { new: true } // Devolvemos el documento actualizado
      );

      if (!usuarioActualizado) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json({ message: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
  } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
  },

  eliminar: async (req, res) => {
    try {
      const usuarioEliminado = await Usuario.findOneAndDelete({ dni: req.params.dni });
      if (!usuarioEliminado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
  },
  
  editar:async (req, res) => {
    try {
      const usuario = await Usuario.findOne({ dni: req.params.dni });
  
      if (!usuario) {
        return res.status(404).render('404', { message: 'Usuario no encontrado' });
      }
  
      // Renderiza la vista de edición con los datos del usuario
      res.render('editarUsuario', { usuario });
    } catch (error) {
      res.status(500).send('Error al cargar el formulario de edición');
    }
  }
};


module.exports = UsuarioController;
