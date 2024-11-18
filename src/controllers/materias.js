const Materia = require('../models/materias');
const Usuario = require('../models/usuarios');
const Curso = require('../models/cursos');

const MateriaController = {
    cargarMateria: async (req, res) => {
        const { nombre, nivel, profesor, curso, horario } = req.body;
        
        try {
            // Verificar si la materia ya existe en ese nivel
            const materiaExistente = await Materia.findOne({ nombre, nivel });

            if (materiaExistente) {
                return res.status(400).json({ 
                    error: `La materia "${nombre}" ya existe en el nivel "${nivel}".` 
                });
            }

        // Construir el objeto de la nueva materia
        const nuevaMateriaData = {
            nombre,
            nivel,
            profesor: profesor || null,
            curso: curso || null,
            horario: horario || null,
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
        
        return res.status(201).json({ mensaje: 'Materia creada exitosamente', materia: nuevaMateria });
    } catch (error) {
        console.error('Error al crear materia:', error);
        return res.status(400).json({ error: 'Error al crear la materia', details: error.message });
    }
    },

    mostrarMaterias: async (req, res) => {
        try {
            // Obtener todas las materias desde la base de datos
            const materias = await Materia.find()
                .populate('profesor')  // Esto obtiene los datos completos del profesor (si es necesario)
                .populate('curso')   // Esto obtiene los datos completos del curso (si es necesario)
                .exec();
            // Renderizar la vista de la lista de materias
            res.render('materias', { materias });
        } catch (error) {
            // Manejar errores y renderizar un mensaje adecuado
            res.status(500).render('error', { 
                mensaje: 'Error al obtener las materias', 
                error: error.message 
            });
        }
    },

    mostrarFormularioEdicion: async (req, res) => {
        try {
            const materia = await Materia.findById(req.params.id)
                .populate('profesor') // Trae solo el nombre del profesor
                .populate('curso', 'nombre');  // Trae solo el nombre del curso
                
            if (!materia) {
                return res.status(404).send('Materia no encontrada');
            }
    
            // Obtener todos los profesores que podrían dar esa materia, basándonos en el nivel
            const profesores = await Usuario.find({
                'materias.nivel': materia.nivel // Busca profesores que enseñen en el nivel de la materia
            }, 'nombre');

            // Obtener todos los grados (del 1 al 6)
            const grados = [1, 2, 3, 4, 5, 6];

            // Renderiza la vista de edición con los datos precargados
            res.render('editar', {
                materia,
                profesores, // Profesores disponibles para ese nivel
                grados,     // Grados disponibles (1 a 6)
            });
        } catch (error) {
            res.status(500).send('Error al cargar la materia');
        }
    },   
    editarMateria: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, nivel, profesor, curso, horario } = req.body;
    
            const materiaEditada = await Materia.findByIdAndUpdate(
                id,
                { nombre, nivel, profesor, curso, horario },
                { new: true, runValidators: true }
            );
    
            if (!materiaEditada) {
                return res.status(404).render('error', { mensaje: 'Materia no encontrada para editar' });
            }
    
            res.redirect('/materias');
        } catch (error) {
            console.error('Error al editar materia:', error);
            res.status(500).render('error', { mensaje: 'Error al editar materia' });
        }
    },

    eliminarMateria: async (req, res) => {
        try {
            const { id } = req.params;
            const materiaEliminada = await Materia.findByIdAndDelete(id);
    
            if (!materiaEliminada) {
                return res.status(404).render('error', { mensaje: 'Materia no encontrada para eliminar' });
            }
    
            res.redirect('/materias');
        } catch (error) {
            console.error('Error al eliminar materia:', error);
            res.status(500).render('error', { mensaje: 'Error al eliminar materia' });
        }
    },
    
    
};


module.exports = MateriaController;
