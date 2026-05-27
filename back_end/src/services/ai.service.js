const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateResponse = async (message, systemMessage = null) => {

    try {

        const completion =
            await groq.chat.completions.create({

                model: "llama-3.1-8b-instant",

                messages: [
                    {
                        role: "system",
                        content: systemMessage || "Eres KreIA. Responde SOLO con JSON válido, sin texto extra ni markdown.",
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],

                temperature: 0.4,

                max_tokens: 3000,
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
