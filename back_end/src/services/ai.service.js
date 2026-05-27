const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateResponse = async (message) => {

    try {

        const completion =
            await groq.chat.completions.create({

                model: "llama-3.1-8b-instant",

                messages: [
                    {
                        role: "system",

                        content: `
Eres KreIA Portfolio Engine.

Tu única función es generar JSON válido.

REGLAS:
- SOLO JSON
- NO markdown
- NO explicaciones
- NO texto extra
- NO cortar respuestas
- NO usar \`\`\`
- SIEMPRE cerrar arrays y objetos JSON
                        `,
                    },

                    {
                        role: "user",
                        content: message,
                    },
                ],

                temperature: 0.4,

                max_tokens: 2000,
            });

        return completion
            .choices[0]
            .message
            .content;

    } catch (error) {

        console.error(
            "GROQ ERROR:",
            error
        );

        throw new Error(
            error.message ||
            "Error generando respuesta"
        );
    }
};

module.exports = {
    generateResponse,
};