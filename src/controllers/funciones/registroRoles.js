const mongoose = require('mongoose');
const { model } = require("mongoose");
const Usuario = require('../../models/usuarios');


async function registrarEstudiante(usuarioData) {
  const { dniTutores } = usuarioData;

  // Crear el nuevo estudiante
  const nuevoEstudiante = new Usuario({
    ...usuarioData,
    rol: 'estudiante',
  });

  // Buscar los tutores por DNI y asignar sus IDs al estudiante
  if (dniTutores && dniTutores.length > 0) {
    console.log('DNIs de los tutores:', dniTutores); // Verificar que los DNIs sean correctos

    const tutores = await Usuario.find({ dni: { $in: dniTutores }, rol: 'tutor' });
    console.log('Tutores encontrados:', tutores); // Imprimir los tutores encontrados

    // Si el tutor existe, asignarlo
    if (tutores.length > 0) {
      nuevoEstudiante.tutores = tutores.map(tutor => tutor._id);
    } else {
      console.log('No se encontraron tutores con esos DNIs');
    }
  }

  // Guardar el estudiante
  await nuevoEstudiante.save();

  // Actualizar los tutores para agregar al nuevo estudiante
  if (nuevoEstudiante.tutores && nuevoEstudiante.tutores.length > 0) {
    await Usuario.updateMany(
      { _id: { $in: nuevoEstudiante.tutores } },
      { $addToSet: { estudiantes: nuevoEstudiante._id } }
    );
  }

  // Devolver el nuevo estudiante
  return nuevoEstudiante; // Asegura que la función devuelva el estudiante creado
}





// Función para registrar tutores
async function registrarTutor(usuarioData) {
  const { dniEstudiantes } = usuarioData;

  // Crear el nuevo tutor
  const nuevoTutor = new Usuario({
    ...usuarioData,
    rol: 'tutor',
  });

  // Buscar los estudiantes por DNI y asignar sus IDs al tutor
  if (dniEstudiantes && dniEstudiantes.length > 0) {
    const estudiantes = await Usuario.find({ dni: { $in: dniEstudiantes }, rol: 'estudiante' });

    if (estudiantes.length > 0) {
      nuevoTutor.estudiantes = estudiantes.map(estudiante => estudiante._id);
    }
  }

  // Guardar el tutor
  await nuevoTutor.save();

  // Actualizar los estudiantes para agregar al tutor, solo si no están ya relacionados
  if (nuevoTutor.estudiantes && nuevoTutor.estudiantes.length > 0) {
    await Usuario.updateMany(
      { _id: { $in: nuevoTutor.estudiantes } },
      { $addToSet: { tutores: nuevoTutor._id } } // Añadir el tutor al estudiante sin duplicados
    );
  }

  return nuevoTutor;
}


// Función para registrar profesores
async function registrarProfesor(usuarioData) {
  const nuevoProfesor = new Usuario({
    ...usuarioData,
    rol: 'profesor',
  });
  
  await nuevoProfesor.save();
  return nuevoProfesor;
}

// Función para registrar administradores
async function registrarAdministrador(usuarioData) {
  const nuevoAdministrador = new Usuario({
    ...usuarioData,
    rol: 'administrador',
  });
  
  await nuevoAdministrador.save();
  return nuevoAdministrador;
}

module.exports = {
  registrarEstudiante,
  registrarTutor,
  registrarProfesor,
  registrarAdministrador
};
