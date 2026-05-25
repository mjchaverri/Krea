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
                            Eres un asistente experto en:
                            - diseño UX/UI
                            - frontend moderno
                            - creatividad visual
                            - portafolios digitales

                            Ayudas a usuarios a mejorar
                            sus proyectos visuales.
                        `,
                    },

                    {
                        role: "user",
                        content: message,
                    },
                ],

                temperature: 0.7,
                max_tokens: 500,
            });

        return completion.choices[0].message.content;

    } catch (error) {

        console.error("GROQ ERROR:", error);

        throw new Error(
            error.message || "Error generando respuesta"
        );
    }
};

module.exports = {
    generateResponse,
};