const {
    COMPONENT_REGISTRY,
} = require("../context/componentRegistry");

const buildComponentSelectorPrompt = (
    userRequest
) => {

    const components =
        COMPONENT_REGISTRY.map((component) => {

            return `
COMPONENTE: ${component.type}

Nombre:
${component.nombre}

Categoría:
${component.category}

Descripción:
${component.descripcion}

Ideal para:
${component.idealFor.join(", ")}

Restricciones:
${component.restrictions.join(", ")}
`;
        }).join("\n\n");

    return `
Eres un experto en diseño visual
y construcción de portafolios modernos.

Tu tarea es seleccionar los componentes
más adecuados según la necesidad del usuario.

REGLAS IMPORTANTES:

- Devuelve SOLO JSON válido.
- No expliques nada fuera del JSON.
- No uses markdown.
- No inventes componentes.
- Usa únicamente componentes existentes.
- Selecciona entre 1 y 5 componentes.
- Explica brevemente por qué seleccionaste cada componente.

COMPONENTES DISPONIBLES:

${components}

SOLICITUD DEL USUARIO:

"${userRequest}"

FORMATO OBLIGATORIO:

{
    "componentesSeleccionados": [
        {
            "type": "",
            "razon": ""
        }
    ]
}
`;
};

module.exports = {
    buildComponentSelectorPrompt,
};