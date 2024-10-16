const { getUsuarioAutenticado } = require('../utils/session');

const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Obtener el usuario autenticado
    const usuario = getUsuarioAutenticado();

    // Si el usuario no está autenticado, redirigir al login con un mensaje
    if (!usuario) {
      return res.redirect('/');
    }

    // Si el usuario no tiene el rol adecuado, redirigir al login con un mensaje
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.redirect('/');
    }

    // Si el usuario tiene el rol adecuado, continuar
    next();
  };
};

module.exports = verificarRol;
