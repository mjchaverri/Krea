const {
    buildComponentSelectorPrompt,
} = require("../prompts/componentSelector.prompt");

const {
    generateResponse,
} = require("./ai.service");

const extractJSON = (text) => {
    try {
        if (!text || typeof text !== "string") {
            throw new Error("Respuesta vacía o inválida");
        }

        // 🧼 1. Eliminar caracteres invisibles y de control
        let cleanText = text
            .replace(/^\uFEFF/, "") // BOM
            .replace(/[\u0000-\u001F\u007F]/g, "") // control chars
            .trim();

        // 🧠 2. Intento directo
        try {
            return JSON.parse(cleanText);
        } catch (_) {
            // seguimos
        }

        // 🔍 3. Extraer JSON real
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No JSON encontrado");
        }

        let jsonString = jsonMatch[0];

        // 🛠 4. Arreglos comunes de IA
        jsonString = jsonString
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]")
            .replace(/\n/g, "")
            .replace(/\r/g, "");

        // 🧠 5. Segundo intento seguro
        const parsed = JSON.parse(jsonString);

        // ✅ 6. Validación
        if (
            typeof parsed !== "object" ||
            !parsed.message ||
            !parsed.data ||
            !Array.isArray(parsed.data.componentesSeleccionados)
        ) {
            throw new Error("Estructura JSON inválida");
        }

        return parsed;

    } catch (error) {
        console.error("❌ JSON EXTRACT ERROR:", error.message);

        console.error("🧾 RAW STRING LENGTH:", text.length);
        console.error("🧾 RAW CHAR CODES:",
            [...text].slice(0, 20).map(c => c.charCodeAt(0))
        );

        console.error("🧾 RAW RESPONSE:", text);

        throw new Error("Error procesando JSON IA");
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

            // 🔍 VALIDACIÓN DE COMPONENTES (extra importante)
            if (parsed?.data?.componentesSeleccionados) {

                const {
                    COMPONENT_REGISTRY,
                } = require("../context/componentRegistry");

                const validTypes =
                    COMPONENT_REGISTRY.map(
                        c => c.type
                    );

                parsed.data.componentesSeleccionados =
                    parsed.data.componentesSeleccionados.filter(
                        comp =>
                            validTypes.includes(
                                comp.type
                            )
                    );
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

module.exports = {
    selectPortfolioComponents,
};