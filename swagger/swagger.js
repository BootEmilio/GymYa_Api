const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GymYa API",
            version: "1.0.0",
            description: "API para la administración de gimnasios",
        },
        servers: [
            {
                url: 'https://api-gymya-api.onrender.com', // URL de tu API
            },
        ],
        components: {
            schemas: {
                Client: {
                    type: "object",
                    required: ["name", "email", "phone"],
                    properties: {
                        id: {
                            type: "string",
                            description: "ID autogenerado del cliente",
                        },
                        name: {
                            type: "string",
                            description: "Nombre del cliente",
                        },
                        email: {
                            type: "string",
                            description: "Email del cliente",
                        },
                        phone: {
                            type: "string",
                            description: "Número de teléfono del cliente",
                        },
                    },
                    example: {
                        id: "1",
                        name: "Jane Doe",
                        email: "jane.doe@example.com",
                        phone: "1234567890",
                    },
                },
                Gym: {
                    type: "object",
                    required: ["name", "location", "capacity"],
                    properties: {
                        id: {
                            type: "string",
                            description: "ID autogenerado del gimnasio",
                        },
                        name: {
                            type: "string",
                            description: "Nombre del gimnasio",
                        },
                        location: {
                            type: "string",
                            description: "Ubicación del gimnasio",
                        },
                        capacity: {
                            type: "number",
                            description: "Capacidad del gimnasio",
                        },
                    },
                    example: {
                        id: "1",
                        name: "Gym Center",
                        location: "Calle Falsa 123",
                        capacity: 50,
                    },
                },
                Trainer: {
                    type: "object",
                    required: ["name", "specialty", "experience"],
                    properties: {
                        id: {
                            type: "string",
                            description: "ID autogenerado del entrenador",
                        },
                        name: {
                            type: "string",
                            description: "Nombre del entrenador",
                        },
                        specialty: {
                            type: "string",
                            description: "Especialidad del entrenador",
                        },
                        experience: {
                            type: "number",
                            description: "Años de experiencia del entrenador",
                        },
                    },
                    example: {
                        id: "1",
                        name: "John Doe",
                        specialty: "CrossFit",
                        experience: 5,
                    },
                },
            },
        },
    },
    apis: ["./routes/*.js"], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;