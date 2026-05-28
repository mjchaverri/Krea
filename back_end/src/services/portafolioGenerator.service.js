const {
    buildComponentSelectorPrompt,
    SELECTOR_SYSTEM_MESSAGE,
} = require("../prompts/componentSelector.prompt");

const {
    generateResponse,
} = require("./ai.service");

const {
    COMPONENT_REGISTRY,
} = require("../context/componentRegistry");

// =====================================================
// EXTRAER JSON
// =====================================================

const extractJSON = (text) => {
    if (!text) throw new Error("Respuesta vacía");

    let clean = String(text)
        .replace(/^﻿/, "")
        .replace(/ /g, " ")
        .replace(/[​-‍﻿]/g, "")
        .replace(/\t/g, " ")
        .replace(/\r/g, "")
        .trim();

    const match = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!match) throw new Error("No se encontró JSON");

    let jsonString = match[0]
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");

    return JSON.parse(jsonString);
};

// =====================================================
// VALIDAR COMPONENTES
// =====================================================

const VALID_TYPES = COMPONENT_REGISTRY.map(c => c.type);

const validateComponents = (comps) =>
    (Array.isArray(comps) ? comps : []).filter(c => VALID_TYPES.includes(c?.type));

// =====================================================
// PAD A MÍNIMO 3 COMPONENTES
// =====================================================

const DEFAULTS_BY_STYLE = {
    colorido: [
        { type: "Estructura1", razon: "apertura" },
        { type: "Estructura1_4", razon: "mosaico" },
        { type: "GrillaTriple", razon: "galería" },
    ],
    oscuro: [
        { type: "Estructura1", razon: "apertura" },
        { type: "Estructura1_3", razon: "editorial" },
        { type: "GrillaDoble", razon: "proyectos" },
    ],
    claro: [
        { type: "Estructura1", razon: "apertura" },
        { type: "GrillaDoble", razon: "proyectos" },
        { type: "Estructura1_2", razon: "detalle" },
    ],
    calido: [
        { type: "Estructura1", razon: "apertura" },
        { type: "Estructura1_3", razon: "editorial" },
        { type: "GrillaTriple", razon: "galería" },
    ],
    tech: [
        { type: "Estructura1", razon: "apertura" },
        { type: "GrillaDoble", razon: "proyectos" },
        { type: "Estructura1_2", razon: "detalle" },
    ],
    default: [
        { type: "Estructura1", razon: "apertura" },
        { type: "GrillaDoble", razon: "proyectos" },
        { type: "Estructura1_3", razon: "detalle" },
    ],
};

const detectStyleFamily = (text = "") => {
    const t = text.toLowerCase();
    if (/colorid|vibrant|creativ|atrevid|alegr|expresiv|color/.test(t)) return "colorido";
    if (/oscur|elegan|premium|sofistic|dark|negr|minimalista/.test(t)) return "oscuro";
    if (/clar|limpi|blanco|profesional|moderno|clean/.test(t)) return "claro";
    if (/calid|natural|lifestyle|suave|crema|beige/.test(t)) return "calido";
    if (/tech|digital|futurist|cian|neon/.test(t)) return "tech";
    return "default";
};

const padToThree = (comps, styleFamily = "default") => {
    const valid = validateComponents(comps);
    if (valid.length >= 3) return valid.slice(0, 3);
    const defaults = DEFAULTS_BY_STYLE[styleFamily] || DEFAULTS_BY_STYLE.default;
    const extra = defaults.filter(d => !valid.some(v => v.type === d.type));
    return [...valid, ...extra].slice(0, 3);
};

// =====================================================
// FALLBACK GROUPS (3 opciones por familia de estilo)
// =====================================================

const FALLBACK_GROUPS = {
    colorido: [
        { nombre: "Arte & Ilustración",  descripcion: "Fondos cálidos y coloridos. Expresivo.",     colores: { fondo: "#FEF3C7", fondo2: "#FDF2F8", acento: "#EC4899", texto: "#1C1917", tipografia: "serif" },             componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_4", razon: "mosaico" }, { type: "GrillaTriple", razon: "galería" }] },
        { nombre: "Vibrante & Creativo", descripcion: "Colores saturados y atrevidos. Energético.", colores: { fondo: "#F0FFF4", fondo2: "#DCFCE7", acento: "#22C55E", texto: "#14532D", tipografia: "Inter, sans-serif" }, componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble",   razon: "proyectos" }, { type: "GrillaTriple", razon: "galería" }] },
        { nombre: "Cálido & Expresivo",  descripcion: "Naranjas vivos sobre fondo cálido.",         colores: { fondo: "#FFF7ED", fondo2: "#FFEDD5", acento: "#F97316", texto: "#7C2D12", tipografia: "Georgia, serif" },    componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaDoble", razon: "galería" }] },
    ],
    oscuro: [
        { nombre: "Minimalista Oscuro",   descripcion: "Fondo negro. Premium y sofisticado.",        colores: { fondo: "#0F172A", fondo2: "#1E293B", acento: "#CBD5E1", texto: "#F1F5F9", tipografia: "Georgia, serif" },            componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaDoble", razon: "galería" }] },
        { nombre: "Fotográfico Elegante", descripcion: "Oscuro con acento dorado. Artístico.",       colores: { fondo: "#111827", fondo2: "#1F2937", acento: "#F59E0B", texto: "#FEF3C7", tipografia: "Playfair Display, serif" }, componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaTriple", razon: "galería" }, { type: "GrillaDoble", razon: "detalle" }] },
        { nombre: "Tecnología Moderna",   descripcion: "Oscuro con acentos cian. Futurista.",        colores: { fondo: "#020617", fondo2: "#0F172A", acento: "#0EA5E9", texto: "#E0F2FE", tipografia: "monospace" },               componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_2", razon: "detalle" }] },
    ],
    claro: [
        { nombre: "Clean & Moderno",  descripcion: "Fondos blancos y tipografía limpia.",      colores: { fondo: "#FFFFFF", fondo2: "#F8FAFC", acento: "#3B82F6", texto: "#0F172A", tipografia: "Inter, sans-serif" },    componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_2", razon: "detalle" }] },
        { nombre: "Índigo & Cristal", descripcion: "Azules suaves y acentos índigo.",          colores: { fondo: "#F8FAFC", fondo2: "#EFF6FF", acento: "#6366F1", texto: "#1E293B", tipografia: "Roboto, sans-serif" }, componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaDoble", razon: "galería" }] },
        { nombre: "Natural & Verde",  descripcion: "Verde esmeralda sobre fondo neutro.",      colores: { fondo: "#FAFAFA", fondo2: "#F5F5F5", acento: "#10B981", texto: "#171717", tipografia: "Inter, sans-serif" },  componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_2", razon: "detalle" }] },
    ],
    calido: [
        { nombre: "Crema & Rosa",    descripcion: "Cremas suaves con acento rosa.",       colores: { fondo: "#FAFAF9", fondo2: "#F5F0EB", acento: "#D4A898", texto: "#1C1917", tipografia: "Georgia, serif" },  componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaTriple", razon: "galería" }] },
        { nombre: "Naranja Natural", descripcion: "Cálido con acento naranja orgánico.",  colores: { fondo: "#FFF8F0", fondo2: "#FEE2C8", acento: "#F4A261", texto: "#6B2D0F", tipografia: "Georgia, serif" }, componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_3", razon: "detalle" }] },
        { nombre: "Lavanda Suave",   descripcion: "Lila suave con tono orgánico.",        colores: { fondo: "#FDF4FF", fondo2: "#FAE8FF", acento: "#C084FC", texto: "#3B0764", tipografia: "serif" },           componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaDoble", razon: "galería" }] },
    ],
    tech: [
        { nombre: "Cian Digital",  descripcion: "Negro profundo con acentos cian.",    colores: { fondo: "#020617", fondo2: "#0F172A", acento: "#0EA5E9", texto: "#E0F2FE", tipografia: "monospace" },          componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_2", razon: "detalle" }] },
        { nombre: "Verde Matrix",  descripcion: "Oscuro con verde eléctrico. Hacker.",  colores: { fondo: "#052e16", fondo2: "#14532D", acento: "#4ADE80", texto: "#DCFCE7", tipografia: "monospace" },          componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaTriple", razon: "galería" }, { type: "Estructura1_2", razon: "detalle" }] },
        { nombre: "Púrpura Neon",  descripcion: "Oscuro con violeta vibrante. Futurista.", colores: { fondo: "#0F172A", fondo2: "#1E1B4B", acento: "#A78BFA", texto: "#EDE9FE", tipografia: "Inter, sans-serif" }, componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_3", razon: "editorial" }] },
    ],
};

// =====================================================
// MENSAJE FIJO: LISTA DE ESTILOS
// =====================================================

const MENSAJE_PREGUNTAR = `Perfecto. ¿Qué estilo visual prefieres para tu portafolio?

• 🖤 Oscuro y elegante — sofisticado, premium, tipografía serif
• ⚪ Claro y profesional — limpio, blanco, sans-serif moderno
• 🎨 Colorido y creativo — vibrante, atrevido, expresivo
• 🌿 Cálido y natural — cremas, beiges, orgánico
• 💻 Tech y futurista — negro con neón, digital
• 📰 Editorial — estilo revista, bloques de alto impacto

Puedes elegir una opción o describirme el mood que buscas.`;

// =====================================================
// KEYWORDS DE ESTILO
// =====================================================

const ESTILO_KEYWORDS = [
    "oscuro", "elegante", "claro", "limpio", "blanco", "profesional",
    "colorido", "creativo", "vibrante", "calido", "cálido", "natural",
    "tech", "digital", "futurista", "editorial", "premium", "minimalista",
    "negro", "moderno", "crema", "beige", "cian", "neon", "serif",
];

// =====================================================
// SELECCIONAR COMPONENTES (paso 1 del flujo)
// =====================================================

const selectPortfolioComponents = async (message, historial = []) => {

    const turnosUsuario = historial.filter(m => m.role === "user").length;

    try {

        const prompt = buildComponentSelectorPrompt(message, historial);

        const rawResponse = await generateResponse(prompt, SELECTOR_SYSTEM_MESSAGE);

        console.log("RAW IA RESPONSE:", rawResponse);

        const parsed = extractJSON(rawResponse);

        if (!parsed?.intencion) throw new Error("Estructura IA inválida");

        // ── chat ──────────────────────────────────────────
        if (parsed.intencion === "chat") {
            parsed.message = "¡Hola! Soy KreIA, tu asistente para portafolios.\n\n¿A qué te dedicas y qué tipo de trabajo o proyectos quieres mostrar?";
            return parsed;
        }

        // ── preguntar ─────────────────────────────────────
        if (parsed.intencion === "preguntar") {
            parsed.message = MENSAJE_PREGUNTAR;
            return parsed;
        }

        // ── detectar si el usuario ya mencionó un estilo ──
        const textoCompleto = [
            ...historial.filter(m => m.role === "user").map(m => m.content),
            message,
        ].join(" ");

        const estiloMencionado = ESTILO_KEYWORDS.some(k => textoCompleto.toLowerCase().includes(k));

        // Turno 1 + sin estilo mencionado → preguntar estilo
        if (turnosUsuario === 1 && parsed.intencion !== "preguntar" && !estiloMencionado) {
            return { intencion: "preguntar", message: MENSAJE_PREGUNTAR };
        }

        // AI sigue preguntando cuando ya sabe el estilo → forzar opciones
        if (parsed.intencion === "preguntar" && (estiloMencionado || turnosUsuario >= 2)) {
            parsed.intencion = "opciones";
            parsed.opciones = [];
        }

        // Demasiados turnos sin opciones → forzar opciones
        if (turnosUsuario >= 4 && parsed.intencion !== "opciones") {
            parsed.intencion = "opciones";
            parsed.opciones = [];
        }

        // ── opciones ──────────────────────────────────────
        if (parsed.intencion === "opciones") {
            const styleFamily = detectStyleFamily(textoCompleto);
            const fallback = FALLBACK_GROUPS[styleFamily] || [
                FALLBACK_GROUPS.claro[0],
                FALLBACK_GROUPS.oscuro[0],
                FALLBACK_GROUPS.colorido[0],
            ];

            if (!Array.isArray(parsed.opciones) || parsed.opciones.length === 0) {
                parsed.opciones = fallback;
                parsed.message = "Aquí tienes 3 propuestas de estilo para tu portafolio:";
            } else {
                // Validar colores y pad a 3 componentes por opción
                const opcionesValidas = parsed.opciones
                    .filter(o => o?.colores?.fondo && o?.colores?.acento)
                    .map(o => ({
                        ...o,
                        componentesSeleccionados: padToThree(
                            o.componentesSeleccionados,
                            detectStyleFamily(`${o.nombre || ""} ${o.descripcion || ""}`)
                        ),
                    }));

                // Si hay menos de 3 opciones válidas, completar con fallback
                if (opcionesValidas.length < 3) {
                    const extra = fallback.slice(0, 3 - opcionesValidas.length);
                    parsed.opciones = [...opcionesValidas, ...extra];
                } else {
                    parsed.opciones = opcionesValidas;
                }
            }

            return parsed;
        }

        // Cualquier otro intent → preguntar
        return { intencion: "preguntar", message: MENSAJE_PREGUNTAR };

    } catch (error) {
        console.error("PORTFOLIO SELECTOR ERROR:", error.message);
        throw new Error("Error seleccionando componentes");
    }
};

module.exports = {
    selectPortfolioComponents,
};
