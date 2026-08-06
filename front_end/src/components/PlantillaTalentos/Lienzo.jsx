import { useRef, useState, useLayoutEffect } from "react";
import "../../styles/PlantillaTalentos/Lienzo.css";

const CANVAS_WIDTH = 860;
const MOBILE_BREAKPOINT = 900;

const CATEGORIAS = [
    "Diseño y creatividad visual",
    "UX/UI",
    "Desarrollo y tecnología creativa",
    "Multimedia y animación",
    "Fotografía y arte visual",
    "Publicidad y marketing",
    "Arquitectura",
    "Diseño de interiores",
    "Diseño industrial",
    "Educación",
    "Escritura y contenido",
    "Manualidades y arte hecho a mano",
    "Moda y costura",
    "Música y producción sonora",
    "Ilustración",
    "Modelado 3D",
];

function Lienzo({
    childrenEstructura,
    tituloProyecto,
    descripcionProyecto,
    categorias,
    onTituloChange,
    onDescripcionChange,
    onCategoriasChange,
    escalarMobile = false,
}) {
    const chipsRef = useRef(null);
    const canvasOuterRef = useRef(null);
    const canvasInnerRef = useRef(null);
    // null = no escalar (escritorio); número = factor de escala en mobile
    const [scale, setScale] = useState(null);
    const scroll = (dir) => chipsRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });

    const hayComponentes = Array.isArray(childrenEstructura?.props?.children)
        ? childrenEstructura.props.children.filter(Boolean).length > 0
        : !!childrenEstructura?.props?.children;

    // Escala el canvas completo como una sola unidad (estilo Canva en celular),
    // para que las plantillas mantengan exactamente las mismas proporciones
    // que en escritorio en vez de reflowear con sus alturas fijas y verse
    // distorsionadas al angostarse. Solo aplica en la instancia interactiva
    // del editor (escalarMobile=true); la captura de PDF y los modales de
    // vista previa siguen renderizando igual que siempre.
    useLayoutEffect(() => {
        if (!escalarMobile) return;
        const outer = canvasOuterRef.current;
        if (!outer) return;

        const aplicarEscala = () => {
            const esMobile = window.innerWidth <= MOBILE_BREAKPOINT;
            if (!esMobile) { setScale(null); return; }
            const outerW = outer.offsetWidth;
            if (outerW) setScale(outerW / CANVAS_WIDTH);
        };

        aplicarEscala();
        const ro = new ResizeObserver(aplicarEscala);
        ro.observe(outer);
        window.addEventListener("resize", aplicarEscala);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", aplicarEscala);
        };
    }, [escalarMobile]);

    useLayoutEffect(() => {
        if (!escalarMobile) return;
        const outer = canvasOuterRef.current;
        if (!outer) return;
        if (scale === null) { outer.style.height = ""; return; }
        const inner = canvasInnerRef.current;
        if (!inner) return;
        const innerH = inner.offsetHeight;
        if (innerH > 0) outer.style.height = `${innerH * scale}px`;
    });

    return (
        <div className="lienzo">
            <div className="lienzo__header">
                {onTituloChange ? (
                    <input
                        type="text"
                        placeholder="Título del Proyecto"
                        className="lienzo__titulo"
                        value={tituloProyecto}
                        onChange={onTituloChange}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div className="lienzo__titulo">{tituloProyecto || ''}</div>
                )}
                {onDescripcionChange ? (
                    <input
                        type="text"
                        placeholder="Haz clic aquí para añadir una breve descripción o subtítulo que cautive a tu audiencia."
                        className="lienzo__descripcion"
                        value={descripcionProyecto}
                        onChange={onDescripcionChange}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div className="lienzo__descripcion">{descripcionProyecto || ''}</div>
                )}
                <div className="lienzo__categoria-row" onClick={(e) => e.stopPropagation()}>
                    <span className="lienzo__categoria-label">Categorías</span>
                    <div className="lienzo__categoria-carousel">
                        <button className="lienzo__cat-arrow" type="button" onClick={() => scroll(-1)}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <div className="lienzo__categoria-chips" ref={chipsRef}>
                            {CATEGORIAS.map(cat => {
                                const activa = (categorias || []).includes(cat);
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`lienzo__chip${activa ? " lienzo__chip--active" : ""}`}
                                        onClick={() => {
                                            const nuevas = activa
                                                ? categorias.filter(c => c !== cat)
                                                : [...(categorias || []), cat];
                                            onCategoriasChange(nuevas);
                                        }}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                        <button className="lienzo__cat-arrow" type="button" onClick={() => scroll(1)}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`lienzo__canvas${escalarMobile && scale !== null ? " lienzo__canvas--escalando" : ""}`}
                ref={escalarMobile ? canvasOuterRef : null}
            >
                {hayComponentes ? (
                    escalarMobile && scale !== null ? (
                        <div
                            className="lienzo__canvas-scaler"
                            ref={canvasInnerRef}
                            style={{ transform: `scale(${scale})`, width: CANVAS_WIDTH }}
                        >
                            {childrenEstructura}
                        </div>
                    ) : childrenEstructura
                ) : (
                    <div className="lienzo__empty">
                        <div className="lienzo__empty-icon">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                        <h4 className="lienzo__empty-title">Lienzo en blanco</h4>
                        <p className="lienzo__empty-desc">
                            Selecciona una plantilla del panel izquierdo<br />
                            para empezar a construir tu portafolio.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Lienzo;
