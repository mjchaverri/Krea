const { BASE_FIELDS } = require("./baseFields");
const { BLOCK_FIELDS } = require("./blockFields");

const { BASE_SCHEMA } = require("./baseSchema");
const { BLOCK_SCHEMA } = require("./blockSchema");

const COMPONENT_REGISTRY = [

    // =====================================================
    // ESTRUCTURA 1
    // =====================================================

    {
        type: "Estructura1",

        nombre: "Layout centrado",

        category: "hero",

        descripcion:
            "Layout minimalista centrado con un único bloque principal.",

        idealFor: [
            "landing",
            "branding",
            "hero",
            "portfolio",
            "minimalismo",
        ],

        visualStyle: [
            "minimalista",
            "centrado",
            "clean",
            "elegante",
        ],

        designRules: {
            preferredColors: [
                "#111827",
                "#0F172A",
                "#FFFFFF",
            ],

            preferredFonts: [
                "serif",
                "sans-serif",
            ],

            recommendedTextLength: {
                title: 40,
                description: 120,
            },

            preferredTextAlign: [
                "center",
            ],

            vibe: [
                "minimal",
                "premium",
                "clean",
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
        },

        restrictions: [
            "solo un contenido principal",
            "no recomendado para mucho texto",
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
                texto: "Frontend Developer",

                colorTexto: "#FFFFFF",

                colorFondo: "#111827",

                imageUrl:
                    "https://example.com/image.jpg",

                fontSize: "32px",

                bold: true,

                italic: false,

                align: "center",

                textPosition: "center",

                fontFamily: "serif",
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_1
    // =====================================================

    {
        type: "Estructura1_1",

        nombre: "Layout vertical doble",

        category: "split",

        descripcion:
            "Layout dividido verticalmente en dos bloques principales.",

        idealFor: [
            "landing",
            "split screen",
            "branding",
            "proyectos destacados",
        ],

        visualStyle: [
            "moderno",
            "vertical",
            "editorial",
            "clean",
        ],

        designRules: {
            preferredColors: [
                "#111827",
                "#2563EB",
                "#FFFFFF",
            ],

            preferredFonts: [
                "sans-serif",
                "serif",
            ],

            recommendedTextLength: {
                title: 60,
                description: 180,
            },

            preferredTextAlign: [
                "left",
                "center",
            ],

            vibe: [
                "modern",
                "editorial",
                "clean",
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
            width: 1920,
            height: 550,
            orientation: "horizontal",
        },

        restrictions: [
            "requiere bloqueTop",
            "requiere bloqueBottom",
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
                fondo: {
                    colorFondo: "#111827",
                },

                bloqueTop: {
                    texto: "Frontend Developer",
                    colorTexto: "#FFFFFF",
                },

                bloqueBottom: {
                    texto: "UI / UX Designer",
                    colorFondo: "#2563EB",
                },
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_2
    // =====================================================

    {
        type: "Estructura1_2",

        nombre: "Layout triple vertical",

        category: "stack",

        descripcion:
            "Layout vertical dividido en tres bloques principales.",

        idealFor: [
            "storytelling",
            "editorial",
            "galerías",
            "landing",
        ],

        visualStyle: [
            "editorial",
            "stacked",
            "moderno",
            "visual",
        ],

        designRules: {
            preferredColors: [
                "#0F172A",
                "#FFFFFF",
                "#1E293B",
            ],

            preferredFonts: [
                "serif",
                "sans-serif",
            ],

            recommendedTextLength: {
                title: 70,
                description: 250,
            },

            preferredTextAlign: [
                "left",
                "center",
            ],

            vibe: [
                "storytelling",
                "modern",
                "visual",
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
            maxMainImages: 2,
        },

        recommendedImageSizes: {
            width: 1000,
            height: 800,
            orientation: "mixed",
        },

        restrictions: [
            "requiere bloqueTop",
            "requiere bloqueMid",
            "requiere bloqueBottom",
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
                fondo: {
                    colorFondo: "#0F172A",
                },

                bloqueTop: {
                    texto: "Diseño Web",

                    imageUrl:
                        "https://example.com/top.jpg",
                },

                bloqueMid: {
                    texto: "UI / UX",

                    colorTexto: "#FFFFFF",
                },

                bloqueBottom: {
                    imageUrl:
                        "https://example.com/bottom.jpg",
                },
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_3
    // =====================================================

    {
        type: "Estructura1_3",

        nombre: "Layout editorial",

        category: "editorial",

        descripcion:
            "Layout editorial con múltiples bloques jerárquicos.",

        idealFor: [
            "revistas digitales",
            "branding",
            "editorial",
            "storytelling",
        ],

        visualStyle: [
            "editorial",
            "premium",
            "moderno",
            "magazine",
        ],

        designRules: {
            preferredColors: [
                "#1E293B",
                "#DC2626",
                "#FFFFFF",
            ],

            preferredFonts: [
                "serif",
            ],

            recommendedTextLength: {
                title: 90,
                description: 400,
            },

            preferredTextAlign: [
                "left",
                "center",
            ],

            vibe: [
                "editorial",
                "luxury",
                "premium",
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
            maxImages: 5,
            maxMainImages: 3,
        },

        recommendedImageSizes: {
            width: 700,
            height: 700,
            orientation: "mixed",
        },

        restrictions: [
            "requiere bloqueTop",
            "requiere bloqueMid",
            "requiere bloqueBottom1",
            "requiere bloqueBottom2",
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
                fondo: {
                    colorFondo: "#1E293B",
                },

                bloqueTop: {
                    texto: "Creative Studio",

                    colorTexto: "#FFFFFF",
                },

                bloqueMid: {
                    imageUrl:
                        "https://example.com/center.jpg",
                },

                bloqueBottom1: {
                    colorFondo: "#DC2626",
                },

                bloqueBottom2: {
                    texto: "Brand Identity",
                },
            },
        },
    },

    // =====================================================
    // ESTRUCTURA 1_4
    // =====================================================

    {
        type: "Estructura1_4",

        nombre: "Layout mosaico",

        category: "mosaic",

        descripcion:
            "Layout tipo mosaico con múltiples bloques visuales.",

        idealFor: [
            "galerías",
            "branding",
            "showcases",
            "creative portfolio",
        ],

        visualStyle: [
            "mosaico",
            "creativo",
            "visual",
            "moderno",
        ],
        designRules: {
            preferredColors: [
                "#0F172A",
                "#7F1D1D",
                "#FFFFFF",
            ],

            preferredFonts: [
                "sans-serif",
                "serif",
            ],

            recommendedTextLength: {
                title: 70,
                description: 180,
            },

            preferredTextAlign: [
                "center",
                "left",
            ],

            vibe: [
                "creative",
                "dynamic",
                "visual",
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
            maxImages: 6,
            maxMainImages: 4,
        },

        recommendedImageSizes: {
            width: 300,
            height: 500,
            orientation: "vertical",
        },

        restrictions: [
            "requiere bloqueTop",
            "requiere bloque1",
            "requiere bloque2",
            "requiere bloque3",
            "requiere bloque4",
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
                fondo: {
                    colorFondo: "#0F172A",
                },

                bloqueTop: {
                    imageUrl:
                        "https://example.com/header.jpg",
                },

                bloque1: {
                    texto: "UI Design",
                },

                bloque2: {
                    imageUrl:
                        "https://example.com/gallery.jpg",
                },

                bloque3: {
                    colorFondo: "#7F1D1D",
                },

                bloque4: {
                    texto: "Creative Portfolio",

                    colorTexto: "#FFFFFF",
                },
            },
        },
    },
];

module.exports = {
    COMPONENT_REGISTRY,
};