import "../../styles/PlantillaTalentos/Estructura1.css";
import "../../styles/PlantillaTalentos/EditableBlock.css";
import { useEditable } from "./useEditable";
import { useState, useEffect, useRef } from "react";

const textPositionStyles = {
    top:    { justifyContent: "flex-start" },
    center: { justifyContent: "center" },
    bottom: { justifyContent: "flex-end" },
};

function Estructura1({ onActivate, activeElement, initialData, onUpdate }) {
    const fondo = useEditable(initialData, onUpdate);
    const fondoRef = useRef(fondo.state);
    fondoRef.current = fondo.state;

    const textareaRef = useRef(null);
    const bloqueId = useRef(crypto.randomUUID()).current;
    const [textModeActive, setTextModeActive] = useState(false);
    const [loadingFondo, setLoadingFondo] = useState(false);
    const [loadingChild, setLoadingChild] = useState(false);

    useEffect(() => {
        if (fondo.state.imageUrl) {
            setLoadingFondo(true);
            const img = new Image();
            img.onload = () => setLoadingFondo(false);
            img.onerror = () => setLoadingFondo(false);
            img.src = fondo.state.imageUrl;
        } else {
            setLoadingFondo(false);
        }
    }, [fondo.state.imageUrl]);

    useEffect(() => {
        if (fondo.state.childImageUrl) {
            setLoadingChild(true);
            const img = new Image();
            img.onload = () => setLoadingChild(false);
            img.onerror = () => setLoadingChild(false);
            img.src = fondo.state.childImageUrl;
        } else {
            setLoadingChild(false);
        }
    }, [fondo.state.childImageUrl]);

    // Auto-crecer la textarea con el contenido
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [fondo.state.texto]);

    // Activa/desactiva modo texto según si este bloque está seleccionado y tiene texto
    useEffect(() => {
        if (activeElement?.bloqueId === bloqueId) {
            if (fondoRef.current.texto?.trim()) setTextModeActive(true);
        } else {
            setTextModeActive(false);
        }
    }, [activeElement?.bloqueId]);

    const isActive = activeElement?.bloqueId === bloqueId;

    return (
        <div
            className="est1"
            style={{
                backgroundColor: fondo.state.colorFondo,
                backgroundImage: fondo.state.imageUrl && !loadingFondo
                    ? `url(${fondo.state.imageUrl})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            onClick={(e) => {
                e.stopPropagation();
                onActivate(e, {
                    tipo: "fondo",
                    setColorFondo: (color) => fondo.update({ colorFondo: color }),
                    setImageUrl: (url) => fondo.update({ imageUrl: url }),
                    imageUrl: fondoRef.current.imageUrl,
                });
            }}
        >
            {loadingFondo && (
                <div className="loading-overlay-fondo">
                    <div className="spinner"></div>
                </div>
            )}

            {/* Bloque interior — mismo patrón que EditableBlock */}
            <div
                className={`editable-block est1__child${isActive ? " editable-block--active" : ""}`}
                style={{
                    backgroundColor: fondo.state.childColorFondo,
                    backgroundImage: fondo.state.childImageUrl && !loadingChild
                        ? `url(${fondo.state.childImageUrl})`
                        : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    ...(textPositionStyles[fondo.state.textPosition || "center"]),
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onActivate(e, {
                        bloqueId,
                        tipo: "bloque",
                        texto: fondoRef.current.texto,
                        setColorFondo: (color) => fondo.update({ childColorFondo: color }),
                        setImageUrl: (url) => fondo.update({ childImageUrl: url }),
                        imageUrl: fondoRef.current.childImageUrl,
                        focusTexto: () => {
                            setTextModeActive(true);
                            setTimeout(() => textareaRef.current?.focus(), 0);
                        },
                        setColorTexto: (color) => fondo.update({ colorTexto: color }),
                        toggleBold:    () => fondo.update({ bold: !fondoRef.current.bold }),
                        toggleItalic:  () => fondo.update({ italic: !fondoRef.current.italic }),
                        setAlign:      (align) => fondo.update({ align }),
                        setTextPosition: (pos) => fondo.update({ textPosition: pos }),
                        bold:         fondoRef.current.bold,
                        italic:       fondoRef.current.italic,
                        align:        fondoRef.current.align,
                        colorTexto:   fondoRef.current.colorTexto,
                        textPosition: fondoRef.current.textPosition,
                    });
                }}
            >
                {loadingChild && (
                    <div className="loading-overlay-child">
                        <div className="spinner"></div>
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    className={`bloque-texto${textModeActive ? " bloque-texto--editing" : ""}`}
                    value={fondo.state.texto}
                    onChange={(e) => {
                        fondo.update({ texto: e.target.value });
                        if (isActive) activeElement?._onTextoChange?.(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        color: fondo.state.colorTexto,
                        fontWeight: fondo.state.bold ? "bold" : "normal",
                        fontStyle: fondo.state.italic ? "italic" : "normal",
                        textAlign: fondo.state.align || "center",
                        fontSize: "1.6rem",
                    }}
                />
            </div>
        </div>
    );
}

export default Estructura1;
