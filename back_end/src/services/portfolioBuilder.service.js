// services/portfolioBuilder.service.js

const {
    buildPortfolioPrompt,
} = require("../context/portafolioBuilder.prompt");

const {
    generateResponse,
} = require("./ai.service");

const {
    COMPONENT_REGISTRY,
} = require("../context/componentRegistry");

const extractJSON = (text) => {

    try {

        if (!text) {
            throw new Error("Respuesta vacía");
        }

        // =====================================
        // LIMPIEZA AGRESIVA
        // =====================================

        let cleanText = String(text)

            // BOM
            .replace(/^\uFEFF/, "")

            // NBSP
            .replace(/\u00A0/g, " ")

            // Zero width chars
            .replace(/[\u200B-\u200D\uFEFF]/g, "")

            // tabs raros
            .replace(/\t/g, " ")

            // normalizar saltos
            .replace(/\r/g, "")

            .trim();

        // =====================================
        // EXTRAER JSON
        // =====================================

        const match =
            cleanText.match(
                /(\{[\s\S]*\}|\[[\s\S]*\])/
            );

        if (!match) {
            throw new Error("No se encontró JSON");
        }

        let jsonString = match[0];

        // =====================================
        // FIX COMAS FLOTANTES
        // =====================================

        jsonString = jsonString
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");

        // =====================================
        // PARSE
        // =====================================

        return JSON.parse(jsonString);

    } catch (error) {

        console.error(
            "PORTFOLIO JSON ERROR:",
            error.message
        );

        console.error(
            "RAW RESPONSE:",
            text
        );

        throw new Error(
            "Error procesando portfolio JSON"
        );
    }
};

const validatePortfolioStructure = (
    portfolio
) => {

    if (!Array.isArray(portfolio)) {
        return [];
    }

    const validTypes =
        COMPONENT_REGISTRY.map(
            component => component.type
        );

    return portfolio.filter(component => {

        if (!component.type) {
            return false;
        }

        if (!validTypes.includes(component.type)) {
            return false;
        }

        if (!component.data) {
            return false;
        }

        return true;
    });
};

const generatePortfolio =
    async ({
        userMessage,
        selectedComponents,
    }) => {

        try {

            const prompt =
                buildPortfolioPrompt({
                    userMessage,
                    selectedComponents,
                });

            const rawResponse =
                await generateResponse(
                    prompt
                );

            console.log(
                "RAW PORTFOLIO RESPONSE:",
                rawResponse
            );

            const parsedPortfolio =
                extractJSON(rawResponse);

            const validatedPortfolio =
                validatePortfolioStructure(
                    parsedPortfolio
                );

            return validatedPortfolio;

        } catch (error) {

            console.error(
                "PORTFOLIO BUILDER ERROR:",
                error.message
            );

            throw new Error(
                "Error generando portfolio"
            );
        }
    };

module.exports = {
    generatePortfolio,
};