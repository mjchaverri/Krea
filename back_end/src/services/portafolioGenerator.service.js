const {
    buildComponentSelectorPrompt,
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
    async (message) => {

        try {

            const prompt =
                buildComponentSelectorPrompt(
                    message
                );

            const rawResponse =
                await generateResponse(
                    prompt
                );

            console.log(
                "RAW IA RESPONSE:",
                rawResponse
            );

            const parsed =
                extractJSON(rawResponse);

            /*
            |--------------------------------------------------------------------------
            | VALIDAR ESTRUCTURA
            |--------------------------------------------------------------------------
            */

            if (
                !parsed ||
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