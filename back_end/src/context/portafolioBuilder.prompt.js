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
                    selected =>
                        selected.type === component.type
                )
            )
            .map((component, i) => {
                const exampleData = component.example?.data ?? component.example;
                return `{"id":"comp-${i + 1}","type":"${component.type}","data":${JSON.stringify(exampleData)}}`;
            })
            .join(",\n");

    const c = colores || {};

    return `Rellena el array JSON de abajo. SOLO devuelve el array. Sin texto extra, sin markdown.

TRABAJO DEL USUARIO: ${userMessage}

INSTRUCCIONES:
1. Copia el array de PLANTILLA exactamente.
2. Reemplaza cada valor "texto" con contenido relevante al trabajo del usuario (4-10 palabras descriptivas).
3. NO añadas ni quites objetos del array. NO inventes tipos nuevos.
4. imageUrl siempre "".
5. Aplica estos colores en colorFondo y colorTexto de cada objeto:
   - Fondo principal: ${c.fondo || "#FFFFFF"} → texto: ${c.texto || "#0F172A"}
   - Fondo secundario: ${c.fondo2 || "#F8FAFC"} → texto: ${c.texto || "#0F172A"}
   - Fondo acento: ${c.acento || "#0EA5E9"} → texto: ${esColorClaro(c.acento) ? "#0F172A" : "#FFFFFF"}
   - fontFamily de todos los campos: "${c.tipografia || "Inter, sans-serif"}"

PLANTILLA:
[${registryInfo}]`;
};

module.exports = {
    buildPortfolioPrompt,
};
