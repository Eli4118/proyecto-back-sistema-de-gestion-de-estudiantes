
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const error = new Error('Error de validación');
    error.status = 400; // Código de estado HTTP
    error.errors = errores.array(); // Array de errores de validación
    throw error; // Lanza el error para que sea manejado globalmente
  }
  next();
};

module.exports = { handleValidationErrors };
