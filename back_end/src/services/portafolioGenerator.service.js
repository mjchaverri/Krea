const {
    buildComponentSelectorPrompt,
    SELECTOR_SYSTEM_MESSAGE,
} = require("../prompts/componentSelector.prompt");

const {
    buildPortfolioPrompt,
} = require("../context/portafolioBuilder.prompt");

const {
    generateResponse,
} = require("./ai.service");

const {
    COMPONENT_REGISTRY,
} = require("../context/componentRegistry");

/*
|--------------------------------------------------------------------------
| EXTRAER JSON
|--------------------------------------------------------------------------
*/

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
        // EXTRAER JSON
        // =====================================

        const match =
            cleanText.match(
                /(\{[\s\S]*\}|\[[\s\S]*\])/
            );

        if (!match) {
            throw new Error("No se encontró JSON");
        }

        let jsonString = match[0];

        // =====================================
        // FIX COMAS FLOTANTES
        // =====================================

        jsonString = jsonString
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");

        // =====================================
        // PARSE
        // =====================================

        return JSON.parse(jsonString);

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
/*
|--------------------------------------------------------------------------
| VALIDAR COMPONENTES
|--------------------------------------------------------------------------
*/

const validateComponents = (
    componentesSeleccionados
) => {

    const validTypes =
        COMPONENT_REGISTRY.map(
            component => component.type
        );

    return componentesSeleccionados.filter(
        component =>
            validTypes.includes(component.type)
    );
};

/*
|--------------------------------------------------------------------------
| PASO 1
| SELECCIONAR COMPONENTES
|--------------------------------------------------------------------------
*/

const selectPortfolioComponents =
    async (message, historial = []) => {

        const turnosUsuario = historial.filter(m => m.role === "user").length;

        try {

            const prompt =
                buildComponentSelectorPrompt(
                    message,
                    historial
                );

            const rawResponse =
                await generateResponse(
                    prompt,
                    SELECTOR_SYSTEM_MESSAGE
                );

            console.log(
                "RAW IA RESPONSE:",
                rawResponse
            );

            const parsed =
                extractJSON(rawResponse);

            if (!parsed || !parsed.message) {
                throw new Error("Estructura IA inválida");
            }

            const estilosKeywords = [
                "oscuro", "claro", "blanco", "negro", "minimalista", "vibrante",
                "elegante", "moderno", "editorial", "creativo", "tech", "corporativo",
                "colorido", "cálido", "calido", "natural", "profesional", "premium",
            ];

            const mensajesUsuarioHistorial = historial
                .filter(m => m.role === "user")
                .map(m => m.content.toLowerCase().trim());

            const usuarioYaMencionoEstilo = mensajesUsuarioHistorial.some(msg =>
                estilosKeywords.some(k => msg.includes(k))
            );

            // "chat" → respuesta de bienvenida fija
            if (parsed.intencion === "chat") {
                parsed.message = "¡Hola! Soy KreIA, tu asistente para crear portafolios visuales.\n\n¿Cuál es tu profesión o qué tipo de trabajo quieres mostrar en tu portafolio?";
                return parsed;
            }

            // "preguntar" → texto fijo preguntando por estilo (turno 0-1)
            if (parsed.intencion === "preguntar") {
                parsed.message = "Entendido. ¿Qué estilo visual prefieres para tu portafolio?\n\nPuedes decirme algo como: oscuro y elegante, claro y limpio, colorido y creativo, editorial y premium, o cualquier preferencia que tengas.";
                return parsed;
            }

            // Turno >= 4: forzar portafolio si la IA sigue sin decidir
            // (da espacio para: saludo → profesión → estilo → opciones → portafolio)
            if (turnosUsuario >= 4 && parsed.intencion !== "portafolio" && parsed.intencion !== "opciones") {
                parsed.intencion = "portafolio";
                if (!parsed.data || !Array.isArray(parsed.data?.componentesSeleccionados)) {
                    parsed.data = {
                        theme: "clean-blanco",
                        componentesSeleccionados: [
                            { type: "Estructura1", razon: "apertura" },
                            { type: "GrillaDoble", razon: "proyectos" },
                            { type: "Estructura1_2", razon: "detalle" },
                        ],
                    };
                }
            }

            // Turno 1 + portafolio sin estilo → mostrar opciones en cambio
            if (turnosUsuario === 1 && parsed.intencion === "portafolio" && !usuarioYaMencionoEstilo) {
                parsed.intencion = "opciones";
            }

            // Manejar intent "opciones" — validar y limpiar
            if (parsed.intencion === "opciones") {

                // Detectar preferencia del usuario para elegir el fallback correcto
                const textoUsuario = mensajesUsuarioHistorial.concat(
                    [message.toLowerCase()]
                ).join(" ");

                const FALLBACK_GROUPS = {
                    colorido: [
                        { nombre: "Arte & Ilustración",  descripcion: "Fondos cálidos y coloridos. Expresivo y creativo.",        colores: { fondo: "#FEF3C7", fondo2: "#FDF2F8", acento: "#EC4899", texto: "#1C1917", tipografia: "serif" },                componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_4", razon: "mosaico" }, { type: "GrillaTriple", razon: "galería" }] },
                        { nombre: "Vibrante & Creativo", descripcion: "Colores saturados y atrevidos. Energético y llamativo.",   colores: { fondo: "#F0FFF4", fondo2: "#DCFCE7", acento: "#22C55E", texto: "#14532D", tipografia: "Inter, sans-serif" },    componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble",   razon: "proyectos" }, { type: "GrillaTriple", razon: "galería" }] },
                        { nombre: "Cálido & Expresivo",  descripcion: "Naranjas y rojos vivos sobre fondo cálido. Llamativo.",   colores: { fondo: "#FFF7ED", fondo2: "#FFEDD5", acento: "#F97316", texto: "#7C2D12", tipografia: "Georgia, serif" },        componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaDoble", razon: "galería" }] },
                    ],
                    oscuro: [
                        { nombre: "Minimalista Oscuro",   descripcion: "Fondo negro, tipografía elegante. Premium y sofisticado.",  colores: { fondo: "#0F172A", fondo2: "#1E293B", acento: "#CBD5E1", texto: "#F1F5F9", tipografia: "Georgia, serif" },          componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaDoble", razon: "galería" }] },
                        { nombre: "Fotográfico Elegante", descripcion: "Fondo oscuro con acento dorado. Artístico y sofisticado.", colores: { fondo: "#111827", fondo2: "#1F2937", acento: "#F59E0B", texto: "#FEF3C7", tipografia: "Playfair Display, serif" }, componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaTriple", razon: "galería" }, { type: "GrillaDoble", razon: "detalle" }] },
                        { nombre: "Tecnología Moderna",   descripcion: "Oscuro con acentos cian/azul. Futurista y técnico.",       colores: { fondo: "#020617", fondo2: "#0F172A", acento: "#0EA5E9", texto: "#E0F2FE", tipografia: "monospace" },               componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_2", razon: "detalle" }] },
                    ],
                    claro: [
                        { nombre: "Clean & Moderno",   descripcion: "Fondos blancos y tipografía limpia. Profesional.",  colores: { fondo: "#FFFFFF", fondo2: "#F8FAFC", acento: "#3B82F6", texto: "#0F172A", tipografia: "Inter, sans-serif" },    componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_2", razon: "detalle" }] },
                        { nombre: "Índigo & Cristal",   descripcion: "Azules suaves y acentos índigo. Fresco y profesional.", colores: { fondo: "#F8FAFC", fondo2: "#EFF6FF", acento: "#6366F1", texto: "#1E293B", tipografia: "Roboto, sans-serif" }, componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "Estructura1_3", razon: "editorial" }, { type: "GrillaDoble", razon: "galería" }] },
                        { nombre: "Natural & Verde",    descripcion: "Verde esmeralda sobre fondo neutro. Fresco y moderno.", colores: { fondo: "#FAFAFA", fondo2: "#F5F5F5", acento: "#10B981", texto: "#171717", tipografia: "Inter, sans-serif" },  componentesSeleccionados: [{ type: "Estructura1", razon: "apertura" }, { type: "GrillaDoble", razon: "proyectos" }, { type: "Estructura1_2", razon: "detalle" }] },
                    ],
                };

                const esColorido = /colorid|vibrant|creativ|atrevid|alegr|expresiv|color/i.test(textoUsuario);
                const esOscuro   = /oscur|elegan|premium|sofistic|dark|negr|minimalista/i.test(textoUsuario);
                const esClaro    = /clar|limpi|blanco|profesional|moderno|clean/i.test(textoUsuario);

                const opcionesDefault = esColorido ? FALLBACK_GROUPS.colorido
                    : esOscuro   ? FALLBACK_GROUPS.oscuro
                    : esClaro    ? FALLBACK_GROUPS.claro
                    : [
                        FALLBACK_GROUPS.claro[0],
                        FALLBACK_GROUPS.oscuro[0],
                        FALLBACK_GROUPS.colorido[0],
                    ];

                if (!Array.isArray(parsed.opciones) || parsed.opciones.length === 0) {
                    parsed.opciones = opcionesDefault;
                    parsed.message = "Aquí tienes 3 propuestas de estilo para tu portafolio:";
                } else {
                    // Validar colores y componentes de cada opción
                    parsed.opciones = parsed.opciones
                        .filter(o => o && o.colores && o.colores.fondo && o.colores.acento)
                        .map(o => ({
                            ...o,
                            componentesSeleccionados: validateComponents(
                                Array.isArray(o.componentesSeleccionados)
                                    ? o.componentesSeleccionados
                                    : []
                            ),
                        }))
                        .filter(o => o.componentesSeleccionados.length > 0);

                    if (parsed.opciones.length === 0) {
                        parsed.opciones = opcionesDefault;
                    }
                }

                return parsed;
            }

            /*
            |--------------------------------------------------------------------------
            | VALIDAR ESTRUCTURA DE PORTAFOLIO
            |--------------------------------------------------------------------------
            */

            if (
                !parsed.data ||
                !Array.isArray(
                    parsed.data
                        .componentesSeleccionados
                )
            ) {

                throw new Error(
                    "Estructura IA inválida"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | VALIDAR COMPONENTES
            |--------------------------------------------------------------------------
            */

            parsed.data.componentesSeleccionados =
                validateComponents(
                    parsed.data
                        .componentesSeleccionados
                );

            /*
            |--------------------------------------------------------------------------
            | FALLBACK
            |--------------------------------------------------------------------------
            */

            if (
                parsed.data
                    .componentesSeleccionados
                    .length === 0
            ) {

                parsed.data
                    .componentesSeleccionados = [
                        {
                            type: "Estructura1",
                            razon:
                                "fallback automático",
                        },
                    ];
            }

            return parsed;

        } catch (error) {

            console.error(
                "PORTFOLIO SELECTOR ERROR:",
                error.message
            );

            throw new Error(
                "Error seleccionando componentes"
            );
        }
    };

/*
|--------------------------------------------------------------------------
| PASO 2
| GENERAR PORTAFOLIO
|--------------------------------------------------------------------------
*/

const buildPortfolio =
    async ({
        userRequest,
        selectedComponents,
    }) => {

        try {

            const prompt =
                buildPortfolioPrompt({
                    userRequest,
                    selectedComponents,
                });

            const rawResponse =
                await generateResponse(
                    prompt
                );

            console.log(
                "RAW PORTFOLIO RESPONSE:",
                rawResponse
            );

            const parsed =
                extractJSON(rawResponse);

            /*
            |--------------------------------------------------------------------------
            | VALIDACIÓN
            |--------------------------------------------------------------------------
            */

            if (
                !parsed ||
                !Array.isArray(
                    parsed.portfolio
                )
            ) {

                throw new Error(
                    "Portfolio inválido"
                );
            }

            return parsed;

        } catch (error) {

            console.error(
                "PORTFOLIO BUILDER ERROR:",
                error.message
            );

            throw new Error(
                "Error construyendo portafolio"
            );
        }
    };

/*
|--------------------------------------------------------------------------
| GENERADOR COMPLETO
|--------------------------------------------------------------------------
*/

const generatePortfolio =
    async (message) => {

        try {

            /*
            |--------------------------------------------------------------------------
            | 1. SELECCIONAR COMPONENTES
            |--------------------------------------------------------------------------
            */

            const selection =
                await selectPortfolioComponents(
                    message
                );

            const selectedComponents =
                selection.data
                    .componentesSeleccionados
                    .map(
                        component =>
                            component.type
                    );

            /*
            |--------------------------------------------------------------------------
            | 2. GENERAR PORTAFOLIO
            |--------------------------------------------------------------------------
            */

            const portfolio =
                await buildPortfolio({
                    userRequest: message,
                    selectedComponents,
                });

            /*
            |--------------------------------------------------------------------------
            | RESPUESTA FINAL
            |--------------------------------------------------------------------------
            */

            return {

                ok: true,

                message:
                    selection.message,

                theme:
                    portfolio.theme,

                selectedComponents,

                portfolio:
                    portfolio.portfolio,
            };

        } catch (error) {

            console.error(
                "PORTFOLIO GENERATOR ERROR:",
                error.message
            );

            throw new Error(
                "Error generando portafolio"
            );
        }
    };

module.exports = {

    extractJSON,

    selectPortfolioComponents,

    buildPortfolio,

    generatePortfolio,
};