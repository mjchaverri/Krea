const {
    COMPONENT_REGISTRY,
} = require("../context/componentRegistry");

const buildPortfolioPrompt = ({
    userMessage,
    selectedComponents,
}) => {

    const registryInfo =
        COMPONENT_REGISTRY
            .filter(component =>
                selectedComponents.some(
                    selected =>
                        selected.type === component.type
                )
            )
            .map(component => {

                return `
COMPONENT: ${component.type}

SCHEMA:
${JSON.stringify(component.schema)}

EXAMPLE:
${JSON.stringify(component.example)}
`;

            })
            .join("\n");

    return `
Eres KreIA Portfolio Engine.

Tu única función es generar JSON válido.

REGLAS:
- SOLO JSON
- NO markdown
- NO explicaciones
- NO texto fuera del JSON
- NO usar \`\`\`
- TODOS los objetos deben estar completos
- TODOS los arrays deben cerrarse
- TODAS las llaves deben cerrarse
- NO cortar respuestas

IMPORTANTE:
- imageUrl SIEMPRE ""
- usar colores modernos
- usar textos cortos
- usar máximo 5 componentes

MENSAJE USUARIO:
"${userMessage}"

COMPONENTES:
${JSON.stringify(selectedComponents)}

REGISTRY:
${registryInfo}

FORMATO:

[
  {
    "id": "uuid",
    "type": "Estructura1",
    "data": {}
  }
]
`;
};

module.exports = {
    buildPortfolioPrompt,
};