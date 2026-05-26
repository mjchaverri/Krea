import { useRef, useEffect, useState } from "react";
import "../../styles/PlantillaTalentos/EditableBlock.css";
import { useImagePan } from "./useImagePan";

const textPositionStyles = {
    top:    { justifyContent: "flex-start" },
    center: { justifyContent: "center" },
    bottom: { justifyContent: "flex-end" },
};

function EditableBlock({ data, update, onActivate, activeElement, className = "" }) {
    const [loadingImage, setLoadingImage] = useState(false);
    const [textModeActive, setTextModeActive] = useState(false);
    const textareaRef = useRef(null);
    const dataRef = useRef(data);
    dataRef.current = data;

    // ID estable único para este bloque (sobrevive re-renders)
    const bloqueId = useRef(crypto.randomUUID()).current;

    useEffect(() => {
        if (data.imageUrl) {
            setLoadingImage(true);
            const img = new Image();
            img.onload = () => setLoadingImage(false);
            img.onerror = () => setLoadingImage(false);
            img.src = data.imageUrl;
        } else {
            setLoadingImage(false);
        }
    }, [data.imageUrl]);

    // Auto-crecer la textarea con el contenido
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [data.texto]);

    // Activa/desactiva modo texto según si este bloque está seleccionado y tiene texto
    useEffect(() => {
        if (activeElement?.bloqueId === bloqueId) {
            if (dataRef.current.texto?.trim()) setTextModeActive(true);
        } else {
            setTextModeActive(false);
        }
    }, [activeElement?.bloqueId]);

    const posStyle = textPositionStyles[data.textPosition || "center"];
    const isActive = activeElement?.bloqueId === bloqueId;

    const pan = useImagePan(
        data.imageUrl,
        data.imagePosition,
        (pos) => update({ imagePosition: pos })
    );

    const buildActivateData = () => ({
        bloqueId,
        tipo: "bloque",
        texto: dataRef.current.texto,
        setColorFondo: (color) => update({ colorFondo: color }),
        setImageUrl: (url) => update({ imageUrl: url }),
        imageUrl: dataRef.current.imageUrl,
        colorFondo: dataRef.current.colorFondo,
        focusTexto: () => {
            setTextModeActive(true);
            setTimeout(() => textareaRef.current?.focus(), 0);
        },
        setColorTexto: (color) => update({ colorTexto: color }),
        toggleBold:    () => update({ bold: !dataRef.current.bold }),
        toggleItalic:  () => update({ italic: !dataRef.current.italic }),
        setAlign:      (align) => update({ align }),
        setTextPosition: (pos) => update({ textPosition: pos }),
        setFontSize:   (size) => update({ fontSize: size }),
        setFontFamily: (family) => update({ fontFamily: family }),
        bold:          dataRef.current.bold,
        italic:        dataRef.current.italic,
        align:         dataRef.current.align,
        colorTexto:    dataRef.current.colorTexto,
        textPosition:  dataRef.current.textPosition,
        fontSize:      dataRef.current.fontSize,
        fontFamily:    dataRef.current.fontFamily,
    });

    return (
        <div
            className={`editable-block ${isActive ? "editable-block--active" : ""} ${className}`}
            style={{
                backgroundColor: data.colorFondo,
                backgroundImage: data.imageUrl && !loadingImage
                    ? `url(${data.imageUrl})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: data.imagePosition || "50% 50%",
                cursor: pan.cursor,
                ...posStyle,
            }}
            onMouseDown={pan.onMouseDown}
            onClick={(e) => {
                if (pan.consumeClick()) return;
                e.stopPropagation();
                onActivate(e, buildActivateData());
            }}
        >
            {loadingImage && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {data.imageUrl && !loadingImage && (
                <button
                    className="bloque-quitar-imagen"
                    onClick={(e) => { e.stopPropagation(); update({ imageUrl: '' }); }}
                    title="Quitar imagen"
                >
                    <i className="fa-solid fa-xmark" />
                </button>
            )}

            <textarea
                ref={textareaRef}
                className={`bloque-texto${textModeActive ? " bloque-texto--editing" : ""}`}
                value={data.texto}
                onChange={(e) => {
                    update({ texto: e.target.value });
                    if (isActive) activeElement?._onTextoChange?.(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    color: data.colorTexto,
                    fontSize: data.fontSize,
                    fontFamily: data.fontFamily === "serif" ? "Georgia, serif" : "inherit",
                    fontWeight: data.bold ? "bold" : "normal",
                    fontStyle: data.italic ? "italic" : "normal",
                    textAlign: data.align,
                }}
            />
        </div>
    );
}

export default EditableBlock;
