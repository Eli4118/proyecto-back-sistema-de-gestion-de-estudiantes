const Nota = require('../models/notas');
const Usuario = require('../models/usuarios');
const Materia = require('../models/materias'); 
const { getUsuarioAutenticado } = require('../utils/session');

async function verNotas(req, res) {
  try {
    const estudiante = getUsuarioAutenticado()

     // Verificar que el estudiante existe y tiene un ID válido
     if (!estudiante || !estudiante._id) {
        return res.status(401).send('Usuario no autenticado');        
      }
      
      const notas = await Nota.find({ estudiante: estudiante._id })
      .populate('materia', 'nombre')  // Poblar el nombre de la materia
      .populate('profesor', 'nombres apellidos')  // Poblar el nombre del profesor
      .exec();
    
    res.render('historiaAcademica', { notas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar las notas');
  }
}

module.exports = { verNotas };
