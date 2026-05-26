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
            "imagen de fondo",
            "Imagenes principales"
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

        restrictions: [
            "solo un bloque principal,donde solo se permite Una unica imagen, una unica frase o un unico color",
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
            " Permite una Imagen principal, adentro que puede incluir texto o frase corta",
            "Imagen principal y color de fondo",
            "Color de fondo y texto",
            "Combinaciones de 3",
            "landing pages",
            "proyectos destacados",
            "Permite un largo hasta de 1920px y un ancho de 550px en las imagenes En el seguno bloque siempre se recomienda que tenga una imagen que sea mas ancha que larga ",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

        restrictions: [
            "requiere bloqueTop",
            "requiere bloqueBottom",
            "No permite mas de 3 imagenes, una como portada,como fondo y otra como elemento principal",
            "No se recominda si la imagen es hacia el largo ",
            "No recomandar si el ancho de la foto es mayor de 1920px y el largo supere 550px"

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
            "Titulo principal o frase corta e imagen principal",
            "Imagen de fondo o color de fondo",
            "Titulo principal o frase corta y color de fondo",
            " Permite dos Imagen principal, adentro puede incluir texto o frase corta",
            "Imagen principal y color de fondo",
            "Combinaciones de 4",
            "landing pages",
            "proyectos destacados",
            "Permite un largo hasta de 1000px y un ancho de 800px en las imagenes "
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
            "No se recomienda si el ancho de la imagen es mayor de 1000px y el largo supere 800px",
            "No puede contener mas de 2 imagenes principales y en total 4 imagenes ",
            "Los dos bloques principales permiten las mismas medidas en ambas columnas, no permite que las medidas sean diferentes"
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
            "Titulo principal o frase corta e imagen principal",
            "Imagen de fondo o color de fondo",
            "Titulo principal o frase corta y color de fondo",
            " Permite tres imagenes principales, adentro puede incluir texto o frase corta",
            "Imagen principal y color de fondo",
            "Combinaciones de 5",
            "landing pages",
            "proyectos destacados",
            "Para la imagen de fondo no puede superar los 1920px de ancho y 600px de largo",
            "Para las imagenes principales no puede superar los 600px de ancho y 600px de largo",

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
            "No puede contener mas de 3 imagenes principales y en total 5 imagenes",
            "No se recominda si el ancho de la imagen es mayor de 700px y el largo supere 700px",

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
            "Titulo principal o frase corta e imagen principal",
            "Imagen de fondo o color de fondo",
            "Titulo principal o frase corta y color de fondo",
            " Permite cuatro imagenes principales, adentro puede incluir texto o frase corta",
            "Imagen principal y color de fondo",
            "Combinaciones de 6",
            "landing pages",
            "proyectos destacados",
            "Para la imagen de fondo no puede superar los 1920px de ancho y 600px de largo",
            "Para las imagenes principales no puede superar los 300px de ancho y 500px de largo",
            "Este solo se recomienda cuando son imagenes verticales y pequeñas, ya que este no permite imagenes horizontales",
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
            "No se recomienda si el ancho de la imagen es mayor de 300px y el largo supere 500px",
            "No puede contener mas de 4 imagenes principales y en total 6 imagenes",
            "No se recomienda si son imagenes horizontales, ya que no permite un buen resultado",
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
            "imagen de fondo o color de fondo",
            "Dos componentes para imagenes, los cuales pueden incluir texto o frase corta o tambien contener un color",
            "Permite en total 3 imagenes, 2 principales y una de fondo",
            "Para la imagen de fondo no puede superar los 1920px de ancho y 600px de largo",
            "Para las imagenes principales no puede superar los 900px de ancho y 600px de largo",
            "Se recomiendan para imagenes horizontales para obtener un mejor resultado",
        ],

        allows: [
            "texto",
            "imagen",
            "color",
        ],

        restrictions: [
            "requiere bloque1",
            "requiere bloque2",
            "No puede contener mas de 3 imagenes, 2 principales y una de fondo",
            "No se recomienda si el ancho de la imagen es mayor de 900px y el largo supere 600px",
            "No se recomienda si son imagenes verticales, ya que no permite un buen resultado"
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
            "imagen de fondo o color de fondo",
            "Tres componentes para imagenes, los cuales pueden incluir texto o frase corta o tambien contener un color",
            "Permite en total 4 imagenes, 3 principales y una de fondo",
            "Para la imagen de fondo no puede superar los 1920px de ancho y 600px de largo",
            "Para las imagenes principales no puede superar los 700px de ancho y 500px de largo",
            "Se recomiendan para imagenes horizontales para obtener un mejor resultado",
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
            "No puede contener mas de 4 imagenes, 3 principales y una de fondo",
            "No se recomienda si el ancho de la imagen es mayor de 700px y el largo supere 500px",
            "No se recomienda si son imagenes verticales, ya que no permite un buen resultado"
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

