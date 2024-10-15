const mongoose = require('mongoose');

// Definir un esquema mixto para usuarios
const UsuarioSchema = new mongoose.Schema({
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
    required: [true, 'El dni es obligatorio'],
    unique: true,
  },
  rol: {
    type: String,
    enum: ['estudiante', 'profesor', 'tutor', 'administrativo'],
    required: true
  },
  curso: {
    type:  String,
    ref: 'Curso',
    /* required: function() {
      return this.rol === 'estudiante'; // Solo requerido si el rol es estudiante
    } */
  },
   /* // Ahora relacionamos padres e hijos por DNI
    padres: [{
      type: Number,  // Usamos el campo DNI en lugar de ObjectId
      ref: 'Usuario',
      required: function() {
        return this.rol === 'estudiante';
      }
    }],
    hijos: [{
      type: Number,  // Usamos el campo DNI en lugar de ObjectId
      ref: 'Usuario',
      required: function() {
        return this.rol === 'padre';
      }
    }]
  */
});


const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
