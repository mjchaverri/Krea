const {
    COMPONENT_REGISTRY,
} = require("./componentRegistry");

// Detecta si un color hex es claro (luminosidad > 50%) para elegir texto contrastante
const esColorClaro = (hex = "#000000") => {
    const h = hex.replace("#", "");
    if (h.length < 6) return false;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    // Luminance relativa percibida
    return (r * 0.299 + g * 0.587 + b * 0.114) > 150;
};

const buildPortfolioPrompt = ({
    userMessage,
    selectedComponents,
    colores,
}) => {

    const registryInfo =
        COMPONENT_REGISTRY
            .filter(component =>
                selectedComponents.some(
                    selected => selected.type === component.type
                )
            )
            .map((component, i) => {
                const exampleData = component.example?.data ?? component.example;
                return `{"id":"comp-${i + 1}","type":"${component.type}","data":${JSON.stringify(exampleData)}}`;
            })
            .join(",\n");

    const c = colores || {};

    return `Rellena el array JSON de abajo. SOLO devuelve el array.

TRABAJO DEL USUARIO:
${userMessage}

INSTRUCCIONES:

1. Copia el array exactamente.
2. Genera contenido creativo:
   - evita frases genéricas
   - usa lenguaje con personalidad
   - mezcla frases cortas y expresivas
3. Usa tono acorde al perfil (creativo, tech, artístico, etc.)
4. Puedes usar estilo marca personal

IMÁGENES:
imageUrl puede ser:
- ""
- "AI_GENERATE: descripción visual detallada"
- "USER_UPLOAD: tipo de imagen necesaria"

COLORES:
- Fondo principal: ${c.fondo || "#FFFFFF"}
- Fondo secundario: ${c.fondo2 || "#F8FAFC"}
- Acento: ${c.acento || "#0EA5E9"}
- Texto: ${c.texto || "#0F172A"}

TIPOGRAFÍA:
- ${c.tipografia || "Inter, sans-serif"}

PLANTILLA:
[${registryInfo}]`;
};

module.exports = {
    buildPortfolioPrompt,
};
