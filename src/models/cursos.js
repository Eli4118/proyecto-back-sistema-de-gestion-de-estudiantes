const mongoose = require('mongoose');

// Esquema para cursos
const Cursos = mongoose.model('Curso', CursoSchema);
module.exports = Curso;

const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({

  grado: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
    // Este campo puede ser útil si necesitas separar entre primaria o secundaria
  },
  nivel: {
    type: String,
    required: true,
    enum: ['primaria', 'secundaria'] // Define si el curso es de primaria o secundaria
  },
  division: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9]$/, 'La división debe ser una única letra (A-Z) o un número (0-9)'] // Valida una letra o número
  },
  materias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materia', // Cada curso puede tener varias materias
  }],
  profesor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',    
  }],
  estudiantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario' // Relaciona a los estudiantes que están inscritos en este curso
  }]
});

const Curso = mongoose.model('Curso', CursoSchema);

module.exports = Curso;
