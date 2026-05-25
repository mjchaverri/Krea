import {MessageCircle, X, Send} from "lucide-react"
import { useEffect, useRef, useState } from "react";

import "../../styles/PlantillaTalentos/ChatBotBubble.css";

function ChatBotBubble() {

    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hola :wave: Soy tu asistente IA del editor.",
        },

        {
            role: "assistant",
            content:
                "Puedo ayudarte con ideas, diseño UX/UI y estructura de tu portafolio.",
        },
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    const handleSendMessage = async () => {

        if (!message.trim() || loading) return;

        const userMessage = {
            role: "user",
            content: message,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        const currentMessage = message;

        setMessage("");

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:3000/api/chatbot/message",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        message: currentMessage,
                    }),
                }
            );

            const data = await response.json();

            if (!data.ok) {
                throw new Error(
                    data.message ||
                    "Error generando respuesta"
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response,
                },
            ]);

        } catch (error) {

            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Ocurrió un error generando la respuesta.",
                },
            ]);

        } finally {

            setLoading(false);

        }
    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {
            handleSendMessage();
        }

    };

    return (
        <>

            {/* CHAT */}

            <div className={`chatbot-window ${open ? "open" : ""}`}>

                {/* HEADER */}

                <div className="chatbot-header">

                    <div>
                        <h4>Asistente IA</h4>
                        <span>En línea</span>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* BODY */}

                <div className="chatbot-body">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className={`chatbot-message ${msg.role === "assistant"
                                    ? "bot"
                                    : "user"
                                }`}
                        >
                            {msg.content}
                        </div>

                    ))}

                    {loading && (

                        <div className="chatbot-message bot">
                            Escribiendo...
                        </div>

                    )}

                    <div ref={messagesEndRef} />

                </div>

                {/* FOOTER */}

                <div className="chatbot-footer">

                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={loading}
                    >
                        <Send size={18} />
                    </button>

                </div>

            </div>

            {/* BURBUJA */}

            <button
                className="chatbot-bubble"
                onClick={() => setOpen(!open)}
            >
                <MessageCircle size={28} />
            </button>

        </>
    );
}

export default ChatBotBubble;