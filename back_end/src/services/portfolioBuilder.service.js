const { generateResponse } = require("./ai.service");

// =====================================================
// LIMPIAR RESPUESTA IA
// =====================================================

const cleanResponse = (text) => {
    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
};

// =====================================================
// PARSE SEGURO
// =====================================================

const safeParse = (text) => {
    try {
        return JSON.parse(text);
    } catch (e) {
        console.warn("⚠️ JSON inválido, intentando reparar...");

        try {
            const fixed = text
                .replace(/,\s*}/g, "}")
                .replace(/,\s*]/g, "]");

            return JSON.parse(fixed);
        } catch {
            console.error("❌ No se pudo reparar JSON");
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

        const prompt = `
Devuelve SOLO un ARRAY JSON válido.

FORMATO:

[
  {
    "id": "comp-1",
    "type": "Hero",
    "data": {
      "titulo": "Texto",
      "descripcion": "Texto",
      "colorFondo": "#FFFFFF"
    }
  }
]

REGLAS:
- SOLO ARRAY []
- NO markdown
- NO texto fuera
- mínimo 2 bloques
- usar colores
- usar componentes

Colores:
${JSON.stringify(colores)}

Componentes:
${JSON.stringify(selectedComponents)}

Contexto:
${userMessage}
`;

        let response = await generateResponse(prompt);

        console.log("RAW PORTFOLIO RESPONSE:", response);

        response = cleanResponse(response);

        const parsed = safeParse(response);

        if (!Array.isArray(parsed)) return [];

        return parsed;

    } catch (error) {

        console.error("PORTFOLIO BUILDER ERROR:", error);
        return [];
    }
};

module.exports = {
    generatePortfolio,
};