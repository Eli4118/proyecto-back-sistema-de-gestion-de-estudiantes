
# Sistema de Gestión de Estudiantes

## Descripción
Este proyecto implementa un sistema de gestión académica para la **Escuela Italiana**, diseñado para automatizar y optimizar procesos administrativos como el registro de estudiantes, la inscripción en cursos, la asignación de calificaciones. El sistema está desarrollado con tecnologías modernas, asegurando una solución escalable, segura y accesible.

---

## Características Principales
- **Gestión de Usuarios**: CRUD para estudiantes, profesores, tutores y administradores.
- **Inscripción en Cursos**: Registro automatizado con validación de cupos.
- **Gestión de Calificaciones**: Asignación, edición y consulta de notas por parte de los profesores.
- **Consulta de Historial Académico**: Para estudiantes y tutores.
- **Panel Administrativo**: Gestión de cursos, usuarios y horarios.
- **Seguridad**: Autenticación por roles,JWT,Cookie,bcrypt(estudiante, tutor, profesor, administrador) con control de acceso.

---

## Tecnologías Utilizadas
- **Backend**: Node.js, Express.js
- **Frontend**: Plantillas Pug y Bootstrap
- **Base de Datos**: MongoDB con Mongoose (ODM)
- **Otros**:
  - Middlewares personalizados para autenticación y control de acceso.
  - Dependencias como `body-parser` y `dotenv` para configuración y manejo de datos.

---

## Estructura del Proyecto
```plaintext
/src
  /config      	// Configuración del sistema
	- db.js        	// Configuración de la base de datos MongoDB	
  /controllers 	// Lógica de negocio y controladores
	- usuarioController.js  // Controlador para la gestión de usuarios
	- cursoController.js	// Controlador para la gestión de cursos
	- notaController.js 	// Controlador para la gestión de notas
  /middleware  	// Middlewares para autenticación, roles y validaciones
	- authMiddleware.js 	// Verifica JWT para rutas protegidas
	- roleMiddleware.js 	// Verifica roles para control de acceso
	- validationMiddleware.js // Validaciones avanzadas con express-validator
  /models      	// Modelos de datos definidos con Mongoose
	- usuario.js    	// Modelo de usuario (estudiantes, profesores, etc.)
	- curso.js      	// Modelo de curso
	- nota.js       	// Modelo de notas
	- materia.js    	// Modelo de materias
  /routers     	// Rutas organizadas por módulos
	- usuarioRoutes.js  // Rutas para la gestión de usuarios
	- cursoRoutes.js	// Rutas para cursos
	- notaRoutes.js 	// Rutas para notas
	- authRoutes.js 	// Rutas para autenticación
  /utils       	// Utilidades y funciones auxiliares
	- sessionUtils.js   // Funciones para gestionar cookies y sesiones
	- errorHandler.js   // Manejo centralizado de errores
  - jwt.js 	// Configuración de claves secretas para JWT
  /views       	// Plantillas de vistas creadas con Pug
	- layout.pug    	// Plantilla base reutilizable
	- login.pug     	// Vista de formulario de inicio de sesión
	- dashboard.pug 	// Panel principal del sistema
	- cursos.pug    	// Vista para la gestión de cursos
	- estudiantes.pug   // Vista para gestionar estudiantes
	- notas.pug     	// Vista para gestionar notas
.env           	// Variables de entorno (claves, URLs, configuraciones)
app.js         	// Archivo principal del servidor
package.json   	// Dependencias y scripts del proyecto
```

---

## Requisitos Previos
1. **Node.js**: [Descargar Node.js](https://nodejs.org/)
2. **MongoDB**: Base de datos local o en la nube.
3. **Git**: Para clonar el repositorio.

---

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Eli4118/proyecto-back-sistema-de-gestion-de-estudiantes.git
   cd proyecto-back-sistema-de-gestion-de-estudiantes
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura la base de datos:
   - Edita `config/db.js` y ajusta la URL para tu instancia de MongoDB.
   - **Prueba**: Se incluye una base de datos de ejemplo en el archivo `.env`.

4. Inicia el servidor:
   ```bash
   npm start
   ```
   El sistema estará disponible en [http://localhost:8000](http://localhost:8000).

---

## Credenciales de Prueba
- **Administrador**: `administrativo@example.com` / `1234`
- **Tutor**: `tutor@example.com` / `1234`
- **Estudiante**: `estudiante@example.com` / `1234`
- **Profesor**: `profesor@example.com` / `1234`

---

## Pruebas
- Pruebas realizadas con Postman para verificar:
  - Registro y autenticación.
  - Gestión de usuarios, cursos y calificaciones.
- **Cobertura**:
  - Funcionalidades principales como inscripción, consulta de notas y gestión de usuarios.
  - Control de acceso por roles.

---

## Próximos Pasos
- Mejorar la autenticación implementando **MFA**.
- Agregar notificaciones en tiempo real.
- Desarrollar un módulo avanzado de reportes.

---

## Contribuciones
Equipo: **Grupo 12 - Discordia**
- María Lis Acosta
- Dante Barrios
- Eliana Carmona
- Jonathan Marcori

--- 



