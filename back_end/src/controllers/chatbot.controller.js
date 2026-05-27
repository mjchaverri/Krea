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

// Palabras que indican saludo/off-topic
const SALUDOS = [
    "hola", "hi", "hello", "holi", "hey", "buenas",
    "buen dia", "buenos dias", "buenas tardes", "buenas noches",
    "confirmar", "quedarse con este estilo", "quiero probar otro estilo",
];

// Construye el contexto de profesión filtrando saludos y mensajes de acción UI
const buildProfesionContext = (historialLimpio, message) => {

    const estilosKeywords = [
        "minimalista-oscuro", "clean-blanco", "editorial-premium", "vibrante-creativo",
        "fotografico-elegante", "tecnologia-moderna", "arte-ilustracion", "arquitectura-preciso",
        "corporativo-profesional", "moda-lifestyle",
    ];

    const esAccionUI = (c) => {
        const l = c.toLowerCase().trim();
        return (
            c.startsWith("Ver estilo:") ||
            c.startsWith("elegir:") ||
            l === "confirmar" ||
            l === "quedarse con este estilo" ||
            l === "quiero probar otro estilo"
        );
    };

    const mensajesProfesion = historialLimpio
        .filter(m => m.role === "user")
        .map(m => m.content.trim())
        .filter(c => {
            if (esAccionUI(c)) return false;
            const lower = c.toLowerCase();
            const esEstilo = estilosKeywords.some(k => lower === k || lower === k + "!" || lower.startsWith(k + " "));
            return c.length > 5 && !SALUDOS.some(s => lower === s || lower === s + "!") && !esEstilo;
        });

    const msgLower = message.toLowerCase().trim();
    const msgEsEstilo = estilosKeywords.some(k => msgLower === k || msgLower.startsWith(k + " "));
    const msgEsSaludo = SALUDOS.some(s => msgLower === s || msgLower === s + "!");

    if (!msgEsEstilo && !msgEsSaludo && !esAccionUI(message) && message.length > 5) {
        mensajesProfesion.push(message);
    }

    return mensajesProfesion.length > 0
        ? [...new Set(mensajesProfesion)].join(". ")
        : message;
};

const sendMessage = async (
    req,
    res
) => {

    try {

        let { message, historial = [], opcionSeleccionada } = req.body;

        // limpiar input
        if (typeof message === "string") {
            message = message.trim();
        }

        if (!message) {
            return res.status(400).json({
                ok: false,
                message: "El mensaje es requerido",
            });
        }

        // sanitizar historial
        const historialLimpio = Array.isArray(historial)
            ? historial
                .filter(m => m && typeof m.role === "string" && typeof m.content === "string")
                .slice(-6)
            : [];

        // =====================================================
        // ACCIÓN: CONFIRMAR — el usuario aprueba el estilo
        // =====================================================

        if (message === "confirmar") {
            return res.status(200).json({
                ok: true,
                message: "¡Perfecto! Tu portafolio está listo.",
                portfolio: [],
            });
        }

        // =====================================================
        // ACCIÓN: ELEGIR — el usuario clicó una opción de estilo
        // =====================================================

        if (message.startsWith("elegir:")) {

            if (
                !opcionSeleccionada?.colores ||
                !Array.isArray(opcionSeleccionada?.componentesSeleccionados)
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "Opción de estilo inválida",
                });
            }

            const profDesc = buildProfesionContext(historialLimpio, "");

            const portfolio = await generatePortfolio({
                userMessage: profDesc || "portafolio profesional",
                selectedComponents: opcionSeleccionada.componentesSeleccionados,
                colores: opcionSeleccionada.colores,
            });

            return res.status(200).json({
                ok: true,
                message: portfolio.length > 0
                    ? "¿Te gusta este estilo? Puedes quedarte con él o probar otra opción."
                    : "Hubo un problema generando la vista previa. Intenta con otra opción.",
                portfolio,
                esPreview: portfolio.length > 0,
            });
        }

        // =====================================================
        // PASO 1 — SELECCIONAR COMPONENTES / INTENT
        // =====================================================

        const selectedResponse =
            await selectPortfolioComponents(
                message,
                historialLimpio
            );

        // =====================================================
        // RESPUESTAS SIN PORTAFOLIO
        // =====================================================

        if (
            selectedResponse.intencion === "chat" ||
            selectedResponse.intencion === "preguntar"
        ) {
            return res.status(200).json({
                ok: true,
                message: selectedResponse.message,
                selectedComponents: [],
                portfolio: [],
            });
        }

        if (selectedResponse.intencion === "opciones") {
            return res.status(200).json({
                ok: true,
                message: selectedResponse.message,
                opciones: selectedResponse.opciones,
                selectedComponents: [],
                portfolio: [],
            });
        }

        // =====================================================
        // PASO 2 — GENERAR PORTAFOLIO
        // =====================================================

        const contextoCompleto = buildProfesionContext(historialLimpio, message);

        // Para portafolio directo (sin pasar por opciones) usamos colores del tema por defecto
        const coloresDefault = {
            fondo: "#FFFFFF", fondo2: "#F8FAFC",
            acento: "#0EA5E9", texto: "#0F172A",
            tipografia: "Inter, sans-serif",
        };

        const portfolio =
            await generatePortfolio({
                userMessage: contextoCompleto,
                selectedComponents: selectedResponse.data.componentesSeleccionados,
                colores: selectedResponse.data.colores || coloresDefault,
            });

        const mensajeFinal = portfolio.length === 0
            ? "Hubo un problema generando el portafolio. ¿Puedes describir de nuevo qué tipo de portafolio quieres?"
            : selectedResponse.message;

        return res.status(200).json({
            ok: true,
            message: mensajeFinal,
            selectedComponents: selectedResponse.data.componentesSeleccionados,
            portfolio,
        });

    } catch (error) {

        console.error("CHATBOT ERROR:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            detail: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

module.exports = {
    sendMessage,
};
