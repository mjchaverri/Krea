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
// GENERAR OPCIONES (SIEMPRE 3)
// =====================================================

const selectPortfolioComponents = async (message, historial = []) => {

    try {

        // 👉 Si el usuario solo saluda → FORZAR PREGUNTA
        const saludoRegex = /^(hola|hi|hello|buenas|hey)$/i;

        if (saludoRegex.test(message.trim())) {
            return {
                intencion: "preguntar",
                message: "¿Qué tipo de portafolio quieres crear? (ej: diseñador, programador, fotógrafo)",
                opciones: [],
            };
        }

        const prompt = `
Eres un generador de ideas de portafolio.

Responde SIEMPRE en JSON válido.

FORMATO:

{
  "intencion": "opciones",
  "message": "Texto corto",
  "opciones": [3 OBJETOS EXACTOS]
}

REGLAS:
- SIEMPRE devolver EXACTAMENTE 3 opciones
- NO markdown
- NO texto fuera del JSON
- Cada opción debe ser diferente
- Adaptado al contexto del usuario

Cada opción debe tener:

{
  "nombre": "Nombre creativo",
  "descripcion": "Descripción breve",
  "preview": {
    "vibe": "estilo",
    "layoutIdea": "idea",
    "imageStyle": "tipo imagen"
  },
  "colores": {
    "fondo": "#hex",
    "fondo2": "#hex",
    "acento": "#hex",
    "texto": "#hex",
    "tipografia": "fuente"
  },
  "componentesSeleccionados": [
    { "type": "Hero", "razon": "principal" }
  ]
}

Contexto usuario:
${message}
`;

        let response = await generateResponse(prompt);

        console.log("RAW IA RESPONSE:", response);

        response = cleanResponse(response);

        let parsed;

        try {
            parsed = JSON.parse(response);
        } catch (e) {
            console.error("❌ JSON IA inválido, fallback automático");

            // 🔥 fallback seguro SIEMPRE 3 opciones
            return {
                intencion: "opciones",
                message: "Te propongo estos estilos:",
                opciones: [
                    {
                        nombre: "Minimalista",
                        descripcion: "Limpio y profesional",
                        preview: {
                            vibe: "simple",
                            layoutIdea: "columna",
                            imageStyle: "blanco y negro",
                        },
                        colores: {
                            fondo: "#FFFFFF",
                            fondo2: "#F1F5F9",
                            acento: "#0EA5E9",
                            texto: "#0F172A",
                            tipografia: "Inter",
                        },
                        componentesSeleccionados: [
                            { type: "Hero", razon: "principal" }
                        ],
                    },
                    {
                        nombre: "Creativo",
                        descripcion: "Colorido y dinámico",
                        preview: {
                            vibe: "moderno",
                            layoutIdea: "grid",
                            imageStyle: "vibrante",
                        },
                        colores: {
                            fondo: "#111827",
                            fondo2: "#1F2937",
                            acento: "#F59E0B",
                            texto: "#FFFFFF",
                            tipografia: "Poppins",
                        },
                        componentesSeleccionados: [
                            { type: "Hero", razon: "principal" }
                        ],
                    },
                    {
                        nombre: "Elegante",
                        descripcion: "Premium y sofisticado",
                        preview: {
                            vibe: "lujo",
                            layoutIdea: "centrado",
                            imageStyle: "editorial",
                        },
                        colores: {
                            fondo: "#0F172A",
                            fondo2: "#1E293B",
                            acento: "#EAB308",
                            texto: "#FFFFFF",
                            tipografia: "Playfair Display",
                        },
                        componentesSeleccionados: [
                            { type: "Hero", razon: "principal" }
                        ],
                    },
                ],
            };
        }

        // 🔥 asegurar 3 opciones SIEMPRE
        if (!parsed.opciones || parsed.opciones.length < 3) {
            throw new Error("Menos de 3 opciones");
        }

        return parsed;

    } catch (error) {

        console.error("PORTFOLIO GENERATOR ERROR:", error);

        return {
            intencion: "preguntar",
            message: "¿Qué tipo de portafolio quieres crear?",
            opciones: [],
        };
    }
};

module.exports = {
    selectPortfolioComponents,
};