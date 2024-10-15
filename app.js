const express = require('express');
const app = express();
const conectarDB = require('./src/config/db.js'); // Importar la función de conexión a la base de datos
const router = require('./src/routers/indexRoutes.js');// importa Archivo de rutas principal

// Conectar a la base de datos
conectarDB();

app.get('/', (request, response) => {
  response.send('Hola  mundo');// Ruta principal para la página de inicio
});

app.use(express.json());//midle esto es para poder recibir json

// seccion de rutas y middlewares 
// Usa el archivo router que incluye la ruta de estudiantes
app.use(router);

//midleware para rutas no reconocidas 

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





// Middleware de Express (para parsear JSON, etc.)
/* app.use(express.json()); */
