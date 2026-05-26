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

            const saved =
                localStorage.getItem(
                    "kikia-chat"
                );

            return saved
                ? JSON.parse(saved)
                : [
                    {
                        role: "assistant",

                        content:
                            "Hola :wave: Soy KikIA.\nEstoy aquí para ayudarte a construir tu portafolio ideal.",
                    },
                ];
        });

    useEffect(() => {

        localStorage.setItem(
            "kikia-chat",
            JSON.stringify(messages)
        );

    }, [messages]);

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

            if (!data.ok) {

                throw new Error(
                    data.message
                );
            }

            const aiResponse =
                data.response;

            // GUARDAR JSON ESTRUCTURADO
            localStorage.setItem(
                "kikia-last-response",
                JSON.stringify(
                    aiResponse.data
                )
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",

                    content:
                        aiResponse.message,
                },
            ]);

        } catch (error) {

            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",

                    content:
                        "Ocurrió un error al procesar la solicitud.",
                },
            ]);

        } finally {

            setLoading(false);
        }
    };

    return (
        <>

            <div
                className={`chatbot-window ${
                    open ? "open" : ""
                }`}
            >

                <div className="chatbot-header">

                    <div>

                        <h4>KikIA</h4>

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

                <div className="chatbot-body">

                    {messages.map(
                        (msg, index) => (

                            <div
                                key={index}

                                className={`chatbot-message ${
                                    msg.role ===
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
                            KikIA está pensando...
                        </div>
                    )}

                </div>

                <div className="chatbot-footer">

                    <input
                        type="text"

                        placeholder="Escribe un mensaje..."

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