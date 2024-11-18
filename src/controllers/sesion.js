const Usuario = require('../models/usuarios'); // Importa el esquema base
const { setUsuarioAutenticado  } = require('../utils/session');
const SesionController = {

    login:  async (req, res) => {
        const { correo, password } = req.body;
         try {
        // Buscar al usuario por correo
          const usuario = await Usuario.findOne({ correo });
          if (!usuario) {
          return res.status(400).json({ mensaje: 'Usuario no encontrado' });
          }
        // Comparar la contraseña (agregar contraseña en el model)
       /*  const esPasswordValido = usuario.compararPassword(password);
        if (!esPasswordValido) {
        return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        } */
           // Simulación de sesión: Guardar el usuario en req
           setUsuarioAutenticado(usuario);
          //res.json({ mensaje: `Inicio de sesión exitoso como ${usuario.nombres}`, usuario });
          res.redirect('/home2');
        } catch (error) {
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
        }
    },
    // cierre de sesión
    logout: (req, res) => {
        setUsuarioAutenticado(null); 
       // res.json({ mensaje: 'Cierre de sesión exitoso' });
       res.redirect('/');
    },
}
module.exports = SesionController;