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

        const { message } = req.body;

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
            error
        );

        return res.status(500).json({
            ok: false,
            message:
                "Error interno del servidor",
        });
    }
};

module.exports = {
    sendMessage,
};