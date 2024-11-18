const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GymYa API",
            version: "2.1.0",
            description: "API para la administración de gimnasios",
        },
        servers: [
            {
                url: 'https://api-gymya-api.onrender.com/api',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    required: ["nombre_completo", "fecha_registro", "telefono", "username", "password"],
                    properties: {
                        id: { type: "string", description: "ID autogenerado del usuario" },
                        nombre_completo: { type: "string", description: "Nombre completo del usuario" },
                        fecha_registro: { type: "string", format: "date", description: "Fecha de registro del usuario" },
                        telefono: { type: "string", description: "Número de teléfono del usuario" },
                        activo: { type: "boolean", description: "Estado del usuario (activo o inactivo)" },
                        username: { type: "string", description: "Nombre de usuario para el inicio de sesión" },
                        password: { type: "string", description: "Contraseña del usuario (debe manejarse de manera segura)" },
                    },
                    example: {
                        id: "1",
                        nombre_completo: "Carlos Pérez",
                        fecha_registro: "2024-01-15",
                        telefono: "5551234567",
                        activo: true,
                        username: "cperez",
                        password: "12345",
                    },
                },
                Pago: {
                    type: "object",
                    required: ["id_cliente", "id_membresia", "monto", "metodo_pago"],
                    properties: {
                        id_cliente: { type: "string", description: "ID del cliente asociado al pago" },
                        id_membresia: { type: "string", description: "ID de la membresía asociada al pago" },
                        monto: { type: "number", format: "float", description: "Monto del pago" },
                        metodo_pago: { type: "string", description: "Método de pago utilizado (por ejemplo, tarjeta, efectivo)" },
                        estado: { type: "string", description: "Estado del pago (por defecto es 'Completado')" },
                    },
                    example: {
                        id_cliente: "1",
                        id_membresia: "123",
                        monto: 500.00,
                        metodo_pago: "tarjeta",
                        estado: "Completado",
                    },
                },
                Accesos: {
                    type: "object",
                    required: ["id", "id_cliente", "fecha_hora_acceso", "tipo_acceso"],
                    properties: {
                        id: { type: "integer", description: "ID del acceso" },
                        id_cliente: { type: "integer", description: "ID del cliente que realizó el acceso" },
                        fecha_hora_acceso: { type: "string", format: "date-time", description: "Fecha y hora del acceso" },
                        tipo_acceso: { type: "string", description: "Tipo de acceso realizado" },
                    },
                    example: {
                        id: 1,
                        id_cliente: 101,
                        fecha_hora_acceso: "2024-10-30T10:15:30Z",
                        tipo_acceso: "entrada",
                    },
                },
            },
        },
        paths: {
            "/login": {
                post: {
                    summary: "Iniciar sesión",
                    description: "Permite a un usuario autenticarse en la aplicación",
                    tags: ["Auth"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        username: { type: "string", description: "Nombre de usuario del cliente" },
                                        password: { type: "string", description: "Contraseña del cliente" },
                                    },
                                    required: ["username", "password"],
                                    example: { username: "cperez", password: "12345" },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Inicio de sesión exitoso",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            token: { type: "string", description: "Token JWT para autenticación" },
                                        },
                                        example: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                                    },
                                },
                            },
                        },
                        401: { description: "Credenciales inválidas" },
                    },
                },
            },
            "/accesos": {
                get: {
                    summary: "Obtener todos los accesos con paginación",
                    description: "Devuelve una lista de todos los accesos registrados con soporte para paginación",
                    tags: ["Accesos"],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "page",
                            in: "query",
                            schema: { type: "integer", default: 1 },
                            description: "Número de la página a obtener",
                        },
                        {
                            name: "limit",
                            in: "query",
                            schema: { type: "integer", default: 10 },
                            description: "Número de elementos por página",
                        },
                    ],
                    responses: {
                        200: {
                            description: "Lista de accesos obtenida exitosamente",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            currentPage: { type: "integer", example: 1 },
                                            totalPages: { type: "integer", example: 5 },
                                            totalItems: { type: "integer", example: 50 },
                                            data: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Accesos" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: "Token inválido o no proporcionado" },
                    },
                },
            },
            "/accesos/{id}": {
                get: {
                    summary: "Obtener un acceso por ID",
                    description: "Devuelve información detallada de un acceso específico",
                    tags: ["Accesos"],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: { type: "integer" },
                            description: "ID del acceso a obtener",
                        },
                    ],
                    responses: {
                        200: {
                            description: "Información del acceso obtenida exitosamente",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Accesos" },
                                },
                            },
                        },
                        401: { description: "Token inválido o no proporcionado" },
                        404: { description: "Acceso no encontrado" },
                    },
                },
            },
            "/pagos": {
                get: {
        summary: "Listar todos los pagos",
        description: "Retorna una lista de todos los pagos registrados en el sistema con soporte para paginación.",
        tags: ["Pagos"],
        parameters: [
            {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 },
                description: "Número de la página a obtener.",
            },
            {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10 },
                description: "Número de elementos por página.",
            },
        ],
        responses: {
            200: {
                description: "Lista de pagos obtenida exitosamente.",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                currentPage: { type: "integer", example: 1 },
                                totalPages: { type: "integer", example: 5 },
                                totalItems: { type: "integer", example: 50 },
                                data: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Pago" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    post: {
        summary: "Registrar un nuevo pago",
        description: "Permite registrar un nuevo pago en el sistema.",
        tags: ["Pagos"],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/Pago" },
                },
            },
        },
        responses: {
            201: {
                description: "Pago registrado exitosamente.",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Pago" },
                    },
                },
            },
            400: { description: "Datos del pago inválidos." },
        },
    },
},
"/pagos/{id}": {
    get: {
        summary: "Obtener un pago por ID",
        description: "Retorna los detalles de un pago específico identificado por su ID.",
        tags: ["Pagos"],
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" },
                description: "ID del pago a obtener.",
            },
        ],
        responses: {
            200: {
                description: "Pago obtenido exitosamente.",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Pago" },
                    },
                },
            },
            404: { description: "Pago no encontrado." },
        },
    },
    patch: {
        summary: "Actualizar el estado de un pago",
        description: "Permite actualizar el estado de un pago existente.",
        tags: ["Pagos"],
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" },
                description: "ID del pago.",
            },
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            estado: { type: "string", description: "Nuevo estado del pago." },
                        },
                        example: { estado: "Completado" },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Estado del pago actualizado exitosamente.",
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Pago" },
                    },
                },
            },
            404: { description: "Pago no encontrado." },
        },
    },
},
"/pagos/clientes/{id_cliente}": {
    get: {
        summary: "Obtener todos los pagos de un cliente específico",
        description: "Retorna todos los pagos realizados por un cliente específico con soporte para paginación.",
        tags: ["Pagos"],
        parameters: [
            {
                name: "id_cliente",
                in: "path",
                required: true,
                schema: { type: "integer" },
                description: "ID del cliente.",
            },
            {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 },
                description: "Número de la página a obtener.",
            },
            {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10 },
                description: "Número de elementos por página.",
            },
        ],
        responses: {
            200: {
                description: "Pagos del cliente obtenidos exitosamente.",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                currentPage: { type: "integer", example: 1 },
                                totalPages: { type: "integer", example: 5 },
                                totalItems: { type: "integer", example: 20 },
                                data: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Pago" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
},
"/pagos/pendientes": {
    get: {
        summary: "Listar pagos pendientes",
        description: "Retorna una lista de todos los pagos con estado 'Pendiente' con soporte para paginación.",
        tags: ["Pagos"],
        parameters: [
            {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 },
                description: "Número de la página a obtener.",
            },
            {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10 },
                description: "Número de elementos por página.",
            },
        ],
        responses: {
            200: {
                description: "Lista de pagos pendientes obtenida exitosamente.",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                currentPage: { type: "integer", example: 1 },
                                totalPages: { type: "integer", example: 3 },
                                totalItems: { type: "integer", example: 30 },
                                data: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Pago" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
},

        },
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
