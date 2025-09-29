/**
 * Middleware de validación para las operaciones con tareas ToDo
 *
 * Este archivo contiene funciones middleware que validan los datos
 * de entrada antes de que lleguen a los controladores, asegurando
 * la integridad de los datos y proporcionando respuestas de error
 * consistentes.
 *
 * @module middlewares/validation
 */

/**
 * Middleware para validar los datos de una tarea ToDo
 *
 * Valida el título y el estado de completitud en las solicitudes
 * POST y PUT. Para POST, el título es obligatorio.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validateToDo = (req, res, next) => {
    // Extraer campos del cuerpo de la solicitud
    const { title, completed } = req.body;

    // Validar que el título esté presente en POST
    if (req.method === 'POST' && !title) {
        return res.status(400).json({ error: 'El campo "title" es requerido' });
    }

    // Validar tipo de dato del título si está presente
    if (title && typeof title !== 'string') {
        return res.status(400).json({ error: 'El campo "title" debe ser una cadena de texto' });
    }

    // Validar tipo de dato del estado de completitud si está presente
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'El campo "completed" debe ser un booleano' });
    }

    // Si todas las validaciones pasan, continuar
    next();
};

/**
 * Middleware para validar el parámetro ID en las rutas
 *
 * Convierte el ID de string a número y valida que sea un número válido.
 *
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const validateId = (req, res, next) => {
    // Convertir el parámetro de ruta a número
    const id = parseInt(req.params.id);

    // Validar que sea un número válido
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido' });
    }

    // Actualizar el parámetro con el valor convertido
    req.params.id = id;

    // Continuar al siguiente middleware
    next();
};

// Exportar las funciones de validación
module.exports = {
    validateToDo,
    validateId
};