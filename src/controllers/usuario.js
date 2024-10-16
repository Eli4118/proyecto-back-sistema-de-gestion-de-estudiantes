const { model } = require("mongoose");
const Usuario = require('../models/usuarios'); // Importa el esquema base
const UsuarioController = {


  registro: async (req, res) => {
    try {
      // Extraer el rol del cuerpo de la solicitud
      const { rol } = req.body;
  
      // Crear un nuevo usuario
      const usuario = new Usuario(req.body);
      await usuario.save(); // Esto desencadenará las validaciones
  
      // Si el rol es 'estudiante', redirigir a la página de registro del tutor
      if (rol === 'estudiante') {
        return res.redirect('/registro-tutor');
      }
  
      // Redirigimos a la vista de registro, con un mensaje de éxito para otros roles
      res.status(201).render('registro', {
        successMessage: 'Usuario creado exitosamente',
        formData: {}, 
        invalidFields: {}
      });
    } catch (error) {
      const formData = req.body; // Datos ingresados por el usuario
      const invalidFields = {}; // Objeto para mantener el estado de los campos inválidos
  
      // Verifica si hay campos que están mal y márcalos como inválidos
      if (error.code === 11000) { // Error de duplicado
        const field = Object.keys(error.keyValue)[0];
        invalidFields[field] = true; // Marcamos el campo duplicado
        return res.status(400).render('registro', {
          errorMessage: `El ${field} ingresado ya está en uso.`,
          formData,
          invalidFields,
        });
      } else if (error.name === 'ValidationError') {
        // Agrupamos los errores de validación
        Object.keys(error.errors).forEach((field) => {
          invalidFields[field] = true; // Marcamos cada campo inválido
        });
        return res.status(400).render('registro', {
          errorMessage: 'Hay errores en el formulario, por favor revisa los campos resaltados.',
          formData,
          invalidFields,
        });
      }
    }
  },
  


  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.find();
      //res.status(200).json(usuarios);
      // Renderizar la vista Pug 'listar' pasando la lista de usuarios
      res.render('listar', { usuarios });
    } catch (error) {
      res.status(500).json({ message: 'Error al listar los usuarios', error: error.message });
    }
  },

  buscarPorDni: async (req, res) => {
    try {
      const usuario = await Usuario.findOne({ dni: req.params.dni })//nombre del atributo:dato que viene en la request
      if (usuario) {
        res.status(200).json(usuario);
        
      }else{
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
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
  }
  
  
};


module.exports = UsuarioController;
