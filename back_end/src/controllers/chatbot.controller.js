const {
    selectPortfolioComponents,
} = require(
    "../services/portafolioGenerator.service"
);

const sendMessage = async (
    req,
    res
) => {

    try {

        let { message } = req.body;

        // 🧼 limpiar input
        if (typeof message === "string") {
            message = message.trim();
        }

        if (!message) {
            return res.status(400).json({
                ok: false,
                message:
                    "El mensaje es requerido",
            });
        }

        const response =
            await selectPortfolioComponents(
                message
            );

        return res.status(200).json({
            ok: true,
            response,
        });

    } catch (error) {

        console.error(
            "CHATBOT ERROR:",
            error.message
        );

        return res.status(500).json({
            ok: false,
            message:
                "Error interno del servidor",
            detail:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = {
    sendMessage,
};