import swaggerJsdoc from 'swagger-jsdoc';/// const sintaxis mala

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GymYa.api',
            version: '1.0.6',
            description: 'API para servicios de gimasios',
            contact: {
                name: 'GymYa-Team'
            },
            servers: [
                {
                    url: 'https://api-gymya-api.onrender.com',
                    description: 'Render'
                }
            ]
        }
    },
    apis: ['../routes/*.js']
};

const specs = swaggerJsdoc(options);
export default specs;//// const sintaxis mala