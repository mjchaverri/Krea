const {
    generateResponse,
} = require("../services/ai.service");

const sendMessage = async (req, res) => {
    try {

        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                ok: false,
                message: "El mensaje es requerido",
            });
        }

        const response =
            await generateResponse(message);

        return res.status(200).json({
            ok: true,
            response,
        });

    } catch (error) {

        console.error("CHATBOT ERROR:", error);

        return res.status(500).json({
            ok: false,
            message:
                error.message ||
                "Error interno del servidor",
        });
    }
};

module.exports = {
    sendMessage,
};