import "../../styles/EstilosPerfilUsuario/ProyectosRecientes.css";
import React from "react";
import PreviewComponentes from "../PlantillaTalentos/PreviewComponentes";

const CardProyecto = ({
    nombreProyecto,
    descripcionProyecto,
    estructura,
    onVerProyecto,
    promedio,
    imgPortada,
    idProyecto,
    onDelete,
    usuario,
    categorias = [],
}) => {
    const comps = estructura ? [estructura] : [];

    return (
        <div className="pp-card" onClick={onVerProyecto}>
            <div className="pp-card-media">
                {imgPortada ? (
                    <img src={imgPortada} alt={nombreProyecto} loading="lazy" />
                ) : (
                    <PreviewComponentes componentes={comps} />
                )}

                <div className="pp-card-overlay">
                    {categorias.length > 0 && (
                        <div className="pp-card-cats">
                            {categorias.slice(0, 2).map(cat => (
                                <span key={cat} className="pp-cat-tag">{cat}</span>
                            ))}
                            {categorias.length > 2 && (
                                <span className="pp-cat-tag">+{categorias.length - 2}</span>
                            )}
                        </div>
                    )}
                    <h3 className="pp-card-title">{nombreProyecto}</h3>
                </div>

                {onDelete && (
                    <button
                        className="pp-card-delete"
                        onClick={e => { e.stopPropagation(); onDelete(); }}
                    >
                        <i className="fa-solid fa-trash-can" />
                    </button>
                )}
            </div>

            <div className="pp-card-author">
                {usuario ? (
                    <>
                        <div className="pp-author-avatar">
                            {usuario.img
                                ? <img src={usuario.img} alt={usuario.Nombre} />
                                : <i className="fa-solid fa-user" />
                            }
                        </div>
                        <span className="pp-author-name">{usuario.Nombre}</span>
                    </>
                ) : (
                    <span className="pp-author-name">{nombreProyecto}</span>
                )}
                {promedio > 0 && (
                    <span className="pp-author-rating">
                        <i className="fa-solid fa-star" /> {Number(promedio).toFixed(1)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CardProyecto;
