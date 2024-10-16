// middleware/sessionData.js
const { getUsuarioAutenticado } = require('../utils/session');

// Middleware para pasar la información de la sesión a las vistas
const sessionData = (req, res, next) => {
    // Obtener el usuario autenticado de la sesión
    const usuario = getUsuarioAutenticado();

    // Pasar el usuario a las vistas como una variable global
    res.locals.usuarioAutenticado = usuario;

    // Continuar con la siguiente función de middleware o ruta
    next();
};

module.exports = sessionData;
