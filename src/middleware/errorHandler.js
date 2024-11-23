
// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error('Error capturado:', err);

  // Si el error tiene un array de errores (por ejemplo, de validaciones)
  if (err.errors) {
    return res.status(err.status || 400).json({
      success: false,
      message: err.message || 'Errores de validación',
      errors: err.errors, // Incluye los detalles de los errores
    });
  }

  // Otros errores
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    
  });
};


module.exports = errorHandler;
