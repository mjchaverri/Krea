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
        // EXTRAER Y REPARAR JSON
        // =====================================

        // El builder siempre devuelve un array — buscar desde el primer [
        const arrayStart = cleanText.indexOf("[");
        if (arrayStart === -1) {
            throw new Error("No se encontró array JSON");
        }

        let jsonString = cleanText.slice(arrayStart);

        // Fix comas flotantes
        jsonString = jsonString
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");

        // Intentar parse directo
        try {
            return JSON.parse(jsonString);
        } catch {
            // Reparar: contar aperturas vs cierres y cerrar lo que falta
            let openBraces = 0;
            let openBrackets = 0;
            let inString = false;
            let escape = false;

            for (const ch of jsonString) {
                if (escape) { escape = false; continue; }
                if (ch === "\\") { escape = true; continue; }
                if (ch === '"') { inString = !inString; continue; }
                if (inString) continue;
                if (ch === "{") openBraces++;
                else if (ch === "}") openBraces--;
                else if (ch === "[") openBrackets++;
                else if (ch === "]") openBrackets--;
            }

            // Quitar coma final suelta
            jsonString = jsonString.trimEnd().replace(/,\s*$/, "");

            // Cerrar estructuras abiertas
            for (let i = 0; i < openBraces; i++) jsonString += "}";
            for (let i = 0; i < openBrackets; i++) jsonString += "]";

            return JSON.parse(jsonString);
        }

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

    const validTypesLower = validTypes.map(t => t.toLowerCase());

    return portfolio
        .map(component => {
            // normalizar type si la IA usó mayúsculas/minúsculas distintas
            if (component.type && !validTypes.includes(component.type)) {
                const idx = validTypesLower.indexOf(component.type.toLowerCase());
                if (idx !== -1) component.type = validTypes[idx];
            }
            return component;
        })
        .filter(component => {
            if (!component.type) return false;
            if (!validTypes.includes(component.type)) return false;
            if (!component.data) return false;
            return true;
        });
};

const generatePortfolio =
    async ({
        userMessage,
        selectedComponents,
        colores,
    }) => {

        try {

            const prompt =
                buildPortfolioPrompt({
                    userMessage,
                    selectedComponents,
                    colores,
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