import { useState, useEffect, useRef } from "react";
import UploadImage from "./SubirImagen";
import "../../styles/PlantillaTalentos/BarraHerramientas.css";

function BarraHerramientas({ activeElement, onDeshacer, onRehacer, puedeDeshacer, puedeRehacer, vista = "completa" }) {
    const [showTextOptions, setShowTextOptions] = useState(false);

    // Espejo local de valores para que la UI se actualice correctamente
    const [localBold, setLocalBold] = useState(false);
    const [localItalic, setLocalItalic] = useState(false);
    const [localAlign, setLocalAlign] = useState("left");
    const [localTextPosition, setLocalTextPosition] = useState("center");
    const [localColorTexto, setLocalColorTexto] = useState("#1a202c");
    const [localImageUrl, setLocalImageUrl] = useState("");
    const [localColorFondo, setLocalColorFondo] = useState("");
    const [localTexto, setLocalTexto] = useState("");
    const [localFontSize, setLocalFontSize] = useState("16px");
    const [localFontFamily, setLocalFontFamily] = useState("sans-serif");

    const uploadId = useRef(`barra-upload-${Date.now()}`).current;
    const [mostrarTamanos, setMostrarTamanos] = useState(false);
    const tamanoRef = useRef(null);
    const TAMANOS = ["12px","14px","16px","18px","20px","24px","28px","32px","40px","48px"];

    // Cierra el desplegable de tamaños al hacer clic afuera
    useEffect(() => {
        if (!mostrarTamanos) return;
        const handler = (e) => {
            if (tamanoRef.current && !tamanoRef.current.contains(e.target)) setMostrarTamanos(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mostrarTamanos]);

    // Resetear estado local cuando cambia el elemento activo
    useEffect(() => {
        if (activeElement) {
            setLocalBold(activeElement.bold || false);
            setLocalItalic(activeElement.italic || false);
            setLocalAlign(activeElement.align || "left");
            setLocalTextPosition(activeElement.textPosition || "center");
            setLocalColorTexto(activeElement.colorTexto || "#1a202c");
            setLocalImageUrl(activeElement.imageUrl || "");
            setLocalColorFondo(activeElement.colorFondo || "");
            setLocalFontSize(activeElement.fontSize || "16px");
            setLocalFontFamily(activeElement.fontFamily || "sans-serif");
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
        if (vista === "opciones") {
            return <div className="barra-herramientas barra-herramientas--sheet"><span className="barra-hint">Selecciona un bloque para ver sus opciones</span></div>;
        }
        return (
            <div className="barra-herramientas barra-herramientas--completa">
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

    // ── Sección Imagen: color/imagen de fondo ──
    const seccionImagen = (
        <>
            <label className="barra-btn barra-btn--labeled barra-color-wrap" title="Color de fondo">
                <input
                    type="color"
                    className="barra-color-input"
                    onChange={(e) => {
                        setLocalColorFondo(e.target.value);
                        activeElement.setColorFondo?.(e.target.value);
                    }}
                />
                <i className="fa-solid fa-palette"></i>
                <span className="barra-label">Fondo</span>
            </label>

            {localColorFondo && (
                <button
                    className="barra-btn barra-btn--sincolor"
                    title="Sin color de fondo (transparente)"
                    onClick={() => { setLocalColorFondo(""); activeElement.setColorFondo?.(""); }}
                >
                    <span className="barra-no-color-icon" />
                </button>
            )}

            <label className="barra-btn barra-btn--labeled" htmlFor={uploadId} title="Imagen de fondo">
                <UploadImage setImageUrl={handleSetImageUrl} id={uploadId} />
                <i className="fa-solid fa-image"></i>
                <span className="barra-label">Imagen</span>
            </label>
        </>
    );

    // ── Sección Texto: agregar texto o panel completo de formato ──
    const seccionTexto = activeElement.tipo !== "bloque" ? null : !showTextOptions ? (
        <button className="barra-btn barra-btn--text" onClick={handleAgregarTexto} title="Agregar texto">
            <i className="fa-solid fa-t"></i>
            <span className="barra-label">Agregar texto</span>
        </button>
    ) : (
        <>
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

            <div className="barra-tamano-wrap" ref={tamanoRef}>
                <button
                    type="button"
                    className="barra-select barra-tamano-btn"
                    title="Tamaño de letra"
                    onClick={() => setMostrarTamanos(v => !v)}
                >
                    {localFontSize.replace("px", "")}
                    <i className="fa-solid fa-chevron-up"></i>
                </button>
                {mostrarTamanos && (
                    <div className="barra-tamano-panel">
                        {TAMANOS.map(s => (
                            <button
                                key={s}
                                type="button"
                                className={`barra-tamano-opcion${localFontSize === s ? " activa" : ""}`}
                                onClick={() => {
                                    setLocalFontSize(s);
                                    activeElement.setFontSize?.(s);
                                    setMostrarTamanos(false);
                                }}
                            >
                                {s.replace("px", "")}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                className={`barra-btn barra-btn--font ${localFontFamily === "sans-serif" ? "barra-btn--active" : ""}`}
                title="Sans-serif"
                onClick={() => { setLocalFontFamily("sans-serif"); activeElement.setFontFamily?.("sans-serif"); }}
                style={{ fontFamily: "inherit", fontSize: "13px", fontWeight: 600 }}
            >Aa</button>
            <button
                className={`barra-btn barra-btn--font ${localFontFamily === "serif" ? "barra-btn--active" : ""}`}
                title="Serif"
                onClick={() => { setLocalFontFamily("serif"); activeElement.setFontFamily?.("serif"); }}
                style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontWeight: 600 }}
            >Aa</button>

            <div className="barra-divider" />

            <button
                className={`barra-btn ${localBold ? "barra-btn--active" : ""}`}
                title="Negrita"
                onClick={handleToggleBold}
            >
                <i className="fa-solid fa-bold"></i>
            </button>

            <button
                className={`barra-btn ${localItalic ? "barra-btn--active" : ""}`}
                title="Cursiva"
                onClick={handleToggleItalic}
            >
                <i className="fa-solid fa-italic"></i>
            </button>

            <div className="barra-divider" />

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

            <button className={`barra-btn ${localTextPosition === "top" ? "barra-btn--active" : ""}`} title="Texto arriba" onClick={() => handleSetTextPosition("top")}>
                <i className="fa-solid fa-arrow-up-long"></i>
            </button>
            <button className={`barra-btn ${localTextPosition === "center" ? "barra-btn--active" : ""}`} title="Texto al centro" onClick={() => handleSetTextPosition("center")}>
                <i className="fa-solid fa-grip-lines"></i>
            </button>
            <button className={`barra-btn ${localTextPosition === "bottom" ? "barra-btn--active" : ""}`} title="Texto abajo" onClick={() => handleSetTextPosition("bottom")}>
                <i className="fa-solid fa-arrow-down-long"></i>
            </button>

            <button className="barra-btn barra-btn--danger" title="Cerrar texto" onClick={() => setShowTextOptions(false)}>
                <i className="fa-solid fa-xmark"></i>
            </button>
        </>
    );

    // Hoja "Opciones" de mobile: fondo/imagen + formato de texto juntos.
    if (vista === "opciones") {
        return (
            <div className="barra-herramientas barra-herramientas--sheet">
                {seccionImagen}
                {seccionTexto && (
                    <>
                        <div className="barra-divider" />
                        {seccionTexto}
                    </>
                )}
            </div>
        );
    }

    // Vista completa (escritorio): todo junto, como siempre
    return (
        <div className="barra-herramientas barra-herramientas--completa">
            <button className="barra-btn" title="Deshacer" onClick={onDeshacer} disabled={!puedeDeshacer}>
                <i className="fa-solid fa-rotate-left"></i>
            </button>
            <button className="barra-btn" title="Rehacer" onClick={onRehacer} disabled={!puedeRehacer}>
                <i className="fa-solid fa-rotate-right"></i>
            </button>

            <div className="barra-divider" />

            {seccionImagen}

            {activeElement.tipo === "bloque" && (
                <>
                    <div className="barra-divider" />
                    {seccionTexto}
                </>
            )}
        </div>
    );
}

export default BarraHerramientas;
