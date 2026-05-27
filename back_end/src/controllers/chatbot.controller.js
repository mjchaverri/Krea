const {
    selectPortfolioComponents,
} = require(
    "../services/portafolioGenerator.service"
);

const {
    generatePortfolio,
} = require(
    "../services/portfolioBuilder.service"
);

const sendMessage = async (
    req,
    res
) => {

    try {

        let { message } = req.body;

        // limpiar input
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

        // =====================================================
        // PASO 1
        // SELECCIONAR COMPONENTES
        // =====================================================

        const selectedResponse =
            await selectPortfolioComponents(
                message
            );

        // =====================================================
        // PASO 2
        // GENERAR PORTAFOLIO COMPLETO
        // =====================================================

        const portfolio =
            await generatePortfolio({

                userMessage: message,

                selectedComponents:
                    selectedResponse
                        .data
                        .componentesSeleccionados,
            });

        // =====================================================
        // RESPONSE FINAL
        // =====================================================

        return res.status(200).json({

            ok: true,

            message:
                selectedResponse.message,

            selectedComponents:
                selectedResponse
                    .data
                    .componentesSeleccionados,

            portfolio,
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
                process.env.NODE_ENV ===
                    "development"
                    ? error.message
                    : undefined,
        });
    }
};

module.exports = {
    sendMessage,
};