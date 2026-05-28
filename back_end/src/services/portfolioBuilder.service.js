const { generateResponse } = require("./ai.service");
const { buildPortfolioPrompt } = require("../context/portafolioBuilder.prompt");

// =====================================================
// PARSE SEGURO
// =====================================================

const safeParse = (text) => {
    try {
        const clean = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        return JSON.parse(clean);
    } catch {
        try {
            const fixed = text
                .replace(/,\s*}/g, "}")
                .replace(/,\s*]/g, "]");
            return JSON.parse(fixed);
        } catch {
            console.error("❌ No se pudo parsear respuesta del builder");
            return [];
        }
    }
};

// =====================================================
// GENERAR PORTAFOLIO
// =====================================================

const generatePortfolio = async ({
    userMessage,
    selectedComponents,
    colores,
}) => {
    try {
        const prompt = buildPortfolioPrompt({ userMessage, selectedComponents, colores });

        const response = await generateResponse(prompt);

        console.log("RAW PORTFOLIO RESPONSE:", response);

        const parsed = safeParse(response);

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {
        console.error("PORTFOLIO BUILDER ERROR:", error);
        return [];
    }
};

module.exports = {
    generatePortfolio,
};
