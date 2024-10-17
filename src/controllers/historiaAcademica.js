const Nota = require('../models/notas');
const Usuario = require('../models/usuarios');
const Materia = require('../models/materias'); 
const Curso = require('../models/cursos'); 
const { getUsuarioAutenticado } = require('../utils/session');

async function verNotas(req, res) {
  try {
    const usuarioAutenticado = getUsuarioAutenticado(); // Obtener el usuario autenticado

    // Verificar que el usuario está autenticado y tiene un ID válido
    if (!usuarioAutenticado || !usuarioAutenticado._id) {
      return res.status(401).send('Usuario no autenticado');
    }

    let estudianteId;

    // Si el usuario autenticado es un estudiante
    if (usuarioAutenticado.rol === 'estudiante') {
      estudianteId = usuarioAutenticado._id;
    }
    // Si el usuario autenticado es un tutor
    else if (usuarioAutenticado.rol === 'tutor') {
      const estudiante = await Usuario.findOne({ dniTutor: usuarioAutenticado.dni, rol: 'estudiante' });
      
      // Verificar si el tutor tiene un estudiante asociado
      if (!estudiante) {
        return res.status(404).send('No se encontraron estudiantes asociados a este tutor');
      }

      estudianteId = estudiante._id;
    } else {
      return res.status(403).send('No tienes permiso para ver las notas');
    }

    // Buscar las notas del estudiante
    const notas = await Nota.find({ estudiante: estudianteId })
      .populate('materia', 'nombre')  // Poblar el nombre de la materia
      .populate('profesor', 'nombres apellidos')  // Poblar el nombre del profesor
      .exec();
    
    // Renderizar la vista con las notas encontradas
    res.render('historiaAcademica', { notas });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar las notas');
  }
}

// Función para que el profesor cargue la nota
const cargarNota = async (req, res) => {
  const { estudianteId, materiaId, calificacion, tipoEvaluacion, observaciones } = req.body;
  const usuarioAutenticado = getUsuarioAutenticado(); 

      // Extraer el ID del curso y el ID del estudiante/materia
      const [cursoId, realEstudianteId] = estudianteId.split('-');
      const [materiaCursoId, realMateriaId] = materiaId.split('-');
  try {


      // Verificar que el curso y la materia correspondan
      if (cursoId !== materiaCursoId) {
        return res.status(400).send('El curso seleccionado no coincide con la materia.');
      }
          // Crear una nueva nota
    const nuevaNota = new Nota({
      estudiante: realEstudianteId,
      materia: realMateriaId,
      profesor: usuarioAutenticado._id,
      calificacion,
      tipoEvaluacion,
      observaciones
    });
  
    // Guardar la nueva nota
    await nuevaNota.save();

    res.redirect('/profesor'); // Redirigir a la lista de estudiantes
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la nota.');
  }
};
    

async function obtenerCursosYMaterias(req, res) {
  try {
    const usuarioAutenticado = getUsuarioAutenticado(); 
    
    // Buscar las materias impartidas por el profesor
    const materias = await Materia.find({ profesor: usuarioAutenticado._id }).select('curso').lean();

    if (materias.length === 0) {
        return res.render('profesores', { mensaje: 'El profesor no tiene materias asignadas.', cursos: [] });
    }

    const cursosIds = materias.map(m => m.curso);
    const cursosUnicos = [...new Set(cursosIds)];

    // Buscar los cursos con estudiantes
    const cursosConAlumnos = await Curso.find({ _id: { $in: cursosUnicos } })
        .populate('estudiantes', 'nombres apellidos')
        .populate('materias', 'nombre')
        .lean();

    if (cursosConAlumnos.length === 0) {
        return res.render('profesores', { mensaje: 'El profesor no tiene cursos asignados.', cursos: [] });
    }

    // Renderizar los cursos con los estudiantes y materias
    res.render('profesores', { cursos: cursosConAlumnos });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los cursos y materias del profesor');
  }
}

module.exports = { verNotas, cargarNota, obtenerCursosYMaterias  };
