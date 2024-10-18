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

  curso: {
    type: String,
    // Puedes hacer que sea requerido solo si el rol es 'estudiante'
    required: function() {
      return this.rol === 'estudiante'; // Solo requerido si el rol es estudiante
    }
  },
  turno: { 
    type: String, 
    required: function() {
      return this.rol === 'estudiante'; // Solo requerido si el rol es estudiante
    }
  },

  // DNI de los tutores (para estudiantes) 
  dniTutor: [{ 
    type: Number, // Guardar el DNI del tutor como número
  }],

  // DNI de los tutores (para tutores) 
  dniEstudiantes: [{ 
    type: Number, // Guardar el DNI del tutor como número
  }],
  // Relación del estudiante con sus tutores (muchos tutores)
  tutores: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', // Referencia al mismo esquema Usuario
    default: [] // Array vacío si no hay tutores
  }],

  // Relación del tutor con sus estudiantes (muchos estudiantes)
  estudiantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Referencia al mismo esquema Usuario
    default: [] // Array vacío si no hay estudiantes a cargo
  }],

  // Campos específicos para "estudiantes"
  dniTutor: { // DNI del tutor para facilitar la búsqueda
    type: Number,
    // Esto puede ser opcional, puedes decidir si es obligatorio o no
  },
  
});


const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
