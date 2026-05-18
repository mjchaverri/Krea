import { useState, useEffect, useRef } from "react";
import UploadImage from "./SubirImagen";
import "../../styles/PlantillaTalentos/BarraHerramientas.css";

function BarraHerramientas({ activeElement, onDeshacer, onRehacer, puedeDeshacer, puedeRehacer }) {
    const [showTextOptions, setShowTextOptions] = useState(false);

    // Espejo local de valores para que la UI se actualice correctamente
    const [localBold, setLocalBold] = useState(false);
    const [localItalic, setLocalItalic] = useState(false);
    const [localAlign, setLocalAlign] = useState("left");
    const [localTextPosition, setLocalTextPosition] = useState("center");
    const [localColorTexto, setLocalColorTexto] = useState("#1a202c");
    const [localImageUrl, setLocalImageUrl] = useState("");
    const [localTexto, setLocalTexto] = useState("");

    const uploadId = useRef(`barra-upload-${Date.now()}`).current;

    // Resetear estado local cuando cambia el elemento activo
    useEffect(() => {
        if (activeElement) {
            setLocalBold(activeElement.bold || false);
            setLocalItalic(activeElement.italic || false);
            setLocalAlign(activeElement.align || "left");
            setLocalTextPosition(activeElement.textPosition || "center");
            setLocalColorTexto(activeElement.colorTexto || "#1a202c");
            setLocalImageUrl(activeElement.imageUrl || "");
            const textoInicial = activeElement.texto || "";
            setLocalTexto(textoInicial);
            // Muestra opciones de texto si ya hay texto escrito
            setShowTextOptions(activeElement.tipo === "bloque" && textoInicial.trim().length > 0);

            // Registra setter en el objeto activo para recibir cambios en tiempo real
            if (activeElement.tipo === "bloque") {
                activeElement._onTextoChange = (nuevoTexto) => {
                    setLocalTexto(nuevoTexto);
                    if (!nuevoTexto.trim()) setShowTextOptions(false);
                };
            }
        }
    }, [activeElement?.bloqueId ?? activeElement?.id]);

    if (!activeElement) {
        return (
            <div className="barra-herramientas">
                <button className="barra-btn" title="Deshacer" onClick={onDeshacer} disabled={!puedeDeshacer}>
                    <i className="fa-solid fa-rotate-left"></i>
                </button>
                <button className="barra-btn" title="Rehacer" onClick={onRehacer} disabled={!puedeRehacer}>
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
                <span className="barra-hint">Selecciona un elemento para editarlo</span>
            </div>
        );
    }

    const handleSetImageUrl = (url) => {
        setLocalImageUrl(url);
        activeElement.setImageUrl?.(url);
    };

    const handleQuitarImagen = () => {
        setLocalImageUrl("");
        activeElement.setImageUrl?.("");
    };

    const handleToggleBold = () => {
        const next = !localBold;
        setLocalBold(next);
        activeElement.toggleBold?.();
    };

    const handleToggleItalic = () => {
        const next = !localItalic;
        setLocalItalic(next);
        activeElement.toggleItalic?.();
    };

    const handleSetAlign = (align) => {
        setLocalAlign(align);
        activeElement.setAlign?.(align);
    };

    const handleSetTextPosition = (pos) => {
        setLocalTextPosition(pos);
        activeElement.setTextPosition?.(pos);
    };

    const handleAgregarTexto = () => {
        setShowTextOptions(true);
        activeElement.focusTexto?.();
    };

    return (
        <div className="barra-herramientas">
            {/* Siempre visibles: deshacer / rehacer */}
            <button className="barra-btn" title="Deshacer" onClick={onDeshacer} disabled={!puedeDeshacer}>
                <i className="fa-solid fa-rotate-left"></i>
            </button>
            <button className="barra-btn" title="Rehacer" onClick={onRehacer} disabled={!puedeRehacer}>
                <i className="fa-solid fa-rotate-right"></i>
            </button>

            <div className="barra-divider" />

            {/* Color de fondo */}
            <label className="barra-btn barra-btn--labeled barra-color-wrap" title="Color de fondo">
                <input
                    type="color"
                    className="barra-color-input"
                    onChange={(e) => activeElement.setColorFondo?.(e.target.value)}
                />
                <i className="fa-solid fa-palette"></i>
                <span className="barra-label">Fondo</span>
            </label>

            {/* Imagen de fondo */}
            <label className="barra-btn barra-btn--labeled" htmlFor={uploadId} title="Imagen de fondo">
                <UploadImage setImageUrl={handleSetImageUrl} id={uploadId} />
                <i className="fa-solid fa-image"></i>
                <span className="barra-label">Imagen</span>
            </label>

            {/* Quitar imagen */}
            {localImageUrl && (
                <button className="barra-btn barra-btn--danger" title="Quitar imagen" onClick={handleQuitarImagen}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            )}

            {/* Solo para bloques */}
            {activeElement.tipo === "bloque" && (
                <>
                    <div className="barra-divider" />

                    {!showTextOptions ? (
                        <button className="barra-btn barra-btn--text" onClick={handleAgregarTexto} title="Agregar texto">
                            <i className="fa-solid fa-t"></i>
                            <span className="barra-label">Agregar texto</span>
                        </button>
                    ) : (
                        <>
                            {/* Color de texto */}
                            <label className="barra-btn barra-btn--labeled barra-color-wrap" title="Color de texto">
                                <input
                                    type="color"
                                    className="barra-color-input"
                                    value={localColorTexto}
                                    onChange={(e) => {
                                        setLocalColorTexto(e.target.value);
                                        activeElement.setColorTexto?.(e.target.value);
                                    }}
                                />
                                <i className="fa-solid fa-font" style={{ color: localColorTexto }}></i>
                                <span className="barra-label">Color texto</span>
                            </label>

                            {/* Negrita */}
                            <button
                                className={`barra-btn ${localBold ? "barra-btn--active" : ""}`}
                                title="Negrita"
                                onClick={handleToggleBold}
                            >
                                <i className="fa-solid fa-bold"></i>
                            </button>

                            {/* Cursiva */}
                            <button
                                className={`barra-btn ${localItalic ? "barra-btn--active" : ""}`}
                                title="Cursiva"
                                onClick={handleToggleItalic}
                            >
                                <i className="fa-solid fa-italic"></i>
                            </button>

                            <div className="barra-divider" />

                            {/* Alineación */}
                            <button className={`barra-btn ${localAlign === "left" ? "barra-btn--active" : ""}`} title="Izquierda" onClick={() => handleSetAlign("left")}>
                                <i className="fa-solid fa-align-left"></i>
                            </button>
                            <button className={`barra-btn ${localAlign === "center" ? "barra-btn--active" : ""}`} title="Centro" onClick={() => handleSetAlign("center")}>
                                <i className="fa-solid fa-align-center"></i>
                            </button>
                            <button className={`barra-btn ${localAlign === "right" ? "barra-btn--active" : ""}`} title="Derecha" onClick={() => handleSetAlign("right")}>
                                <i className="fa-solid fa-align-right"></i>
                            </button>

                            <div className="barra-divider" />

                            {/* Posición vertical del texto */}
                            <button className={`barra-btn ${localTextPosition === "top" ? "barra-btn--active" : ""}`} title="Texto arriba" onClick={() => handleSetTextPosition("top")}>
                                <i className="fa-solid fa-arrow-up-long"></i>
                            </button>
                            <button className={`barra-btn ${localTextPosition === "center" ? "barra-btn--active" : ""}`} title="Texto al centro" onClick={() => handleSetTextPosition("center")}>
                                <i className="fa-solid fa-grip-lines"></i>
                            </button>
                            <button className={`barra-btn ${localTextPosition === "bottom" ? "barra-btn--active" : ""}`} title="Texto abajo" onClick={() => handleSetTextPosition("bottom")}>
                                <i className="fa-solid fa-arrow-down-long"></i>
                            </button>

                            {/* Cerrar panel de texto */}
                            <button className="barra-btn barra-btn--danger" title="Cerrar texto" onClick={() => setShowTextOptions(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default BarraHerramientas;
