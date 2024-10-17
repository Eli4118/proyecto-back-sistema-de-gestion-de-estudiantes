const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  rol: { 
    type: String, 
    enum: ['estudiante', 'tutor', 'profesor', 'administrador'], 
    required: true 
  },
  nombres: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]+$/.test(v); // Solo letras y espacios
      },
      message: 'El nombre solo puede contener letras y espacios'
    }
  },
  apellidos: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: 'El apellido solo puede contener letras y espacios'
    }
  },
  edad: {
    type: Number,
    required: true,
    min: [1, 'La edad debe ser mayor a 0'],
    max: [99, 'La edad debe ser menor a 100']
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'El correo electrónico no es válido']
  },
  dni: {
    type: Number,
    required: [true, 'El DNI es obligatorio'],
    unique: true,
  },
  // Campos específicos para "estudiantes"
  dniTutor: { // DNI del tutor para facilitar la búsqueda
    type: Number,
    // Esto puede ser opcional, puedes decidir si es obligatorio o no
  },
  
});


const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
