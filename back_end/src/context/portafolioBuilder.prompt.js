const {
    COMPONENT_REGISTRY,
} = require("./componentRegistry");

// =====================================================
// ASIGNAR COLORES DE PALETA A CADA BLOQUE
// =====================================================

// Mapea cada nombre de sub-bloque al rol de color que le corresponde en la paleta
const PALETTE_ROLES = {
    root:          { colorFondo: "fondo",   colorTexto: "texto",  childColorFondo: "fondo2" },
    fondo:         { colorFondo: "fondo" },
    bloqueTop:     { colorFondo: "fondo2",  colorTexto: "texto" },
    bloqueMid:     { colorFondo: "fondo" },
    bloqueBottom:  { colorFondo: "acento",  colorTexto: "fondo" },
    bloqueBottom1: { colorFondo: "acento",  colorTexto: "fondo" },
    bloqueBottom2: { colorFondo: "fondo2",  colorTexto: "texto" },
    bloque1:       { colorFondo: "fondo2",  colorTexto: "texto" },
    bloque2:       { colorFondo: "acento",  colorTexto: "fondo" },
    bloque3:       { colorFondo: "fondo2",  colorTexto: "texto" },
    bloque4:       { colorFondo: "acento",  colorTexto: "fondo" },
};

const applyPalette = (data, colores, blockKey = "root") => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return data;

    const role = PALETTE_ROLES[blockKey] || {};
    const result = {};

    for (const [key, val] of Object.entries(data)) {
        if (key === "imageUrl" || key === "childImageUrl") {
            // No generar imágenes — el usuario las sube manualmente
            result[key] = "";
        } else if (key === "fontFamily") {
            result[key] = colores.tipografia || val;
        } else if (key in role) {
            result[key] = colores[role[key]] || val;
        } else if (val && typeof val === "object" && !Array.isArray(val)) {
            result[key] = applyPalette(val, colores, key);
        } else {
            result[key] = val;
        }
    }

    return result;
};

// =====================================================
// CONSTRUIR PROMPT PARA EL BUILDER
// =====================================================

const buildPortfolioPrompt = ({
    userMessage,
    selectedComponents,
    colores,
}) => {

    const c = colores || {};

    // Construir plantilla con colores pre-aplicados — el modelo solo necesita generar texto
    const template = COMPONENT_REGISTRY
        .filter(comp => selectedComponents.some(s => s.type === comp.type))
        .map((comp, i) => {
            const baseData = comp.example?.data ?? comp.example;
            const coloredData = applyPalette(baseData, c);
            return `{"id":"comp-${i + 1}","type":"${comp.type}","data":${JSON.stringify(coloredData)}}`;
        })
        .join(",\n");

    return `Rellena el array JSON. SOLO devuelve el array, sin texto extra, sin markdown.

Contexto del usuario: ${userMessage}

REGLAS:
1. Copia la estructura EXACTAMENTE. NO cambies la forma del JSON ni los nombres de claves.
2. Solo reemplaza los valores de "texto" con contenido creativo en español relacionado al contexto (5-15 palabras por campo).
3. NO cambies ningún color (colorFondo, colorTexto, childColorFondo). Ya están correctos.
4. NO cambies fontFamily.
5. imageUrl siempre debe ser "".
6. Escribe con personalidad y creatividad. Evita frases genéricas.

PLANTILLA:
[${template}]`;
};

module.exports = {
    buildPortfolioPrompt,
};
