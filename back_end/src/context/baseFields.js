const { FIELD_TYPES } = require("./fieldTypes");
const BASE_FIELDS = {

    texto: {
        type: FIELD_TYPES.STRING,

        description:
            "Texto principal del bloque",
    },

    colorTexto: {
        type: FIELD_TYPES.COLOR,

        description:
            "Color del texto",
    },

    colorFondo: {
        type: FIELD_TYPES.COLOR,

        description:
            "Color de fondo",
    },

    imageUrl: {
        type: FIELD_TYPES.IMAGE,

        description:
            "Imagen principal",
    },

    fontSize: {
        type: FIELD_TYPES.STRING,

        description:
            "Tamaño del texto",
    },

    bold: {
        type: FIELD_TYPES.BOOLEAN,

        description:
            "Texto en negrita",
    },

    italic: {
        type: FIELD_TYPES.BOOLEAN,

        description:
            "Texto en cursiva",
    },

    align: {
        type: FIELD_TYPES.STRING,

        description:
            "Alineación horizontal",
    },

    textPosition: {
        type: FIELD_TYPES.STRING,

        description:
            "Posición vertical del texto",
    },

    childColorFondo: {
        type: FIELD_TYPES.COLOR,

        description:
            "Color de fondo interno",
    },

    childImageUrl: {
        type: FIELD_TYPES.IMAGE,

        description:
            "Imagen secundaria interna",
    },

    fontFamily: {
        type: FIELD_TYPES.STRING,

        description:
            "Tipografía del texto",
    },
};

module.exports = {
    BASE_FIELDS,
};