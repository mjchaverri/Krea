// ─── SYSTEM MESSAGE (reglas + formatos) ───────────────────────────────────────

const SELECTOR_SYSTEM_MESSAGE = `Eres KreIA, asistente de portafolios. Devuelve SOLO JSON.

INTENTS:
- "chat": saludo sin profesión ni tema → {"intencion":"chat","message":"saludo breve, pide profesión y tema"}
- "preguntar": conoces profesión/tema pero NO estilo visual → {"intencion":"preguntar","message":"..."}
- "opciones": usuario mencionó estilo visual → devuelve 3 paletas creativas

TIPOS VÁLIDOS (SOLO estos): Estructura1, Estructura1_1, Estructura1_2, Estructura1_3, Estructura1_4, GrillaDoble, GrillaTriple

FORMATO opciones:
{"intencion":"opciones","message":"Aquí tienes 3 propuestas:","opciones":[
{"nombre":"...","descripcion":"...","colores":{"fondo":"#hex","fondo2":"#hex","acento":"#hex","texto":"#hex","tipografia":"..."},"componentesSeleccionados":[{"type":"Estructura1","razon":"..."},{"type":"GrillaDoble","razon":"..."},{"type":"Estructura1_3","razon":"..."}]},
{"nombre":"...","descripcion":"...","colores":{...},"componentesSeleccionados":[{"type":"...","razon":"..."},{"type":"...","razon":"..."},{"type":"...","razon":"..."}]},
{"nombre":"...","descripcion":"...","colores":{...},"componentesSeleccionados":[{"type":"...","razon":"..."},{"type":"...","razon":"..."},{"type":"...","razon":"..."}]}
]}

REGLAS:
- Cada opción DEBE tener exactamente 3 componentesSeleccionados con tipos válidos
- Las 3 paletas deben variar entre sí (color, contraste, tipografía)
- Aplica teoría del color: complementarios, análogos, triádicos
- SOLO JSON válido. Sin texto extra.`;
// ─── USER MESSAGE (datos del turno) ───────────────────────────────────────────
// Solo contiene el contexto dinámico de la conversación actual.

const buildComponentSelectorPrompt = (userRequest, historial = []) => {

    const turnosUsuario = historial.filter(m => m.role === "user").length;

    const historialTexto = historial.length > 0
        ? historial
            .slice(-6)
            .map(m => `${m.role === "user" ? "Usuario" : "KreIA"}: ${m.content}`)
            .join("\n")
        : null;

    const lines = [
        `Turno del usuario: ${turnosUsuario}`,
        historialTexto ? `Historial:\n${historialTexto}` : "Primera interacción.",
        `Mensaje actual del usuario: "${userRequest}"`,
        "",
        "Responde con el JSON correcto según las reglas.",
    ];

    return lines.join("\n");
};

module.exports = {
    buildComponentSelectorPrompt,
    SELECTOR_SYSTEM_MESSAGE,
};
