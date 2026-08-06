import "../../styles/EstilosPerfilUsuario/PortafolioCard.css";
import React from "react";
import PreviewComponentes from "../PlantillaTalentos/PreviewComponentes";

const CardProyecto = ({
    nombreProyecto,
    componentes,
    onVerProyecto,
    promedio,
    onDelete,
    onEditar,
    usuario,
    categorias = [],
    vista = 'cuadricula',
}) => {
    const comps = componentes || [];
    const cats  = categorias  || [];

    return (
        <div className={`pf-card ${vista === 'lista' ? 'pf-card--lista' : ''}`} onClick={onVerProyecto}>
            <div className="pf-card-media">
                <PreviewComponentes componentes={comps} />

                <div className="pf-card-overlay">
                    {cats.length > 0 && (
                        <div className="pf-card-cats">
                            {cats.slice(0, 2).map(cat => (
                                <span key={cat} className="pf-cat-tag">{cat}</span>
                            ))}
                            {cats.length > 2 && (
                                <span className="pf-cat-tag">+{cats.length - 2}</span>
                            )}
                        </div>
                    )}
                    <h3 className="pf-card-title">{nombreProyecto}</h3>
                </div>

                {onEditar && (
                    <button
                        className="pf-card-edit"
                        onClick={e => { e.stopPropagation(); onEditar(); }}
                        title="Editar portafolio"
                    >
                        <i className="fa-solid fa-pen" />
                    </button>
                )}
                {onDelete && (
                    <button
                        className="pf-card-delete"
                        onClick={e => { e.stopPropagation(); onDelete(); }}
                        title="Eliminar portafolio"
                    >
                        <i className="fa-solid fa-trash-can" />
                    </button>
                )}
            </div>

            <div className="pf-card-author">
                {vista === 'lista' && (
                    <h3 className="pf-card-title-lista">{nombreProyecto}</h3>
                )}
                <div className="pf-author-row">
                    <div className="pf-author-avatar">
                        {usuario?.img
                            ? <img src={usuario.img} alt={usuario.Nombre} />
                            : <i className="fa-solid fa-user" />
                        }
                    </div>
                    <span className="pf-author-name">{usuario?.Nombre || nombreProyecto}</span>
                    {promedio > 0 && (
                        <span className="pf-author-rating">
                            <i className="fa-solid fa-star" />
                            {Number(promedio).toFixed(1)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardProyecto;
