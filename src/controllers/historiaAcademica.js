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

/* // Función para que el profesor cargue la nota
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
    */ 

async function obtenerCursosYMaterias(req, res) {
  try {
    const usuarioAutenticado = getUsuarioAutenticado(); 
    
    // Buscar las materias impartidas por el profesor
    const materias = await Materia.find({ profesor: usuarioAutenticado._id })
    .populate({
      path: 'curso',
      populate: {
        path: 'estudiantes',
        select: 'nombres apellidos dni'  // Seleccionas múltiples atributos
      }
    }).lean()
     const materiaId = materias[0]._id;//guardo el id de la materia 

       // Extraer los IDs de los estudiantes del curso
    const estudiantesIds = materias[0].curso.estudiantes.map(est => est._id);
     // Hacer una sola co nsulta para obtener las notas de los estudiantes en esta materia
     const notas = await Nota.find({
      estudiante: { $in: estudiantesIds }, // Todos los estudiantes del curso
      materia: materiaId // Solo la materia que dicta el profesor
    }).lean();
     
    // Agregar calificaciones a los alumnos
materias[0].curso.estudiantes.forEach(alumno => {
  // Buscar la nota correspondiente al alumno
  const nota = notas.find(n => n.estudiante.equals(alumno._id));
  
  // Si hay una nota, agregar la calificación; si no, asignar "no hay nota"
  alumno.nota = nota ? nota.calificacion : "no hay nota";
});
   
    /*  cambie el for porque no es eficiente
    for (let materia of materias) {
      for (let estudiante of materia.curso.estudiantes) {
        // Buscamos las notas de cada estudiante en la materia actual
        const nota = await Nota.findOne({
          estudiante: estudiante._id,
          materia: materia._id
        });
        // Agregamos la nota al objeto del estudiante si existe
        if (nota) {
          estudiante.nota = nota.calificacion;
        } else {
          estudiante.nota = 'Sin nota';
        }
      }
    }
  */
   
    // Renderizar los cursos con los estudiantes y materias
    res.render('profesores', { materias });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los cursos y materias del profesor');
  }
}

async function cargarNota(req, res) {
  try {
    const { estudianteId, materiaId, calificacion, tipoEvaluacion, observaciones } = req.body;

    // Validar que la calificación esté en el rango permitido 
    if (calificacion < 0 || calificacion > 10) {
      return res.status(400).send('La calificación debe estar entre 0 y 10.');
    }

    // Crear una nueva nota
    const nuevaNota = new Nota({
      estudiante: estudianteId,
      materia: materiaId,
      profesor: getUsuarioAutenticado()._id, // Suponiendo que tienes un método para obtener el profesor autenticado
      calificacion,
      tipoEvaluacion,
      observaciones
    });

    // Guardar la nota en la base de datos
    await nuevaNota.save();
 
     // Renderizar la vista con los datos actualizados
     res.redirect('/profesor');// Cambia esto a la ruta correspondiente
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la nota.');
  }
}

module.exports = { verNotas, cargarNota, obtenerCursosYMaterias  };
