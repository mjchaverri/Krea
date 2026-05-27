import {
    MessageCircle,
    Send,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import "../../styles/PlantillaTalentos/ChatBotBubble.css";

function ChatBotBubble() {

    const [open, setOpen] =
        useState(false);

    const [input, setInput] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [messages, setMessages] =
        useState(() => {

            try {

                const saved =
                    localStorage.getItem(
                        "kreia-chat"
                    );

                if (!saved) {

                    return [
                        {
                            role: "assistant",

                            content:
                                "Hola :wave: Soy KreIA.\nEstoy aquí para ayudarte a construir tu portafolio ideal.",
                        },
                    ];
                }

                const parsed =
                    JSON.parse(saved);

                if (!Array.isArray(parsed)) {

                    return [
                        {
                            role: "assistant",

                            content:
                                "Hola :wave: Soy KreIA.\nEstoy aquí para ayudarte a construir tu portafolio ideal.",
                        },
                    ];
                }

                return parsed;

            } catch (error) {

                console.error(
                    "LOCAL STORAGE CHAT ERROR:",
                    error
                );

                return [
                    {
                        role: "assistant",

                        content:
                            "Hola :wave: Soy KreIA.\nEstoy aquí para ayudarte a construir tu portafolio ideal.",
                    },
                ];
            }
        });

    // =====================================
    // PERSISTIR CHAT
    // =====================================

    useEffect(() => {

        localStorage.setItem(
            "kreia-chat",
            JSON.stringify(messages)
        );

    }, [messages]);

    // =====================================
    // ENVIAR MENSAJE
    // =====================================

    const sendMessage = async () => {

        if (!input.trim()) return;

        const userMessage = {
            role: "user",
            content: input,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        const currentInput = input;

        setInput("");

        try {

            setLoading(true);

            const response =
                await fetch(
                    "http://localhost:3000/api/chatbot",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            message:
                                currentInput,
                        }),
                    }
                );

            const data =
                await response.json();

            console.log(
                "CHATBOT RESPONSE:",
                data
            );

            // =====================================
            // VALIDACIÓN BACKEND
            // =====================================

            if (!data.ok) {

                throw new Error(
                    data.message ||
                    "Error del servidor"
                );
            }

            // =====================================
            // NUEVA ESTRUCTURA
            // =====================================

            const components =
                data.components || {};

            const portfolio =
                data.portfolio || [];

            // =====================================
            // GUARDAR PORTFOLIO
            // =====================================

            localStorage.setItem(
                "kreia-portfolio",
                JSON.stringify(portfolio)
            );

            // =====================================
            // PREVIEW EN TIEMPO REAL
            // =====================================

            window.dispatchEvent(
                new CustomEvent(
                    "kreia-preview",
                    {
                        detail: portfolio,
                    }
                )
            );

            // =====================================
            // MENSAJE IA
            // =====================================

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",

                    content:
                        components.message ||
                        "Portafolio generado correctamente.",
                },
            ]);

        } catch (error) {

            console.error(
                "CHATBOT FRONT ERROR:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",

                    content:
                        "Ocurrió un error al generar el portafolio.",
                },
            ]);

        } finally {

            setLoading(false);
        }
    };

    return (
        <>

            {/* ============================== */}
            {/* CHAT WINDOW */}
            {/* ============================== */}

            <div
                className={`chatbot-window ${open ? "open" : ""
                    }`}
            >

                {/* HEADER */}

                <div className="chatbot-header">

                    <div>

                        <h4>KreIA</h4>

                        <span>
                            Asistente IA
                        </span>

                    </div>

                    <button
                        onClick={() =>
                            setOpen(false)
                        }
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* BODY */}

                <div className="chatbot-body">

                    {messages.map(
                        (msg, index) => (

                            <div
                                key={index}

                                className={`chatbot-message ${msg.role ===
                                        "assistant"
                                        ? "bot"
                                        : "user"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        )
                    )}

                    {loading && (

                        <div className="chatbot-message bot">
                            KreIA está generando tu portafolio...
                        </div>
                    )}

                </div>

                {/* FOOTER */}

                <div className="chatbot-footer">

                    <input
                        type="text"

                        placeholder="Describe tu portafolio..."

                        value={input}

                        onChange={(e) =>
                            setInput(
                                e.target.value
                            )
                        }

                        onKeyDown={(e) => {

                            if (
                                e.key === "Enter"
                            ) {

                                sendMessage();
                            }
                        }}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading}
                    >
                        <Send size={18} />
                    </button>

                </div>
            </div>

            {/* ============================== */}
            {/* BURBUJA */}
            {/* ============================== */}

            <button
                className="chatbot-bubble"

                onClick={() =>
                    setOpen(!open)
                }
            >
                <MessageCircle size={28} />
            </button>
        </>
    );
}

export default ChatBotBubble;