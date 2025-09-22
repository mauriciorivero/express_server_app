/**
 * Clase de conexión y operaciones con MongoDB Atlas
 *
 * Esta clase maneja toda la interacción con la base de datos MongoDB Atlas,
 * incluyendo conexión, desconexión y operaciones CRUD para las tareas ToDo.
 * Implementa el patrón Singleton para la gestión de la conexión.
 *
 * @class MongoConnection
 * @version 1.0.0
 */
const { MongoClient } = require('mongodb');

class MongoConnection {
    /**
     * Constructor de la clase MongoConnection
     * Inicializa la configuración de conexión a MongoDB Atlas
     */
    constructor() {
        // URI de conexión a MongoDB Atlas desde variables de entorno
        this.uri = process.env.MONGO_URI;

        // Cliente de MongoDB
        this.client = new MongoClient(this.uri);

        // Configuración de base de datos y colección desde variables de entorno
        this.dbName = process.env.DB_NAME;
        this.collectionName = process.env.COLLECTION_NAME;

        // Referencias a la base de datos y colección (inicializadas en connect())
        this.db = null;
        this.collection = null;
    }

    /**
     * Establece la conexión con MongoDB Atlas
     *
     * Este método debe ser llamado antes de realizar cualquier operación
     * con la base de datos. Inicializa las referencias a la base de datos
     * y colección específicas.
     *
     * @async
     * @throws {Error} Si falla la conexión a MongoDB
     * @returns {Promise<void>}
     */
    async connect() {
        try {
            // Establecer conexión con MongoDB Atlas
            await this.client.connect();
            console.log('Conectado a MongoDB Atlas');

            // Obtener referencia a la base de datos
            this.db = this.client.db(this.dbName);

            // Obtener referencia a la colección
            this.collection = this.db.collection(this.collectionName);
        } catch (error) {
            console.error('Error conectando a MongoDB:', error);
            throw error;
        }
    }

    /**
     * Inserta una nueva tarea ToDo en la base de datos
     *
     * @async
     * @param {ToDo} todo - Instancia de la clase ToDo a insertar
     * @throws {Error} Si falla la inserción
     * @returns {Promise<Object>} Resultado de la operación de inserción
     */
    async insertToDo(todo) {
        try {
            // Crear documento para MongoDB usando los datos del objeto ToDo
            const doc = {
                id: todo.id,
                title: todo.title,
                completed: todo.completed
            };

            // Insertar documento en la colección
            const result = await this.collection.insertOne(doc);
            console.log('ToDo insertado:', result.insertedId);

            return result;
        } catch (error) {
            console.error('Error insertando ToDo:', error);
            throw error;
        }
    }

    /**
     * Obtiene todas las tareas ToDo de la base de datos
     *
     * @async
     * @throws {Error} Si falla la consulta
     * @returns {Promise<Array>} Array con todas las tareas ToDo
     */
    async getAllToDos() {
        try {
            // Consultar todos los documentos de la colección
            const todos = await this.collection.find({}).toArray();
            console.log('ToDos obtenidos:', todos.length);

            return todos;
        } catch (error) {
            console.error('Error obteniendo ToDos:', error);
            throw error;
        }
    }

    /**
     * Actualiza una tarea ToDo existente en la base de datos
     *
     * @async
     * @param {number} id - ID de la tarea a actualizar
     * @param {Object} updateData - Objeto con los campos a actualizar
     * @throws {Error} Si falla la actualización
     * @returns {Promise<Object>} Resultado de la operación de actualización
     */
    async updateToDo(id, updateData) {
        try {
            // Actualizar documento usando el operador $set
            const result = await this.collection.updateOne({ id: id }, { $set: updateData });
            console.log('ToDo actualizado:', result.modifiedCount);

            return result;
        } catch (error) {
            console.error('Error actualizando ToDo:', error);
            throw error;
        }
    }

    /**
     * Elimina una tarea ToDo de la base de datos
     *
     * @async
     * @param {number} id - ID de la tarea a eliminar
     * @throws {Error} Si falla la eliminación
     * @returns {Promise<Object>} Resultado de la operación de eliminación
     */
    async deleteToDo(id) {
        try {
            // Eliminar documento por ID
            const result = await this.collection.deleteOne({ id: id });
            console.log('ToDo eliminado:', result.deletedCount);

            return result;
        } catch (error) {
            console.error('Error eliminando ToDo:', error);
            throw error;
        }
    }

    /**
     * Cierra la conexión con MongoDB Atlas
     *
     * Este método debe ser llamado al finalizar la aplicación
     * para liberar recursos correctamente.
     *
     * @async
     * @returns {Promise<void>}
     */
    async close() {
        try {
            // Cerrar conexión con MongoDB
            await this.client.close();
            console.log('Conexión a MongoDB cerrada');
        } catch (error) {
            console.error('Error cerrando conexión:', error);
        }
    }
}

module.exports = MongoConnection;