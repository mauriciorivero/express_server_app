/**
 * Archivo principal de la aplicación API REST ToDo
 *
 * Este archivo configura el servidor Express.js, integra las rutas de la API
 * y configura los middlewares globales para el manejo de errores.
 *
 * Arquitectura: MVC (Model-View-Controller) con middlewares
 * Tecnologías: Node.js, Express.js, MongoDB Atlas
 *
 * @author Estudiante de Programación Web
 * @version 1.0.0
 */

// Cargar variables de entorno
require('dotenv').config();

// Importaciones de módulos
const express = require('express');                    // Framework web para Node.js
const todoRoutes = require('./routes/ToDoRoutes');    // Rutas de la API ToDo
const errorHandler = require('./middlewares/errorHandler'); // Middleware de errores

// Configuración de la aplicación Express
const app = express();     // Instancia principal de Express
const port = process.env.PORT;         // Puerto del servidor (dinámico para Vercel)

// Middlewares globales
app.use(express.json());   // Middleware para parsear JSON en requests

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API REST de Gestión de Tareas (ToDo)',
        version: '1.0.0',
        endpoints: {
            todos: '/todos',
            docs: 'Ver README.md para documentación completa'
        }
    });
});

// Configuración de rutas
// Todas las rutas relacionadas con ToDos estarán bajo /todos
app.use('/todos', todoRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Exportar la aplicación para Vercel (serverless)
module.exports = app;

// Solo para desarrollo local
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor corriendo en el puerto ${port}`);
        console.log(`API disponible en: http://localhost:${port}/todos`);
    });
}
