const {
    buildComponentSelectorPrompt,
} = require("../prompts/componentSelector.prompt");

const {
    generateResponse,
} = require("./ai.service");

const extractJSON = (text) => {

    try {

        const firstBrace =
            text.indexOf("{");

        const lastBrace =
            text.lastIndexOf("}");

        if (
            firstBrace === -1 ||
            lastBrace === -1
        ) {

            throw new Error(
                "No JSON encontrado"
            );
        }

        const jsonString =
            text.slice(
                firstBrace,
                lastBrace + 1
            );

        return JSON.parse(jsonString);

    } catch (error) {

        console.error(
            "JSON EXTRACT ERROR:",
            error
        );

        throw new Error(
            "Error procesando JSON IA"
        );
    }
};

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

            return parsed;

        } catch (error) {

            console.error(
                "PORTFOLIO SELECTOR ERROR:",
                error
            );

            throw new Error(
                "Error seleccionando componentes"
            );
        }
    };

module.exports = {
    selectPortfolioComponents,
};