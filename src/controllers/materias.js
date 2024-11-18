const Materia = require('../models/materias');

const MateriaController = {
    cargarMateria: async (req, res) => {
        const { nombre, nivel, profesor, curso, horario } = req.body;
        
        try {
            // Verificar si la materia ya existe en ese nivel
            const materiaExistente = await Materia.findOne({ nombre, nivel });

            if (materiaExistente) {
                return res.status(400).json({ 
                    mensaje: `La materia "${nombre}" ya existe en el nivel "${nivel}".` 
                });
            }

        // Construir el objeto de la nueva materia
        const nuevaMateriaData = {
            nombre,
            nivel,
            horario
        };

        // Solo agregar 'profesor' si se proporciona un valor válido
        if (profesor && mongoose.Types.ObjectId.isValid(profesor)) {
            nuevaMateriaData.profesor = profesor;
        }

        // Solo agregar 'curso' si se proporciona un valor válido
        if (curso && mongoose.Types.ObjectId.isValid(curso)) {
            nuevaMateriaData.curso = curso;
        }

        // Crear la nueva materia con los datos
        const nuevaMateria = new Materia(nuevaMateriaData);

        // Guardar la nueva materia en la base de datos
        await nuevaMateria.save();

        res.status(201).json({ mensaje: 'Materia creada exitosamente', materia: nuevaMateria });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cargar la materia', error: error.message });
    }
    },

    mostrarMaterias: async (req, res) => {
        try {
            // Obtener todas las materias desde la base de datos
            const materias = await Materia.find()
                .populate('profesor')  // Esto obtiene los datos completos del profesor (si es necesario)
                .populate('curso');    // Esto obtiene los datos completos del curso (si es necesario)

            // Renderizar la vista de la lista de materias
            res.render('materias', { materias });
        } catch (error) {
            // Manejar errores y renderizar un mensaje adecuado
            res.status(500).render('error', { 
                mensaje: 'Error al obtener las materias', 
                error: error.message 
            });
        }
    }
};


module.exports = MateriaController;
