import { useState } from "react";
import Lienzo from "./Lienzo";
import Estructura1 from "./Estructura1";
import Estructura1_1 from "./Estructura1_1";
import Estructura1_2 from "./Estructura1_2";
import Estructura1_3 from "./Estructura1_3";
import Estructura1_4 from "./Estructura1_4";
import GrillaDoble from "./GrillaDoble";
import GrillaTriple from "./GrillaTriple";
import Grilla1_2_Izda from "./Grilla1_2_Izda";
import "../../styles/PlantillaTalentos/ModalVistaPrevia.css";

const MAPA = {
    Estructura1, Estructura1_1, Estructura1_2, Estructura1_3, Estructura1_4,
    GrillaDoble, GrillaTriple, Grilla1_2_Izda,
};

function ModalVistaPrevia({ visible, componentes, tituloProyecto, descripcionProyecto, categorias, onClose }) {
    const [zoom, setZoom] = useState(1);

    if (!visible) return null;

    const changeZoom = (delta) =>
        setZoom(z => Math.min(Math.max(+(z + delta).toFixed(2), 0.3), 3));
    const resetZoom = () => setZoom(1);

    const handleWheel = (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        changeZoom(e.deltaY < 0 ? 0.1 : -0.1);
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
                    <div className="pvw-scale-host pvw-preview-mode" style={{ zoom }}>
                        <Lienzo
                            tituloProyecto={tituloProyecto}
                            descripcionProyecto={descripcionProyecto}
                            categorias={categorias}
                            childrenEstructura={
                                <>
                                    {(componentes || []).map((comp) => {
                                        const Comp = MAPA[comp.type];
                                        if (!Comp) return null;
                                        return (
                                            <Comp
                                                key={comp.id}
                                                initialData={comp.data}
                                                onActivate={() => {}}
                                                activeElement={null}
                                                onUpdate={() => {}}
                                            />
                                        );
                                    })}
                                </>
                            }
                        />
                    </div>
                </div>

                <div className="pvw-zoom-bar">
                    <button className="pvw-zoom-btn" onClick={() => changeZoom(-0.25)} disabled={zoom <= 0.3} title="Alejar">
                        <i className="fa-solid fa-minus" />
                    </button>
                    <span className="pvw-zoom-label" onClick={resetZoom} title="Restablecer zoom">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button className="pvw-zoom-btn" onClick={() => changeZoom(0.25)} disabled={zoom >= 3} title="Acercar">
                        <i className="fa-solid fa-plus" />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ModalVistaPrevia;
