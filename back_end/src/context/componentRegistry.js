const { BASE_FIELDS } = require("./baseFields");
const { BLOCK_FIELDS } = require("./blockFields");
const COMPONENT_REGISTRY = [

    {
        type: "Estructura1",

        nombre: "Layout centrado",

        category: "hero",

        descripcion: `
        Layout centrado con un único bloque principal.
        Ideal para portadas y presentaciones minimalistas.
        `,

        idealFor: [
            "portadas",
            "hero sections",
            "presentaciones personales",
            "proyectos únicos",
            "diseño minimalista",
            "imagen de fondo"
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

        restrictions: [
            "solo un bloque principal",
            "contenido centrado",
        ],

        fields: {
            ...BASE_FIELDS,
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

    {
        type: "Estructura1_1",

        nombre: "Layout vertical doble",

        category: "split",

        descripcion: `
        Layout dividido verticalmente
        con dos bloques principales.
        `,

        idealFor: [
            "Titulo principal o frase corta y texto",
            "Titulo principal o frase corta e imagen principal",
            "Imagen de fondo con titulo principal o frase corta",
            "Titulo principal o frase corta y color de fondo",
            "Imagen principal con texto o frase corta",
            "Imagen principal y color de fondo",
            "Color de fondo y texto",
            "Combinaciones de 3",
            "landing pages",
            "proyectos destacados",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

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
                    texto: "UI/UX Designer",
                    colorFondo: "#2563EB",
                },
            },
        },
    },

    {
        type: "Estructura1_2",

        nombre: "Layout triple vertical",

        category: "stack",

        descripcion: `
        Layout dividido en tres bloques verticales.
        Ideal para storytelling visual y proyectos editoriales.
        `,

        idealFor: [
            "storytelling",
            "portafolios editoriales",
            "galerías visuales",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

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

    {
        type: "Estructura1_3",

        nombre: "Layout editorial",

        category: "editorial",

        descripcion: `
Layout editorial con bloque superior,
bloque central destacado y dos bloques inferiores.
`,

        idealFor: [
            "revistas digitales",
            "branding",
            "portafolios modernos",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

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

    {
        type: "Estructura1_4",

        nombre: "Layout mosaico",

        category: "mosaic",

        descripcion: `
Layout tipo mosaico con múltiples bloques visuales.
Ideal para galerías modernas y proyectos creativos.
`,

        idealFor: [
            "galerías",
            "branding",
            "showcases",
            "portafolios visuales",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

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

    {
        type: "GrillaDoble",

        nombre: "Grilla doble",

        category: "grid",

        descripcion: `
Layout de dos columnas visuales.
Ideal para comparación de proyectos
o presentación dual.
`,

        idealFor: [
            "comparativas",
            "proyectos duales",
            "galerías",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

        restrictions: [
            "requiere bloque1",
            "requiere bloque2",
        ],

        fields: {

            ...BASE_FIELDS,

            fondo: BLOCK_FIELDS,

            bloque1: BLOCK_FIELDS,

            bloque2: BLOCK_FIELDS,
        },

        example: {

            type: "GrillaDoble",

            data: {

                fondo: {
                    colorFondo: "#111827",
                },

                bloque1: {
                    texto: "Proyecto A",
                    imageUrl:
                        "https://example.com/a.jpg",
                },

                bloque2: {
                    texto: "Proyecto B",
                    imageUrl:
                        "https://example.com/b.jpg",
                },
            },
        },
    },

    {
        type: "GrillaTriple",

        nombre: "Grilla triple",

        category: "grid",

        descripcion: `
Layout de tres columnas visuales.
Ideal para mostrar múltiples proyectos
o galerías organizadas.
`,

        idealFor: [
            "galerías",
            "portafolios",
            "cards visuales",
            "showcases",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

        restrictions: [
            "requiere bloque1",
            "requiere bloque2",
            "requiere bloque3",
        ],

        fields: {

            ...BASE_FIELDS,

            fondo: BLOCK_FIELDS,

            bloque1: BLOCK_FIELDS,

            bloque2: BLOCK_FIELDS,

            bloque3: BLOCK_FIELDS,
        },

        example: {

            type: "GrillaTriple",

            data: {

                fondo: {
                    colorFondo: "#0F172A",
                },

                bloque1: {
                    texto: "Frontend",
                },

                bloque2: {
                    texto: "UI Design",
                    colorFondo: "#7C3AED",
                },

                bloque3: {
                    imageUrl:
                        "https://example.com/project.jpg",
                },
            },
        },
    },

];

module.exports = {
    COMPONENT_REGISTRY,
};

