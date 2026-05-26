const { FIELD_TYPES } = require("./fieldTypes");
const { BASE_FIELDS } = require("./baseFields");
const BLOCK_FIELDS = {

    type: FIELD_TYPES.OBJECT,

    description:
        "Bloque visual reutilizable",

    fields: {
        ...BASE_FIELDS,
    },
};

module.exports = {
    BLOCK_FIELDS,
};