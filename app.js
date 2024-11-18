const express = require('express');
const app = express();
const path = require('path'); 
const conectarDB = require('./src/config/db.js'); // Importar la función de conexión a la base de datos
const router = require('./src/routers/indexRoutes.js');// importa Archivo de rutas principal
const sessionData = require('./src/middleware/sessionData.js')
//PREGUNTAR AL PROFE
//ver si necesitamos rutas para api
//preguntar si necesitamos poner camaras 

// Conectar a la base de datos
conectarDB();

// Configurar Pug como motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views')); // Carpeta donde estarán las vistas Pug

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usa el middleware de sessionData antes de las rutas
app.use(sessionData);
// Usa el archivo router que incluye la ruta de estudiantes
app.use(router);

//midleware para rutas no reconocidas 






// HOLA :D
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





// Middleware de Express (para parsear JSON, etc.)
/* app.use(express.json()); */
