const { model } = require("mongoose");
const Usuario = require('../models/usuarios'); // Importa el esquema base
const UsuarioController = {
  registro: async (req, res) => {
    try {
      console.log(req.body);  // Ver qué datos están llegando
      console.log("Rol recibido:", req.body.rol);  // Asegúrate de que el rol está presente
  
      const { rol, dniTutor, ...usuarioData } = req.body;  // Extraer el rol y dni del tutor
      usuarioData.rol = rol;  // Asegurarse de que el rol se incluya en usuarioData
  
      const usuario = new Usuario(usuarioData);  // Crear el nuevo usuario con los datos
      if (rol === 'estudiante') {
        //aca se puede hacer la conexion entre estudiante y curso (buscar curso por año y turno)
        //inscribirCurso(año, turno, dni);
        const tutor = await Usuario.findOne({ dni: dniTutor, rol: 'tutor' });  // Buscar tutor por DNI
        if (tutor) {
          usuario.tutorId = tutor._id;  // Asignar ID del tutor al estudiante
        } else {
          usuario.tutorId = null;  // Si no hay tutor, asignar null
        }        
      }
  
      // Guardar el usuario en la base de datos
      await usuario.save();
  
      return res.status(201).json({ message: 'Usuario registrado exitosamente', usuario });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
  
      return res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
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
