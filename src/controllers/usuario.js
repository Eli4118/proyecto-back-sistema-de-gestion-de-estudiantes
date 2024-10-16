const { model } = require("mongoose");
const Usuario = require('../models/usuarios'); // Importa el esquema base
const UsuarioController = {
  registro: async (req, res) => {
    try {
      const usuario = new Usuario(req.body);
      await usuario.save(); // Esto desencadenará las validaciones
      res.status(201).json({ message: 'Usuario creado exitosamente', usuario });
    } catch (error) {
      // Si ocurre un error de validación o cualquier otro, devolvemos un mensaje de error
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Error de validación', error: error.message });
      }
      res.status(500).json({ message: 'Error al crear usuario', error: error.message });
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
