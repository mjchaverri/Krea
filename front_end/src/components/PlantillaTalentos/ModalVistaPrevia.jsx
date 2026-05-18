import { useState } from "react";
import "../../styles/PlantillaTalentos/ModalVistaPrevia.css";

const BASE_VW = 80;

function ModalVistaPrevia({ visible, imagen, onClose }) {
    const [zoom, setZoom] = useState(1);

    if (!visible) return null;

    const changeZoom = (delta) =>
        setZoom(z => Math.min(Math.max(+(z + delta).toFixed(2), 0.3), 5));

    const resetZoom = () => setZoom(1);

    const handleWheel = (e) => {
        e.preventDefault();
        changeZoom(e.deltaY < 0 ? 0.15 : -0.15);
    };

    return (
        <div className="pvw-overlay" onClick={onClose}>
            <div className="pvw-card" onClick={(e) => e.stopPropagation()}>

                <div className="pvw-card__header">
                    <span className="pvw-card__title">
                        <i className="fa-solid fa-eye" /> Vista previa
                    </span>
                    <button className="pvw-close" onClick={onClose} title="Cerrar">
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                <div className="pvw-body" onWheel={handleWheel}>
                    <div className="pvw-scroll-inner">
                        {imagen && (
                            <img
                                src={imagen}
                                alt="Vista previa"
                                className="pvw-img"
                                draggable={false}
                                style={{ width: `${BASE_VW * zoom}%` }}
                            />
                        )}
                    </div>
                </div>

                <div className="pvw-zoom-bar">
                    <button
                        className="pvw-zoom-btn"
                        onClick={() => changeZoom(-0.25)}
                        disabled={zoom <= 0.3}
                        title="Alejar"
                    >
                        <i className="fa-solid fa-minus" />
                    </button>
                    <span className="pvw-zoom-label" onClick={resetZoom} title="Restablecer zoom">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        className="pvw-zoom-btn"
                        onClick={() => changeZoom(0.25)}
                        disabled={zoom >= 5}
                        title="Acercar"
                    >
                        <i className="fa-solid fa-plus" />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ModalVistaPrevia;
