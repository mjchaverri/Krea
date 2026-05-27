const {
    selectPortfolioComponents,
} = require("../services/portafolioGenerator.service");

const {
    generatePortfolio,
} = require("../services/portfolioBuilder.service");

// =====================================================
// PALABRAS DE CONTROL
// =====================================================

const SALUDOS = [
    "hola", "hi", "hello", "holi", "hey", "buenas",
    "buen dia", "buenos dias", "buenas tardes", "buenas noches",
    "confirmar", "quedarse con este estilo", "quiero probar otro estilo",
];

// =====================================================
// HELPERS
// =====================================================

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

            const esEstilo = estilosKeywords.some(k =>
                lower === k || lower.startsWith(k)
            );

            return (
                c.length > 5 &&
                !SALUDOS.includes(lower) &&
                !esEstilo
            );
        });

    const msgLower = message.toLowerCase().trim();

    const msgEsEstilo = estilosKeywords.some(k =>
        msgLower === k || msgLower.startsWith(k)
    );

    const msgEsSaludo = SALUDOS.includes(msgLower);

    if (!msgEsEstilo && !msgEsSaludo && !esAccionUI(message) && message.length > 5) {
        mensajesProfesion.push(message);
    }

    return mensajesProfesion.length > 0
        ? [...new Set(mensajesProfesion)].join(". ")
        : message;
};

// =====================================================
// PROCESAR IMÁGENES (AI + USER UPLOAD)
// =====================================================

const processImages = (portfolio = []) => {
    return portfolio.map(block => {

        const data = block.data || {};

        if (typeof data.imageUrl === "string") {

            if (data.imageUrl.startsWith("USER_UPLOAD")) {
                data.needsUpload = true;
            }

            if (data.imageUrl.startsWith("AI_GENERATE")) {
                data.aiPrompt = data.imageUrl.replace("AI_GENERATE:", "").trim();
            }
        }

        return {
            ...block,
            data,
        };
    });
};

// =====================================================
// CONTROLADOR PRINCIPAL
// =====================================================

const sendMessage = async (req, res) => {

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
        // CONFIRMAR
        // =====================================================

        if (message === "confirmar") {
            return res.status(200).json({
                ok: true,
                message: "¡Perfecto! Tu portafolio está listo.",
                portfolio: [],
            });
        }

        // =====================================================
        // ELEGIR ESTILO → GENERAR PORTAFOLIO
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

            const portfolioRaw = await generatePortfolio({
                userMessage: profDesc || "portafolio profesional",
                selectedComponents: opcionSeleccionada.componentesSeleccionados,
                colores: opcionSeleccionada.colores,
            });

            const portfolio = processImages(portfolioRaw);

            return res.status(200).json({
                ok: true,
                message: portfolio.length > 0
                    ? "¿Te gusta este estilo? Puedes confirmarlo o probar otro."
                    : "Hubo un problema generando la vista previa.",
                portfolio,
                esPreview: portfolio.length > 0,
            });
        }

        // =====================================================
        // PASO 1 → IA (SIEMPRE DEBE DAR OPCIONES)
        // =====================================================

        const selectedResponse = await selectPortfolioComponents(
            message,
            historialLimpio
        );

        // fallback defensivo (por si la IA falla)
        if (!selectedResponse || !selectedResponse.intencion) {
            return res.status(500).json({
                ok: false,
                message: "Error interpretando la solicitud",
            });
        }

        // =====================================================
        // RESPUESTAS SIMPLES
        // =====================================================

        if (
            selectedResponse.intencion === "chat" ||
            selectedResponse.intencion === "preguntar"
        ) {
            return res.status(200).json({
                ok: true,
                message: selectedResponse.message,
                opciones: [],
                portfolio: [],
            });
        }

        // 🔥 SIEMPRE OPCIONES
        if (selectedResponse.intencion === "opciones") {
            return res.status(200).json({
                ok: true,
                message: selectedResponse.message,
                opciones: selectedResponse.opciones || [],
                portfolio: [],
            });
        }

        // =====================================================
        // SEGURIDAD: NO GENERAR PORTAFOLIO SIN ELEGIR
        // =====================================================

        if (selectedResponse.intencion === "portafolio" && !opcionSeleccionada) {
            return res.status(200).json({
                ok: true,
                message: "Primero elige un estilo para continuar.",
                opciones: [],
                portfolio: [],
            });
        }

        // =====================================================
        // GENERACIÓN DIRECTA (fallback)
        // =====================================================

        const contextoCompleto = buildProfesionContext(historialLimpio, message);

        const coloresDefault = {
            fondo: "#FFFFFF",
            fondo2: "#F8FAFC",
            acento: "#0EA5E9",
            texto: "#0F172A",
            tipografia: "Inter, sans-serif",
        };

        const portfolioRaw = await generatePortfolio({
            userMessage: contextoCompleto,
            selectedComponents: selectedResponse.data?.componentesSeleccionados || [],
            colores: selectedResponse.data?.colores || coloresDefault,
        });

        const portfolio = processImages(portfolioRaw);

        return res.status(200).json({
            ok: true,
            message: selectedResponse.message || "Aquí tienes tu portafolio",
            selectedComponents: selectedResponse.data?.componentesSeleccionados || [],
            portfolio,
        });

    } catch (error) {

        console.error("CHATBOT ERROR:", error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            detail: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};

module.exports = {
    sendMessage,
};