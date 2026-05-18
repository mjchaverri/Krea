import { useRef } from "react";
import "../../styles/PlantillaTalentos/Lienzo.css";

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
}) {
    const chipsRef = useRef(null);
    const scroll = (dir) => chipsRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });

    const hayComponentes = Array.isArray(childrenEstructura?.props?.children)
        ? childrenEstructura.props.children.filter(Boolean).length > 0
        : !!childrenEstructura?.props?.children;

    return (
        <div className="lienzo">
            <div className="lienzo__header">
                <input
                    type="text"
                    placeholder="Título del Proyecto"
                    className="lienzo__titulo"
                    value={tituloProyecto}
                    onChange={onTituloChange}
                    onClick={(e) => e.stopPropagation()}
                />
                <input
                    type="text"
                    placeholder="Haz clic aquí para añadir una breve descripción o subtítulo que cautive a tu audiencia."
                    className="lienzo__descripcion"
                    value={descripcionProyecto}
                    onChange={onDescripcionChange}
                    onClick={(e) => e.stopPropagation()}
                />
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

            <div className="lienzo__canvas">
                {hayComponentes ? (
                    childrenEstructura
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
