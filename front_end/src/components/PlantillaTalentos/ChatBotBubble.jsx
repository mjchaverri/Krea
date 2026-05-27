import {
    MessageCircle,
    Send,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import "../../styles/PlantillaTalentos/ChatBotBubble.css";

const WELCOME_MESSAGE = {
    role: "assistant",
    content: "Hola 👋 Soy KreIA.\nEstoy aquí para ayudarte a construir tu portafolio ideal.\n\n¿Cuál es tu profesión o qué tipo de trabajo quieres mostrar?",
};

const DEFAULT_PREVIEW = {
    bg: "#1E293B", bg2: "#0F172A", text: "#FFFFFF",
    accent: "#0EA5E9", font: "Inter, sans-serif",
};

const coloresToPreview = (colores) => {
    if (!colores) return DEFAULT_PREVIEW;
    return {
        bg:     colores.fondo     || DEFAULT_PREVIEW.bg,
        bg2:    colores.fondo2    || DEFAULT_PREVIEW.bg2,
        text:   colores.texto     || DEFAULT_PREVIEW.text,
        accent: colores.acento    || DEFAULT_PREVIEW.accent,
        font:   colores.tipografia || DEFAULT_PREVIEW.font,
    };
};

function ChatBotBubble({ portfolioId }) {

    const storageKey = portfolioId ? `kreia-chat-${portfolioId}` : null;

    const [open, setOpen]             = useState(false);
    const [input, setInput]           = useState("");
    const [loading, setLoading]       = useState(false);
    const [opcionesActuales, setOpcionesActuales] = useState([]);
    const [confirmado, setConfirmado] = useState(false);
    const bodyRef = useRef(null);

    const [messages, setMessages] = useState(() => {
        if (!storageKey) return [WELCOME_MESSAGE];
        try {
            const saved = localStorage.getItem(storageKey);
            if (!saved) return [WELCOME_MESSAGE];
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [WELCOME_MESSAGE];
        } catch {
            return [WELCOME_MESSAGE];
        }
    });

    useEffect(() => {
        if (!storageKey) return;
        localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages, storageKey]);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // =====================================
    // HELPERS
    // =====================================

    // Índice del ÚLTIMO mensaje que tiene opciones o confirmación
    // Solo ese puede tener botones activos
    const lastInteractiveIndex = messages.reduce(
        (last, msg, i) => (msg.opciones?.length > 0 || msg.esConfirmacion ? i : last),
        -1
    );

    const buildHistorial = (msgs) =>
        msgs
            .filter(m => !m._isAction)
            .slice(1)
            .slice(-6)
            .map(({ role, content }) => ({ role, content }));

    const applyPortfolio = (portfolio) => {
        if (!portfolio?.length) return;
        if (storageKey) {
            localStorage.setItem(storageKey + "-portfolio", JSON.stringify(portfolio));
        }
        window.dispatchEvent(new CustomEvent("kreia-preview", { detail: portfolio }));
    };

    // =====================================
    // ENVIAR MENSAJE DE TEXTO
    // =====================================

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: "user", content: input };
        const currentInput = input;
        setInput("");
        setMessages(prev => [...prev, userMsg]);
        // historial = mensajes PREVIOS al actual (sin incluir el mensaje que se envía ahora)
        await callBackend({
            message: currentInput,
            historial: buildHistorial(messages),
        });
    };

    // =====================================
    // ELEGIR OPCIÓN DE ESTILO (clic en tarjeta)
    // =====================================

    const elegirOpcion = async (opcion) => {
        if (loading || confirmado) return;
        await callBackend({
            message: `elegir:${opcion.nombre || "estilo"}`,
            historial: buildHistorial(messages),
            opcionSeleccionada: opcion,
        });
    };

    // =====================================
    // CONFIRMAR ESTILO ACTUAL
    // =====================================

    const confirmar = async () => {
        if (loading || confirmado) return;
        setConfirmado(true);
        // Marcar todos los interactivos como expirados
        setMessages(prev => prev.map(m =>
            m.opciones || m.esConfirmacion ? { ...m, _expirado: true } : m
        ));
        await callBackend({
            message: "confirmar",
            historial: buildHistorial(messages),
        });
    };

    // =====================================
    // PROBAR OTRO ESTILO
    // =====================================

    const probarOtro = () => {
        if (loading || opcionesActuales.length === 0) return;
        // Expirar el mensaje de confirmación actual
        setMessages(prev => [
            ...prev.map(m => m.esConfirmacion ? { ...m, _expirado: true } : m),
            {
                role: "assistant",
                content: "¿Cuál de estos estilos quieres probar ahora?",
                opciones: opcionesActuales,
            },
        ]);
    };

    // =====================================
    // LLAMADA AL BACKEND (unificada)
    // =====================================

    const callBackend = async ({ message, historial, opcionSeleccionada }) => {
        try {
            setLoading(true);
            const body = { message, historial };
            if (opcionSeleccionada) body.opcionSeleccionada = opcionSeleccionada;

            const response = await fetch("http://localhost:3000/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (!data.ok) throw new Error(data.message || "Error del servidor");

            const portfolio = data.portfolio || [];
            if (portfolio.length > 0) applyPortfolio(portfolio);

            if (data.opciones?.length > 0) {
                setOpcionesActuales(data.opciones);
            }

            const botMsg = {
                role: "assistant",
                content: data.message || "Portafolio generado.",
            };
            if (data.opciones?.length > 0)           botMsg.opciones = data.opciones;
            if (data.esPreview && portfolio.length > 0) botMsg.esConfirmacion = true;

            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("CHATBOT FRONT ERROR:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Ocurrió un error. Por favor intenta de nuevo.",
            }]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // RENDER
    // =====================================

    return (
        <>
            <div className={`chatbot-window ${open ? "open" : ""}`}>

                {/* HEADER */}
                <div className="chatbot-header">
                    <div>
                        <h4>KreIA</h4>
                        <span>Asistente IA</span>
                    </div>
                    <button onClick={() => setOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                {/* BODY */}
                <div className="chatbot-body" ref={bodyRef}>
                    {messages.map((msg, index) => {

                        // Este mensaje es el único que puede tener botones activos
                        const isActive = index === lastInteractiveIndex && !msg._expirado && !confirmado;

                        return (
                            <div key={index} className="chatbot-message-group">

                                {/* Burbuja de texto (ocultar mensajes de acción interna) */}
                                {!msg._isAction && (
                                    <div className={`chatbot-message ${msg.role === "assistant" ? "bot" : "user"}`}>
                                        {msg.content}
                                    </div>
                                )}

                                {/* Burbujas de previsualización de paleta */}
                                {msg.opciones?.length > 0 && (
                                    <div className={`chatbot-paletas${isActive ? "" : " expired"}`}>
                                        {msg.opciones.map((opcion, i) => {
                                            const p = coloresToPreview(opcion.colores);
                                            return (
                                                <div
                                                    key={i}
                                                    className="chatbot-paleta"
                                                    style={{ background: p.bg, color: p.text }}
                                                >
                                                    {/* Franja superior con colores de la paleta */}
                                                    <div className="chatbot-paleta-swatches">
                                                        <span style={{ background: p.bg2 }} />
                                                        <span style={{ background: p.accent }} />
                                                        <span style={{ background: p.text, opacity: 0.9 }} />
                                                    </div>

                                                    {/* Nombre y tipografía */}
                                                    <div className="chatbot-paleta-header">
                                                        <strong style={{ fontFamily: p.font }}>{opcion.nombre}</strong>
                                                        <span className="chatbot-paleta-font" style={{ color: p.accent }}>
                                                            {p.font}
                                                        </span>
                                                    </div>

                                                    {/* Descripción */}
                                                    <p className="chatbot-paleta-desc" style={{ color: p.text }}>
                                                        {opcion.descripcion}
                                                    </p>

                                                    {/* Botón de selección */}
                                                    <button
                                                        className="chatbot-paleta-btn"
                                                        style={{ background: p.accent, color: p.bg }}
                                                        onClick={() => isActive && elegirOpcion(opcion)}
                                                        disabled={!isActive || loading}
                                                    >
                                                        Elegir este estilo
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Botones de confirmación */}
                                {msg.esConfirmacion && !msg._expirado && (
                                    <div className={`chatbot-confirmacion${isActive ? "" : " expired"}`}>
                                        <button
                                            className="chatbot-btn-confirm"
                                            onClick={confirmar}
                                            disabled={!isActive || loading}
                                        >
                                            ✓ Quedarse con este
                                        </button>
                                        <button
                                            className="chatbot-btn-otro"
                                            onClick={probarOtro}
                                            disabled={!isActive || loading || opcionesActuales.length === 0}
                                        >
                                            ↺ Probar otro
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="chatbot-message-group">
                            <div className="chatbot-message bot chatbot-typing">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="chatbot-footer">
                    <input
                        type="text"
                        placeholder="Describe tu portafolio..."
                        value={input}
                        disabled={loading}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                    />
                    <button onClick={sendMessage} disabled={loading || !input.trim()}>
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* BURBUJA */}
            <button className="chatbot-bubble" onClick={() => setOpen(!open)}>
                <MessageCircle size={28} />
            </button>
        </>
    );
}

export default ChatBotBubble;
