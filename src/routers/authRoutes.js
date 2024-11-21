const express = require('express');
const { validationResult } = require('express-validator');
const { registerValidation, loginValidation } = require('../validations/authValidations');

const authrouter = express.Router();

// Ruta de registro
authrouter.post('/register', registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Lógica para registrar al usuario
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

// Ruta de login
authrouter.post('/login', loginValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Lógica para iniciar sesión
  res.status(200).json({ message: 'Inicio de sesión exitoso' });
});

module.exports = authrouter;
