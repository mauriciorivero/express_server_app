# API REST de Gestión de Tareas (ToDo) con Node.js, Express y MongoDB

## 🎯 Introducción

Esta es una aplicación API REST completa para gestionar tareas (ToDos) construida con Node.js, Express.js y MongoDB Atlas. El proyecto demuestra las mejores prácticas en el desarrollo de APIs RESTful, incluyendo arquitectura modular, validación de datos, manejo de errores y persistencia en base de datos NoSQL.

## 📚 Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución JavaScript del lado del servidor
- **Express.js**: Framework web minimalista para Node.js
- **MongoDB Atlas**: Base de datos NoSQL en la nube
- **Mongoose/MongoDB Driver**: Para la conexión y operaciones con MongoDB

## 🏗️ Arquitectura del Proyecto

```
express_server_app/
├── controllers/
│   └── ToDoController.js      # Lógica de negocio para ToDos
├── middlewares/
│   ├── validation.js          # Validación de entrada de datos
│   └── errorHandler.js        # Manejo global de errores
├── models/
│   ├── ToDo.js               # Modelo de datos ToDo
│   └── MongoConnection.js    # Conexión a MongoDB
├── routes/
│   └── ToDoRoutes.js         # Definición de rutas CRUD
├── index.js                  # Punto de entrada de la aplicación
├── package.json              # Dependencias y configuración
└── README.md                 # Esta documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- Cuenta en MongoDB Atlas
- npm o yarn

### Pasos de Instalación

1. **Clona o descarga el proyecto**
   ```bash
   git clone <url-del-repositorio>
   cd express_server_app
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura MongoDB Atlas**
   - Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Crea un cluster gratuito
   - Obtén la cadena de conexión (connection string)

4. **Configura las variables de entorno**
   - Crea un archivo `.env` en la raíz del proyecto
   - Copia el contenido del archivo `.env.example` o configura las siguientes variables:
     ```
     MONGO_URI=tu_cadena_de_conexion_aqui
     DB_NAME=ToDo
     COLLECTION_NAME=todoList
     ```
   - Reemplaza `tu_cadena_de_conexion_aqui` con la cadena de conexión obtenida de MongoDB Atlas

5. **Ejecuta la aplicación**
   ```bash
   node index.js
   ```

6. **Verifica que funciona**
   - Abre tu navegador en `http://localhost:3001/todos`
   - Deberías ver una lista de tareas en formato JSON

## 📖 Desarrollo Paso a Paso

### Paso 1: Configuración Inicial del Proyecto

Comenzamos creando un servidor Express básico con una ruta simple para obtener tareas.

```javascript
const express = require('express');
const app = express();
const port = 3001;

app.get('/todos', (req, res) => {
    res.json([{ id: 1, title: 'Tarea de ejemplo', completed: false }]);
});

app.listen(port, () => {
    console.log('Servidor corriendo en el puerto 3001');
});
```

### Paso 2: Creación del Modelo ToDo

Creamos una clase ToDo con encapsulación de datos usando atributos privados y getters/setters.

```javascript
class ToDo {
    #id;
    #title;
    #completed;

    constructor(id, title, completed = false) {
        this.#id = id;
        this.#title = title;
        this.#completed = completed;
    }

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    // ... getters y setters para title y completed
}
```

### Paso 3: Conexión a MongoDB

Implementamos una clase para manejar la conexión a MongoDB Atlas con métodos CRUD básicos.

```javascript
class MongoConnection {
    constructor() {
        this.uri = 'mongodb+srv://...';
        this.client = new MongoClient(this.uri);
        // ... configuración
    }

    async connect() { /* ... */ }
    async insertToDo(todo) { /* ... */ }
    async getAllToDos() { /* ... */ }
    // ... otros métodos CRUD
}
```

### Paso 4: Arquitectura MVC - Controlador

Creamos un controlador que maneja la lógica de negocio separada de las rutas.

```javascript
class ToDoController {
    constructor() {
        this.mongo = new MongoConnection();
    }

    async getAll(req, res, next) {
        try {
            const todos = await this.mongo.getAllToDos();
            res.json(todos);
        } catch (error) {
            next(error);
        }
    }
    // ... otros métodos CRUD
}
```

### Paso 5: Middlewares de Validación

Implementamos middlewares para validar la entrada de datos y manejar errores.

```javascript
const validateToDo = (req, res, next) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'El título es requerido' });
    }
    next();
};
```

### Paso 6: Definición de Rutas

Creamos un router separado con todas las rutas CRUD aplicando los middlewares.

```javascript
const router = express.Router();

router.get('/', controller.getAll.bind(controller));
router.post('/', validateToDo, controller.create.bind(controller));
// ... otras rutas CRUD
```

### Paso 7: Integración Final

En `index.js`, integramos todo el sistema:

```javascript
const express = require('express');
const todoRoutes = require('./routes/ToDoRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/todos', todoRoutes);
app.use(errorHandler);

app.listen(3001, () => {
    console.log('Servidor corriendo en el puerto 3001');
});
```

## 📋 API Endpoints

### Base URL: `http://localhost:3001`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/todos` | Obtener todas las tareas |
| GET | `/todos/:id` | Obtener una tarea específica |
| POST | `/todos` | Crear una nueva tarea |
| PUT | `/todos/:id` | Actualizar una tarea |
| DELETE | `/todos/:id` | Eliminar una tarea |

### Ejemplos de Uso

#### Crear una tarea
```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Aprender Node.js", "completed": false}'
```

#### Obtener todas las tareas
```bash
curl http://localhost:3001/todos
```

#### Actualizar una tarea
```bash
curl -X PUT http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## 🔧 Estructura de Datos

### ToDo Object
```json
{
  "id": 1,
  "title": "Título de la tarea",
  "completed": false
}
```

## 🛠️ Mejores Prácticas Implementadas

1. **Separación de responsabilidades**: MVC clara con modelos, vistas (JSON) y controladores
2. **Validación de entrada**: Middlewares que validan datos antes del procesamiento
3. **Manejo de errores**: Sistema centralizado de manejo de errores
4. **Encapsulación**: Atributos privados en las clases
5. **Persistencia**: Datos guardados en MongoDB Atlas
6. **Documentación**: Comentarios JSDoc en todas las funciones
7. **Modularidad**: Código organizado en módulos reutilizables

## 🚀 Despliegue en Vercel

Este proyecto está configurado para desplegarse fácilmente en Vercel. Sigue estos pasos:

### Prerrequisitos para Despliegue

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub, GitLab o Bitbucket

### Pasos de Despliegue

1. **Conecta tu repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com) y crea una cuenta
   - Haz clic en "New Project" e importa tu repositorio

2. **Configura las variables de entorno**
   - En el dashboard de Vercel, ve a tu proyecto
   - Ve a "Settings" > "Environment Variables"
   - Agrega las siguientes variables:
     - `MONGO_URI`: Tu cadena de conexión de MongoDB Atlas
     - `DB_NAME`: `ToDo`
     - `COLLECTION_NAME`: `todoList`

3. **Despliega**
   - Vercel detectará automáticamente la configuración en `vercel.json`
   - El despliegue comenzará automáticamente
   - Una vez completado, obtendrás una URL como `https://tu-proyecto.vercel.app`

4. **Configura MongoDB Atlas**
   - Asegúrate de que tu cluster permita conexiones desde cualquier IP (0.0.0.0/0)
   - O agrega las IPs de Vercel a la whitelist de MongoDB Atlas

### Notas Importantes

- **Tiempo de ejecución**: Vercel tiene límites de 10 segundos para funciones serverless en el plan gratuito
- **Conexiones a BD**: Las conexiones se cierran entre requests en serverless
- **Variables de entorno**: Nunca subas `.env` al repositorio (ya está en `.gitignore`)

## 🚀 Próximos Pasos

- Implementar autenticación JWT
- Agregar paginación a las consultas
- Crear tests unitarios e integración
- Implementar logging avanzado
- Agregar documentación con Swagger
- Desplegar en otros servicios como Heroku

## 📞 Soporte

Si tienes preguntas sobre el código o necesitas ayuda para extender la funcionalidad, revisa los comentarios en el código fuente o consulta la documentación de las tecnologías utilizadas.

---

**¡Felicitaciones!** Has completado una API REST completa siguiendo las mejores prácticas de desarrollo web. Este proyecto te servirá como base sólida para aplicaciones más complejas.