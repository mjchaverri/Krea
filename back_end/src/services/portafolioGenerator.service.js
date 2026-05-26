const {
    buildComponentSelectorPrompt,
} = require("../prompts/componentSelector.prompt");

const {
    generateResponse,
} = require("./ai.service");

const selectPortfolioComponents =
    async (message) => {

        try {

            const prompt =
                buildComponentSelectorPrompt(
                    message
                );

            const response =
                await generateResponse(
                    prompt
                );

            return response;

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