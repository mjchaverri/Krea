const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi   = require("swagger-ui-express")

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Krea API",
            version: "1.0.0",
            description: "Documentación de la API de la plataforma Krea"
        },
        servers: [{ url: "http://localhost:3000", description: "Servidor local" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./src/routes/*.js"]
}

const swaggerSpec = swaggerJsdoc(options)

const setupSwagger = (app) => {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = setupSwagger
