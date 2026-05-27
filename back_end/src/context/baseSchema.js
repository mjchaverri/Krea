const BASE_SCHEMA = {

    texto: "string",

    colorTexto: "hex-color",

    colorFondo: "hex-color",

    imageUrl: "url",

    fontSize: "css-size",

    bold: "boolean",

    italic: "boolean",

    align: [
        "left",
        "center",
        "right",
    ],

    textPosition: [
        "top",
        "center",
        "bottom",
    ],

    fontFamily: [
        "serif",
        "sans-serif",
        "monospace",
    ],
};

module.exports = {
    BASE_SCHEMA,
};