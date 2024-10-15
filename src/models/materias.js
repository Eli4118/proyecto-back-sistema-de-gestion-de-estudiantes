const mongoose = require('mongoose');

// Esquema para materias
const MateriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la materia es obligatorio'],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: 'El nombre de la materia solo puede contener letras y espacios'
    }
  },
  profesores: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Cada materia puede tener varios profesores
  }],
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso', // La materia está vinculada a un curso
  },
  horario: {
    dia: {
      type: String,
      enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      required: true
    },
    horaInicio: {
      type: String,
      required: true // Formato de 24 horas, por ejemplo, '14:00'
    },
    horaFin: {
      type: String,
      required: true // Formato de 24 horas, por ejemplo, '16:00'
    }
  },
  estudiantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario' // Relaciona los estudiantes que están cursando esta materia
  }]
});

const Materia = mongoose.model('Materia', MateriaSchema);
module.exports = Materia;



