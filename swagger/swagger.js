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
                url: 'https://api-gymya-api.onrender.com', // URL de tu API
            },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    required: ["nombre_completo", "fecha_registro", "telefono", "username", "password"],
                    properties: {
                        id: {
                            type: "string",
                            description: "ID autogenerado del usuario",
                        },
                        nombre_completo: {
                            type: "string",
                            description: "Nombre completo del usuario",
                        },
                        fecha_registro: {
                            type: "string",
                            format: "date",
                            description: "Fecha de registro del usuario",
                        },
                        telefono: {
                            type: "string",
                            description: "Número de teléfono del usuario",
                        },
                        activo: {
                            type: "boolean",
                            description: "Estado del usuario (activo o inactivo)",
                        },
                        username: {
                            type: "string",
                            description: "Nombre de usuario para el inicio de sesión",
                        },
                        password: {
                            type: "string",
                            description: "Contraseña del usuario (debe manejarse de manera segura)",
                        },
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
                        id_cliente: {
                            type: "string",
                            description: "ID del cliente asociado al pago",
                        },
                        id_membresia: {
                            type: "string",
                            description: "ID de la membresía asociada al pago",
                        },
                        monto: {
                            type: "number",
                            format: "float",
                            description: "Monto del pago",
                        },
                        metodo_pago: {
                            type: "string",
                            description: "Método de pago utilizado (por ejemplo, tarjeta, efectivo)",
                        },
                        estado: {
                            type: "string",
                            description: "Estado del pago (por defecto es 'Completado')",
                        },
                    },
                    example: {
                        id_cliente: "1",
                        id_membresia: "123",
                        monto: 500.00,
                        metodo_pago: "tarjeta",
                        estado: "Completado",
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
                                        username: {
                                            type: "string",
                                            description: "Nombre de usuario del cliente",
                                        },
                                        password: {
                                            type: "string",
                                            description: "Contraseña del cliente",
                                        },
                                    },
                                    required: ["username", "password"],
                                    example: {
                                        username: "cperez",
                                        password: "12345",
                                    },
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
                                            token: {
                                                type: "string",
                                                description: "Token JWT para autenticación",
                                            },
                                        },
                                        example: {
                                            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: "Credenciales inválidas",
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