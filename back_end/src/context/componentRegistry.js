const { BASE_FIELDS } = require("./baseFields");
const { BLOCK_FIELDS } = require("./blockFields");

const { BASE_SCHEMA } = require("./baseSchema");
const { BLOCK_SCHEMA } = require("./blockSchema");

// =====================================================
// TEMAS DE ESTILO DISPONIBLES
// La IA debe ofrecer estos estilos al usuario cuando
// no especifica uno, o aplicar el más adecuado según
// el tipo de portafolio descrito.
// =====================================================

const STYLE_THEMES = {
    "minimalista-oscuro": {
        descripcion: "Fondo negro o gris muy oscuro, texto blanco o crema, espacios grandes, tipografía serif elegante. Ideal para diseñadores gráficos, artistas, fotógrafos de moda y creativos premium.",
        coloresPrimarios: ["#0F172A", "#111827", "#1E293B"],
        coloresAcento: ["#FFFFFF", "#F1F5F9", "#94A3B8"],
        coloresDestaque: ["#E2E8F0", "#CBD5E1"],
        tipografia: { titulo: "serif", cuerpo: "sans-serif" },
        vibes: ["premium", "elegante", "oscuro", "sofisticado"],
        mejorPara: ["fotografía", "moda", "arte", "branding premium", "diseño gráfico"],
    },
    "clean-blanco": {
        descripcion: "Fondos blancos o grises claros, texto oscuro, mucho espacio en blanco, tipografía sans-serif moderna y limpia. Ideal para desarrolladores, diseñadores UX/UI y profesionales tech.",
        coloresPrimarios: ["#FFFFFF", "#F8FAFC", "#F1F5F9"],
        coloresAcento: ["#0F172A", "#1E293B", "#334155"],
        coloresDestaque: ["#0EA5E9", "#3B82F6", "#6366F1"],
        tipografia: { titulo: "sans-serif", cuerpo: "sans-serif" },
        vibes: ["clean", "moderno", "profesional", "minimalista"],
        mejorPara: ["desarrollo web", "UX/UI", "tecnología", "consultoría", "startup"],
    },
    "editorial-premium": {
        descripcion: "Estilo revista de lujo. Combinación de bloques oscuros y claros, tipografía serif en títulos grandes, colores neutros con un acento de color fuerte. Ideal para creativos que quieren impacto visual inmediato.",
        coloresPrimarios: ["#1E293B", "#0F172A", "#FFFFFF"],
        coloresAcento: ["#DC2626", "#B91C1C", "#1D4ED8"],
        coloresDestaque: ["#F59E0B", "#D97706"],
        tipografia: { titulo: "serif", cuerpo: "serif" },
        vibes: ["editorial", "magazine", "luxury", "premium", "bold"],
        mejorPara: ["branding", "editorial", "publicidad", "revistas digitales", "agencias creativas"],
    },
    "vibrante-creativo": {
        descripcion: "Colores saturados y atrevidos, layouts asimétricos, múltiples bloques de color, tipografía display o sans-serif pesada. Para creativos que quieren destacar y llamar la atención.",
        coloresPrimarios: ["#7C3AED", "#DB2777", "#0EA5E9"],
        coloresAcento: ["#F59E0B", "#10B981", "#EF4444"],
        coloresDestaque: ["#FFFFFF", "#0F172A"],
        tipografia: { titulo: "sans-serif bold", cuerpo: "sans-serif" },
        vibes: ["vibrante", "creativo", "atrevido", "energético", "joven"],
        mejorPara: ["ilustración", "motion design", "redes sociales", "música", "gaming"],
    },
    "fotografico-elegante": {
        descripcion: "Las imágenes son protagonistas absolutas. Fondos blancos o negros puros, texto muy reducido, layouts que dejan que las fotos respiren. Para fotógrafos y artistas visuales.",
        coloresPrimarios: ["#FFFFFF", "#000000", "#0F172A"],
        coloresAcento: ["#1A1A1A", "#F5F5F5"],
        coloresDestaque: ["#94A3B8", "#64748B"],
        tipografia: { titulo: "serif light", cuerpo: "sans-serif light" },
        vibes: ["fotográfico", "visual", "artístico", "elegante", "puro"],
        mejorPara: ["fotografía", "arte visual", "galería", "moda editorial", "paisajismo"],
    },
    "tecnologia-moderna": {
        descripcion: "Azules, cianes y verdes eléctricos sobre fondo muy oscuro (casi negro). Tipografía monospace o sans-serif geométrica. Sensación de interfaz futurista. Para desarrolladores y perfiles tech.",
        coloresPrimarios: ["#0F172A", "#020617", "#111827"],
        coloresAcento: ["#0EA5E9", "#06B6D4", "#10B981"],
        coloresDestaque: ["#3B82F6", "#6366F1", "#8B5CF6"],
        tipografia: { titulo: "monospace / sans-serif", cuerpo: "monospace / sans-serif" },
        vibes: ["tech", "futurista", "digital", "moderno", "dark-mode"],
        mejorPara: ["desarrollo de software", "datos", "ciberseguridad", "inteligencia artificial", "blockchain"],
    },
    "arte-ilustracion": {
        descripcion: "Mezcla libre de colores, mucha creatividad en la distribución de bloques, fondos texturizados o de colores cálidos. Las plantillas de mosaico y grilla son ideales. Para ilustradores y artistas.",
        coloresPrimarios: ["#FEF3C7", "#FDF2F8", "#ECFDF5"],
        coloresAcento: ["#F59E0B", "#EC4899", "#10B981"],
        coloresDestaque: ["#7C3AED", "#0EA5E9", "#EF4444"],
        tipografia: { titulo: "serif / display", cuerpo: "sans-serif" },
        vibes: ["artístico", "colorido", "expresivo", "handmade", "lúdico"],
        mejorPara: ["ilustración", "cómic", "concept art", "diseño de personajes", "arte hecho a mano"],
    },
    "arquitectura-preciso": {
        descripcion: "Blanco, gris y negro estrictos. Mucha estructura, líneas limpias, imágenes de gran formato. Tipografía sans-serif ligera y precisa. Para arquitectos y diseñadores de interiores.",
        coloresPrimarios: ["#FFFFFF", "#F4F4F5", "#E4E4E7"],
        coloresAcento: ["#18181B", "#27272A", "#3F3F46"],
        coloresDestaque: ["#71717A", "#A1A1AA"],
        tipografia: { titulo: "sans-serif light", cuerpo: "sans-serif light" },
        vibes: ["arquitectónico", "preciso", "limpio", "neutro", "estructural"],
        mejorPara: ["arquitectura", "diseño de interiores", "diseño industrial", "urbanismo", "paisajismo"],
    },
    "corporativo-profesional": {
        descripcion: "Azul corporativo, gris y blanco. Estructura clara y predecible. Tipografía sans-serif segura y legible. Para perfiles profesionales, consultores y negocios.",
        coloresPrimarios: ["#1D4ED8", "#1E40AF", "#1E3A8A"],
        coloresAcento: ["#FFFFFF", "#F8FAFC"],
        coloresDestaque: ["#64748B", "#94A3B8"],
        tipografia: { titulo: "sans-serif", cuerpo: "sans-serif" },
        vibes: ["profesional", "confiable", "corporativo", "serio", "sólido"],
        mejorPara: ["consultoría", "marketing", "negocios", "educación", "recursos humanos"],
    },
    "moda-lifestyle": {
        descripcion: "Beige, crema, rosa pálido y negro. Tipografía serif fina y elegante. Mucho espacio. Imágenes de producto o persona. Para perfiles de moda, fotografía lifestyle y belleza.",
        coloresPrimarios: ["#FAFAF9", "#F5F0EB", "#FDF6F0"],
        coloresAcento: ["#1C1917", "#292524"],
        coloresDestaque: ["#D4A898", "#C8A882", "#E8D5C4"],
        tipografia: { titulo: "serif light", cuerpo: "serif" },
        vibes: ["fashion", "lifestyle", "elegante", "cálido", "orgánico"],
        mejorPara: ["moda", "costura", "belleza", "fotografía lifestyle", "blog personal"],
    },
};

const COMPONENT_REGISTRY = [

    // =====================================================
    // ESTRUCTURA 1
    // Hero centrado de un solo bloque
    // =====================================================

    {
        type: "Estructura1",

        nombre: "Hero centrado",

        category: "hero",

        descripcion:
            "Plantilla de un solo bloque visual centrado que ocupa toda la pantalla. El elemento más impactante del portafolio. Ideal como portada, primera impresión o declaración de identidad. El texto flota sobre un fondo de color sólido o imagen. Funciona perfectamente sola como apertura antes de otros bloques. Es la plantilla más minimalista y poderosa del sistema: un nombre, un título, una imagen de fondo y listo. No requiere mucho contenido, su fuerza está en el espacio vacío y en la tipografía grande. Usar cuando el usuario quiere una entrada directa, sin distracciones, con foco total en su nombre o propuesta de valor.",

        whenToUse:
            "Siempre como primera sección de cualquier portafolio. También como separador visual entre secciones importantes. Ideal para portafolios minimalistas que quieren decir mucho con poco.",

        whenNOTToUse:
            "No usar si el usuario tiene mucho contenido que mostrar en el primer bloque. No usar más de 2 veces en el mismo portafolio.",

        idealFor: [
            "portada principal",
            "hero de landing",
            "branding personal",
            "portafolio minimalista",
            "identidad creativa",
            "primera impresión de diseñador",
            "fotógrafo profesional",
        ],

        visualStyle: [
            "minimalista",
            "centrado",
            "clean",
            "elegante",
            "impactante",
            "full-screen",
        ],

        compatibleThemes: [
            "minimalista-oscuro",
            "clean-blanco",
            "fotografico-elegante",
            "arquitectura-preciso",
            "moda-lifestyle",
        ],

        designRules: {
            preferredColors: [
                "#111827",
                "#0F172A",
                "#FFFFFF",
                "#1C1917",
                "#F8FAFC",
            ],

            preferredFonts: [
                "serif",
                "sans-serif",
                "Georgia, serif",
                "Playfair Display, serif",
                "Inter, sans-serif",
            ],

            recommendedTextLength: {
                title: 40,
                description: 100,
            },

            preferredTextAlign: [
                "center",
            ],

            fontSize: {
                title: "48px a 72px",
                subtitle: "18px a 24px",
            },

            vibe: [
                "minimal",
                "premium",
                "clean",
                "impactante",
            ],

            colorCombinations: [
                { fondo: "#111827", texto: "#FFFFFF", descripcion: "dark premium" },
                { fondo: "#FFFFFF", texto: "#111827", descripcion: "clean light" },
                { fondo: "#0F172A", texto: "#F1F5F9", descripcion: "deep dark" },
                { fondo: "#1C1917", texto: "#FEF3C7", descripcion: "warm dark" },
            ],
        },

        allows: {
            text: true,
            image: true,
            backgroundColor: true,
            backgroundImage: true,
        },

        limits: {
            maxBlocks: 1,
            maxImages: 1,
            maxMainImages: 1,
        },

        recommendedImageSizes: {
            width: 1920,
            height: 1080,
            orientation: "horizontal",
            tip: "Imagen panorámica de alta resolución. Puede ser foto de la persona, trabajo representativo o textura abstracta.",
        },

        restrictions: [
            "Solo un contenido principal",
            "No usar para mucho texto — máximo 1 frase corta",
            "No repetir más de 2 veces en el mismo portafolio",
        ],

        fields: {
            ...BASE_FIELDS,
        },

        schema: {
            ...BASE_SCHEMA,
        },

        example: {
            type: "Estructura1",

            data: {
                texto: "Diseñadora Visual & Brand Strategist",
                colorTexto: "#FFFFFF",
                colorFondo: "#0F172A",
                imageUrl: "",
                fontSize: "52px",
                bold: true,
                italic: false,
                align: "center",
                textPosition: "center",
                fontFamily: "Georgia, serif",
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_1
    // Split screen vertical — dos bloques apilados
    // =====================================================

    {
        type: "Estructura1_1",

        nombre: "Split vertical doble",

        category: "split",

        descripcion:
            "Dos bloques apilados verticalmente que dividen la pantalla en dos mitades. La mitad superior y la inferior pueden tener colores, imágenes o textos completamente distintos, creando un contraste visual muy poderoso. Es una plantilla dinámica que cuenta una historia en dos actos: el primer bloque presenta (puede ser el nombre o título), el segundo complementa (especialidad, proyecto o concepto clave). Perfecta para portafolios que quieren mostrar dos aspectos de su trabajo o identidad de manera directa. El contraste de colores entre los dos bloques es lo que hace el efecto visual. Funciona muy bien con fondo oscuro arriba / claro abajo o viceversa.",

        whenToUse:
            "Cuando el usuario quiere mostrar dos elementos contrastantes: nombre + especialidad, dos proyectos importantes, antes/después de un proceso creativo, dos conceptos que definen su trabajo.",

        whenNOTToUse:
            "No usar si el usuario solo tiene un mensaje principal (usar Estructura1 en ese caso). No usar si necesita mostrar muchas imágenes juntas.",

        idealFor: [
            "split screen bicolor",
            "branding con dos conceptos",
            "presentación nombre + título",
            "contraste dramático",
            "diseñador con dos especialidades",
            "proyectos destacados en pareja",
        ],

        visualStyle: [
            "moderno",
            "vertical",
            "editorial",
            "bicolor",
            "contrastante",
            "dinámico",
        ],

        compatibleThemes: [
            "editorial-premium",
            "minimalista-oscuro",
            "clean-blanco",
            "vibrante-creativo",
            "corporativo-profesional",
        ],

        designRules: {
            preferredColors: [
                "#111827",
                "#2563EB",
                "#FFFFFF",
                "#DC2626",
                "#0EA5E9",
            ],

            preferredFonts: [
                "sans-serif",
                "serif",
                "Inter, sans-serif",
                "Playfair Display, serif",
            ],

            recommendedTextLength: {
                title: 60,
                description: 180,
            },

            preferredTextAlign: [
                "left",
                "center",
            ],

            fontSize: {
                title: "36px a 56px",
                subtitle: "16px a 22px",
            },

            vibe: [
                "modern",
                "editorial",
                "bicolor",
                "clean",
            ],

            colorCombinations: [
                { bloqueTop: "#111827", bloqueBottom: "#2563EB", descripcion: "dark / blue split" },
                { bloqueTop: "#FFFFFF", bloqueBottom: "#0F172A", descripcion: "light / dark split" },
                { bloqueTop: "#DC2626", bloqueBottom: "#FFFFFF", descripcion: "red / white editorial" },
                { bloqueTop: "#F8FAFC", bloqueBottom: "#1E293B", descripcion: "soft / deep split" },
            ],
        },

        allows: {
            text: true,
            image: true,
            backgroundColor: true,
            backgroundImage: true,
        },

        limits: {
            maxBlocks: 2,
            maxImages: 2,
            maxMainImages: 2,
        },

        recommendedImageSizes: {
            width: 1920,
            height: 550,
            orientation: "horizontal",
            tip: "Cada bloque puede tener su propia imagen de fondo o trabajar solo con color.",
        },

        restrictions: [
            "Requiere bloqueTop y bloqueBottom",
            "Máximo un texto corto por bloque",
        ],

        fields: {
            ...BASE_FIELDS,
            fondo: BLOCK_FIELDS,
            bloqueTop: BLOCK_FIELDS,
            bloqueBottom: BLOCK_FIELDS,
        },

        schema: {
            ...BASE_SCHEMA,
            fondo: BLOCK_SCHEMA,
            bloqueTop: BLOCK_SCHEMA,
            bloqueBottom: BLOCK_SCHEMA,
        },

        example: {
            type: "Estructura1_1",

            data: {
                fondo: { colorFondo: "#111827" },
                bloqueTop: {
                    texto: "Juan Rodríguez",
                    colorTexto: "#FFFFFF",
                    fontSize: "48px",
                    bold: true,
                    align: "center",
                    fontFamily: "Georgia, serif",
                },
                bloqueBottom: {
                    texto: "Frontend Developer & UI Designer",
                    colorFondo: "#2563EB",
                    colorTexto: "#FFFFFF",
                    fontSize: "22px",
                    align: "center",
                },
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_2
    // Stack triple — tres bloques apilados
    // =====================================================

    {
        type: "Estructura1_2",

        nombre: "Stack triple vertical",

        category: "stack",

        descripcion:
            "Tres bloques apilados verticalmente que cuentan una historia en tres capítulos. Es la plantilla de storytelling por excelencia. El bloque superior establece contexto (nombre, título), el central muestra el trabajo destacado (imagen principal o concepto clave), el inferior cierra con una conclusión o segundo elemento. Cada bloque puede tener colores, imágenes y textos diferentes. La lectura vertical fluye de arriba abajo de forma natural. Muy efectiva para portafolios que quieren guiar al espectador por un recorrido visual ordenado. Funciona especialmente bien cuando se combina un bloque de texto + bloque de imagen + bloque de color de acento.",

        whenToUse:
            "Para portafolios con storytelling claro y lineal. Cuando el usuario quiere mostrar su nombre, su trabajo y una tercera pieza de información (como una especialidad, cliente importante o frase clave). Ideal para fotógrafos, escritores y diseñadores editoriales.",

        whenNOTToUse:
            "No usar si el usuario quiere mostrar múltiples trabajos en paralelo (usar GrillaDoble o GrillaTriple en ese caso).",

        idealFor: [
            "storytelling lineal",
            "editorial",
            "galería secuencial",
            "landing page",
            "narrativa visual",
            "fotógrafo con imagen destacada",
            "escritor o comunicador",
        ],

        visualStyle: [
            "editorial",
            "stacked",
            "moderno",
            "narrativo",
            "visual",
            "secuencial",
        ],

        compatibleThemes: [
            "fotografico-elegante",
            "editorial-premium",
            "minimalista-oscuro",
            "moda-lifestyle",
            "arte-ilustracion",
        ],

        designRules: {
            preferredColors: [
                "#0F172A",
                "#FFFFFF",
                "#1E293B",
                "#F8FAFC",
                "#F59E0B",
            ],

            preferredFonts: [
                "serif",
                "sans-serif",
                "Playfair Display, serif",
                "Cormorant Garamond, serif",
            ],

            recommendedTextLength: {
                title: 60,
                description: 200,
            },

            preferredTextAlign: [
                "left",
                "center",
            ],

            fontSize: {
                title: "40px a 64px",
                body: "16px a 20px",
            },

            vibe: [
                "storytelling",
                "modern",
                "visual",
                "editorial",
            ],

            colorCombinations: [
                { top: "#0F172A", mid: "imagen", bottom: "#FFFFFF", descripcion: "dark + image + light" },
                { top: "#FFFFFF", mid: "#1E293B", bottom: "#F59E0B", descripcion: "light + dark + accent" },
                { top: "#F8FAFC", mid: "imagen", bottom: "#0F172A", descripcion: "soft + image + deep" },
            ],
        },

        allows: {
            text: true,
            image: true,
            backgroundColor: true,
            backgroundImage: true,
        },

        limits: {
            maxBlocks: 3,
            maxImages: 3,
            maxMainImages: 2,
        },

        recommendedImageSizes: {
            width: 1000,
            height: 600,
            orientation: "mixed",
            tip: "Idealmente usar una imagen grande en el bloque central. Los bloques superior e inferior funcionan bien solo con color.",
        },

        restrictions: [
            "Requiere bloqueTop, bloqueMid y bloqueBottom",
            "Ideal combinar: texto + imagen + color",
        ],

        fields: {
            ...BASE_FIELDS,
            fondo: BLOCK_FIELDS,
            bloqueTop: BLOCK_FIELDS,
            bloqueMid: BLOCK_FIELDS,
            bloqueBottom: BLOCK_FIELDS,
        },

        schema: {
            ...BASE_SCHEMA,
            fondo: BLOCK_SCHEMA,
            bloqueTop: BLOCK_SCHEMA,
            bloqueMid: BLOCK_SCHEMA,
            bloqueBottom: BLOCK_SCHEMA,
        },

        example: {
            type: "Estructura1_2",

            data: {
                fondo: { colorFondo: "#0F172A" },
                bloqueTop: {
                    texto: "Fotografía de Naturaleza",
                    colorTexto: "#FFFFFF",
                    fontSize: "44px",
                    bold: true,
                    align: "center",
                    fontFamily: "Playfair Display, serif",
                },
                bloqueMid: {
                    imageUrl: "",
                    colorFondo: "#1E293B",
                },
                bloqueBottom: {
                    texto: "Costa Rica · 2024",
                    colorFondo: "#F59E0B",
                    colorTexto: "#0F172A",
                    fontSize: "20px",
                    align: "center",
                    bold: false,
                },
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_3
    // Editorial magazine — cuatro bloques jerárquicos
    // =====================================================

    {
        type: "Estructura1_3",

        nombre: "Editorial magazine",

        category: "editorial",

        descripcion:
            "Layout editorial estilo magazine de lujo. Cuatro bloques en una composición jerárquica: bloque superior (titular principal grande), bloque central (imagen o contenido hero), dos bloques inferiores en paralelo (complemento visual o textual). Es la plantilla más parecida a una portada de revista. Transmite sofisticación, autoridad y creatividad. Perfecta para agencias, estudios creativos, directores de arte y cualquier profesional que quiera proyectar una imagen premium. El uso de tipografía serif grande en el titular con un color de acento fuerte en uno de los bloques inferiores crea el contraste clásico del diseño editorial.",

        whenToUse:
            "Cuando el usuario quiere una presencia visual muy fuerte y premium. Para agencias creativas, estudios de branding, directores de arte, fotógrafos editoriales. También ideal como sección de 'proyecto destacado' en el portafolio.",

        whenNOTToUse:
            "No usar para portafolios simples o cuando el usuario prefiere algo más minimalista. Requiere que el usuario tenga contenido visual rico para todos los bloques.",

        idealFor: [
            "agencia creativa",
            "directora de arte",
            "estudio de branding",
            "revista digital",
            "proyecto destacado",
            "editorial de moda",
            "portafolio premium",
        ],

        visualStyle: [
            "editorial",
            "premium",
            "magazine",
            "jerárquico",
            "luxury",
            "bold",
        ],

        compatibleThemes: [
            "editorial-premium",
            "minimalista-oscuro",
            "moda-lifestyle",
            "vibrante-creativo",
            "fotografico-elegante",
        ],

        designRules: {
            preferredColors: [
                "#1E293B",
                "#DC2626",
                "#FFFFFF",
                "#0F172A",
                "#B91C1C",
            ],

            preferredFonts: [
                "serif",
                "Playfair Display, serif",
                "Cormorant Garamond, serif",
                "Georgia, serif",
            ],

            recommendedTextLength: {
                title: 80,
                description: 300,
            },

            preferredTextAlign: [
                "left",
                "center",
            ],

            fontSize: {
                title: "56px a 80px",
                body: "16px a 20px",
            },

            vibe: [
                "editorial",
                "luxury",
                "premium",
                "magazine",
            ],

            colorCombinations: [
                { top: "#1E293B", mid: "imagen", bottom1: "#DC2626", bottom2: "#FFFFFF", descripcion: "dark editorial con acento rojo" },
                { top: "#FFFFFF", mid: "#0F172A", bottom1: "#1D4ED8", bottom2: "#F8FAFC", descripcion: "clean editorial con azul" },
                { top: "#0F172A", mid: "imagen", bottom1: "#F59E0B", bottom2: "#1E293B", descripcion: "dark con acento dorado" },
            ],
        },

        allows: {
            text: true,
            image: true,
            backgroundColor: true,
            backgroundImage: true,
        },

        limits: {
            maxBlocks: 4,
            maxImages: 4,
            maxMainImages: 3,
        },

        recommendedImageSizes: {
            width: 700,
            height: 700,
            orientation: "mixed",
            tip: "El bloque central funciona mejor con imagen cuadrada o landscape. Los bloques inferiores mejor con color sólido o imagen pequeña.",
        },

        restrictions: [
            "Requiere bloqueTop, bloqueMid, bloqueBottom1 y bloqueBottom2",
            "El titular en bloqueTop debe ser impactante y corto",
        ],

        fields: {
            ...BASE_FIELDS,
            fondo: BLOCK_FIELDS,
            bloqueTop: BLOCK_FIELDS,
            bloqueMid: BLOCK_FIELDS,
            bloqueBottom1: BLOCK_FIELDS,
            bloqueBottom2: BLOCK_FIELDS,
        },

        schema: {
            ...BASE_SCHEMA,
            fondo: BLOCK_SCHEMA,
            bloqueTop: BLOCK_SCHEMA,
            bloqueMid: BLOCK_SCHEMA,
            bloqueBottom1: BLOCK_SCHEMA,
            bloqueBottom2: BLOCK_SCHEMA,
        },

        example: {
            type: "Estructura1_3",

            data: {
                fondo: { colorFondo: "#1E293B" },
                bloqueTop: {
                    texto: "Creative Studio",
                    colorTexto: "#FFFFFF",
                    fontSize: "64px",
                    bold: true,
                    align: "left",
                    fontFamily: "Playfair Display, serif",
                },
                bloqueMid: {
                    imageUrl: "",
                    colorFondo: "#0F172A",
                },
                bloqueBottom1: {
                    colorFondo: "#DC2626",
                    texto: "Brand Identity",
                    colorTexto: "#FFFFFF",
                    fontSize: "20px",
                    align: "center",
                },
                bloqueBottom2: {
                    texto: "2024",
                    colorFondo: "#FFFFFF",
                    colorTexto: "#1E293B",
                    fontSize: "20px",
                    align: "center",
                },
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_4
    // Mosaico — cinco bloques en composición dinámica
    // =====================================================

    {
        type: "Estructura1_4",

        nombre: "Mosaico dinámico",

        category: "mosaic",

        descripcion:
            "Layout tipo mosaico con cinco bloques en una composición irregular y dinámica. Un bloque superior grande (casi full-width) y cuatro bloques inferiores en cuadrícula. Es la plantilla más rica visualmente: permite mezclar imágenes, colores sólidos y textos en una sola composición. Ideal para portfolios de arte, fotografía, ilustración o diseño gráfico donde se quieren mostrar múltiples trabajos en un solo vistazo. La variedad de tamaños crea ritmo visual y mantiene el interés. Muy efectiva cuando se combinan 2-3 imágenes con 2-3 bloques de color.",

        whenToUse:
            "Para mostrar múltiples piezas de trabajo al mismo tiempo. Cuando el usuario tiene varias imágenes o proyectos que quiere destacar en paralelo. Ideal para galerías, showcases de producto, proyectos de ilustración, colecciones de fotografía.",

        whenNOTToUse:
            "No usar como primera sección de portafolio (mejor usar Estructura1 o GrillaDoble primero). No usar si el usuario tiene solo un elemento que mostrar.",

        idealFor: [
            "galería de trabajos",
            "showcase de productos",
            "portfolio de ilustración",
            "colección de fotografía",
            "branding multipieza",
            "agencia con múltiples proyectos",
            "diseño gráfico variado",
        ],

        visualStyle: [
            "mosaico",
            "creativo",
            "dinámico",
            "visual",
            "moderno",
            "galería",
        ],

        compatibleThemes: [
            "arte-ilustracion",
            "fotografico-elegante",
            "vibrante-creativo",
            "editorial-premium",
            "minimalista-oscuro",
        ],

        designRules: {
            preferredColors: [
                "#0F172A",
                "#FFFFFF",
                "#7C3AED",
                "#DB2777",
                "#0EA5E9",
            ],

            preferredFonts: [
                "sans-serif",
                "serif",
                "Inter, sans-serif",
            ],

            recommendedTextLength: {
                title: 60,
                description: 150,
            },

            preferredTextAlign: [
                "center",
                "left",
            ],

            fontSize: {
                title: "28px a 40px",
                label: "14px a 18px",
            },

            vibe: [
                "creative",
                "dynamic",
                "visual",
                "gallery",
            ],

            colorCombinations: [
                { top: "#0F172A", bloques: ["#7C3AED", "imagen", "#0EA5E9", "imagen"], descripcion: "dark con acentos vibrantes" },
                { top: "#FFFFFF", bloques: ["imagen", "#1E293B", "imagen", "#F59E0B"], descripcion: "clean con imagen y accents" },
                { top: "imagen", bloques: ["#DC2626", "#FFFFFF", "#0F172A", "imagen"], descripcion: "imagen principal con mosaico editorial" },
            ],
        },

        allows: {
            text: true,
            image: true,
            backgroundColor: true,
            backgroundImage: true,
        },

        limits: {
            maxBlocks: 5,
            maxImages: 5,
            maxMainImages: 4,
        },

        recommendedImageSizes: {
            width: 400,
            height: 500,
            orientation: "vertical",
            tip: "Cada bloque del mosaico funciona mejor con imágenes verticales. El bloque superior puede tener imagen horizontal.",
        },

        restrictions: [
            "Requiere bloqueTop, bloque1, bloque2, bloque3 y bloque4",
            "Mezclar imágenes y colores sólidos para mejor efecto visual",
        ],

        fields: {
            ...BASE_FIELDS,
            fondo: BLOCK_FIELDS,
            bloqueTop: BLOCK_FIELDS,
            bloque1: BLOCK_FIELDS,
            bloque2: BLOCK_FIELDS,
            bloque3: BLOCK_FIELDS,
            bloque4: BLOCK_FIELDS,
        },

        schema: {
            ...BASE_SCHEMA,
            fondo: BLOCK_SCHEMA,
            bloqueTop: BLOCK_SCHEMA,
            bloque1: BLOCK_SCHEMA,
            bloque2: BLOCK_SCHEMA,
            bloque3: BLOCK_SCHEMA,
            bloque4: BLOCK_SCHEMA,
        },

        example: {
            type: "Estructura1_4",

            data: {
                fondo: { colorFondo: "#0F172A" },
                bloqueTop: {
                    imageUrl: "",
                    texto: "Proyectos 2024",
                    colorTexto: "#FFFFFF",
                    fontSize: "32px",
                    bold: true,
                    align: "center",
                },
                bloque1: {
                    texto: "Branding",
                    colorFondo: "#7C3AED",
                    colorTexto: "#FFFFFF",
                    fontSize: "20px",
                    align: "center",
                },
                bloque2: { imageUrl: "", colorFondo: "#1E293B" },
                bloque3: {
                    colorFondo: "#0EA5E9",
                    texto: "UI Design",
                    colorTexto: "#FFFFFF",
                    fontSize: "18px",
                    align: "center",
                },
                bloque4: { imageUrl: "", colorFondo: "#0F172A" },
            },
        },
    },

    // =====================================================
    // GRILLA DOBLE
    // Dos columnas iguales lado a lado
    // =====================================================

    {
        type: "GrillaDoble",

        nombre: "Grilla doble columnas",

        category: "grid",

        descripcion:
            "Dos columnas de igual tamaño lado a lado. Es la plantilla de grilla más simple y versátil. El fondo puede tener color o imagen que se extiende por toda la plantilla, y los dos bloques internos flotan sobre él. Perfecta para comparaciones visuales, mostrar dos proyectos del mismo peso, texto a la izquierda e imagen a la derecha (o viceversa), o simplemente crear un ritmo de dos columnas en el portafolio. Es una plantilla muy usada en portfolios de diseño por su equilibrio visual. Los dos bloques se alinean horizontalmente y tienen la misma altura, lo que crea una sensación de orden y balance. Funciona tanto con imágenes como con texto y color.",

        whenToUse:
            "Para mostrar dos elementos de igual importancia en paralelo. Textos descriptivos junto a imágenes. Dos proyectos comparables. Dos habilidades o servicios. Cualquier contenido que se beneficie de un layout de dos columnas.",

        whenNOTToUse:
            "No usar si el usuario tiene contenido muy desigual entre los dos bloques (un bloque muy lleno y otro vacío). Para contenido muy asimétrico usar Grilla1_2_Izda o Grilla1_2_Derecha.",

        idealFor: [
            "dos proyectos en paralelo",
            "texto + imagen",
            "comparación visual",
            "dos habilidades o servicios",
            "sección about me",
            "diseñador UX/UI con descripción",
            "fotógrafo con texto de contexto",
        ],

        visualStyle: [
            "simétrico",
            "equilibrado",
            "grid",
            "moderno",
            "ordenado",
        ],

        compatibleThemes: [
            "clean-blanco",
            "minimalista-oscuro",
            "tecnologia-moderna",
            "corporativo-profesional",
            "arquitectura-preciso",
        ],

        designRules: {
            preferredColors: [
                "#FFFFFF",
                "#0F172A",
                "#F8FAFC",
                "#1E293B",
                "#0EA5E9",
            ],

            preferredFonts: [
                "sans-serif",
                "Inter, sans-serif",
                "Roboto, sans-serif",
            ],

            recommendedTextLength: {
                title: 50,
                description: 200,
            },

            preferredTextAlign: [
                "left",
                "center",
            ],

            fontSize: {
                title: "28px a 40px",
                body: "14px a 18px",
            },

            vibe: [
                "balanced",
                "clean",
                "modern",
                "grid",
            ],

            colorCombinations: [
                { fondo: "#FFFFFF", bloque1: "#0F172A", bloque2: "#F8FAFC", descripcion: "clean bicolor" },
                { fondo: "#0F172A", bloque1: "#1E293B", bloque2: "#0EA5E9", descripcion: "dark tech" },
                { fondo: "#F8FAFC", bloque1: "imagen", bloque2: "#1E293B", descripcion: "imagen + texto oscuro" },
            ],
        },

        allows: {
            text: true,
            image: true,
            backgroundColor: true,
            backgroundImage: true,
        },

        limits: {
            maxBlocks: 2,
            maxImages: 3,
            maxMainImages: 2,
        },

        recommendedImageSizes: {
            width: 800,
            height: 600,
            orientation: "mixed",
            tip: "Las imágenes en las columnas funcionan bien en formato cuadrado o landscape suave.",
        },

        restrictions: [
            "Requiere bloque1 y bloque2",
            "Ambos bloques tienen el mismo peso visual — no usar para contenido muy asimétrico",
        ],

        fields: {
            ...BASE_FIELDS,
            fondo: BLOCK_FIELDS,
            bloque1: BLOCK_FIELDS,
            bloque2: BLOCK_FIELDS,
        },

        schema: {
            ...BASE_SCHEMA,
            fondo: BLOCK_SCHEMA,
            bloque1: BLOCK_SCHEMA,
            bloque2: BLOCK_SCHEMA,
        },

        example: {
            type: "GrillaDoble",

            data: {
                fondo: { colorFondo: "#F8FAFC" },
                bloque1: {
                    texto: "Sobre mí",
                    colorTexto: "#0F172A",
                    colorFondo: "#FFFFFF",
                    fontSize: "32px",
                    bold: true,
                    align: "left",
                    fontFamily: "Inter, sans-serif",
                },
                bloque2: {
                    imageUrl: "",
                    colorFondo: "#0EA5E9",
                },
            },
        },
    },

    // =====================================================
    // GRILLA TRIPLE
    // Tres columnas de igual tamaño
    // =====================================================

    {
        type: "GrillaTriple",

        nombre: "Grilla triple columnas",

        category: "grid",

        descripcion:
            "Tres columnas de igual tamaño dispuestas horizontalmente sobre un fondo común. La plantilla de grilla más completa para mostrar múltiples elementos en paralelo. Perfecta para portafolios con tres proyectos, tres habilidades, tres servicios o tres imágenes que quieran verse a la misma altura. El ritmo de tres columnas es muy agradable visualmente y se usa mucho en portfolios de diseñadores, fotógrafos y artistas que quieren mostrar variedad sin perder orden. Cada columna puede tener texto, imagen o color sólido independiente.",

        whenToUse:
            "Para mostrar tres elementos del mismo nivel de importancia. Tres proyectos recientes, tres servicios, tres áreas de especialidad. También excelente para secciones de galería o showcases de colección.",

        whenNOTToUse:
            "No usar si el usuario tiene menos de tres elementos para mostrar (usar GrillaDoble). No usar si el contenido es muy narrativo y necesita fluir linealmente.",

        idealFor: [
            "tres proyectos en paralelo",
            "galería de tres imágenes",
            "tres servicios o habilidades",
            "showcase de colección",
            "portafolio de diseño gráfico",
            "fotógrafo con tres series",
            "diseñador con tres especialidades",
        ],

        visualStyle: [
            "simétrico",
            "grid",
            "galería",
            "equilibrado",
            "moderno",
            "triptyco",
        ],

        compatibleThemes: [
            "fotografico-elegante",
            "arte-ilustracion",
            "minimalista-oscuro",
            "clean-blanco",
            "vibrante-creativo",
        ],

        designRules: {
            preferredColors: [
                "#0F172A",
                "#FFFFFF",
                "#1E293B",
                "#F8FAFC",
            ],

            preferredFonts: [
                "sans-serif",
                "Inter, sans-serif",
                "serif",
            ],

            recommendedTextLength: {
                title: 40,
                description: 120,
            },

            preferredTextAlign: [
                "center",
                "left",
            ],

            fontSize: {
                title: "24px a 32px",
                label: "14px a 16px",
            },

            vibe: [
                "gallery",
                "balanced",
                "modern",
                "triptych",
            ],

            colorCombinations: [
                { fondo: "#0F172A", columnas: ["imagen", "imagen", "imagen"], descripcion: "galería oscura con fotos" },
                { fondo: "#FFFFFF", columnas: ["#0F172A", "imagen", "#0EA5E9"], descripcion: "clean con acento" },
                { fondo: "#F8FAFC", columnas: ["imagen", "#1E293B", "imagen"], descripcion: "galería clara" },
            ],
        },

        allows: {
            text: true,
            image: true,
            backgroundColor: true,
            backgroundImage: true,
        },

        limits: {
            maxBlocks: 3,
            maxImages: 4,
            maxMainImages: 3,
        },

        recommendedImageSizes: {
            width: 600,
            height: 700,
            orientation: "vertical",
            tip: "Las columnas funcionan mejor con imágenes verticales o cuadradas de resolución media.",
        },

        restrictions: [
            "Requiere bloque1, bloque2 y bloque3",
            "Todas las columnas tienen el mismo ancho — ideal para contenido homogéneo",
        ],

        fields: {
            ...BASE_FIELDS,
            fondo: BLOCK_FIELDS,
            bloque1: BLOCK_FIELDS,
            bloque2: BLOCK_FIELDS,
            bloque3: BLOCK_FIELDS,
        },

        schema: {
            ...BASE_SCHEMA,
            fondo: BLOCK_SCHEMA,
            bloque1: BLOCK_SCHEMA,
            bloque2: BLOCK_SCHEMA,
            bloque3: BLOCK_SCHEMA,
        },

        example: {
            type: "GrillaTriple",

            data: {
                fondo: { colorFondo: "#0F172A" },
                bloque1: {
                    imageUrl: "",
                    texto: "Fotografía",
                    colorTexto: "#FFFFFF",
                    fontSize: "18px",
                    align: "center",
                    colorFondo: "#1E293B",
                },
                bloque2: {
                    imageUrl: "",
                    texto: "Retrato",
                    colorTexto: "#FFFFFF",
                    fontSize: "18px",
                    align: "center",
                    colorFondo: "#1E293B",
                },
                bloque3: {
                    imageUrl: "",
                    texto: "Paisaje",
                    colorTexto: "#FFFFFF",
                    fontSize: "18px",
                    align: "center",
                    colorFondo: "#1E293B",
                },
            },
        },
    },
];

module.exports = {
    COMPONENT_REGISTRY,
    STYLE_THEMES,
};
