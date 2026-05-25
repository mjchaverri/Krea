import Estructura1 from "./Estructura1";
import Estructura1_1 from "./Estructura1_1";
import Estructura1_2 from "./Estructura1_2";
import Estructura1_3 from "./Estructura1_3";
import Estructura1_4 from "./Estructura1_4";
import GrillaDoble from "./GrillaDoble";
import GrillaTriple from "./GrillaTriple";
import Grilla1_2_Izda from "./Grilla1_2_Izda";

const MAPA_COMPONENTES = {
    Estructura1,
    Estructura1_1,
    Estructura1_2,
    Estructura1_3,
    Estructura1_4,
    GrillaDoble,
    GrillaTriple,
    Grilla1_2_Izda,
};

function ComponentePortafolio({ comp, activeElement, onActivate, onUpdate, onEliminar, onMover, isFirst, isLast }) {
    const Componente = MAPA_COMPONENTES[comp.type];
    if (!Componente) return null;

    return (
        <div className="componente-wrapper">
            <div className="componente-contenido">
                <Componente
                    onActivate={(e, data) => onActivate(e, { ...data, id: comp.id })}
                    activeElement={activeElement}
                    initialData={comp.data}
                    onUpdate={(newData) => onUpdate(comp.id, newData)}
                />
            </div>
            <div className="componente-acciones">
                <button
                    className="componente-mover"
                    onClick={(e) => { e.stopPropagation(); onMover(comp.id, 'up'); }}
                    disabled={isFirst}
                    title="Mover arriba"
                >
                    <i className="fa-solid fa-chevron-up" />
                </button>
                <button
                    className="componente-eliminar"
                    onClick={(e) => { e.stopPropagation(); onEliminar(comp.id); }}
                    title="Eliminar bloque"
                >
                    <i className="fa-solid fa-trash" />
                </button>
                <button
                    className="componente-mover"
                    onClick={(e) => { e.stopPropagation(); onMover(comp.id, 'down'); }}
                    disabled={isLast}
                    title="Mover abajo"
                >
                    <i className="fa-solid fa-chevron-down" />
                </button>
            </div>
        </div>
    );
}

export default ComponentePortafolio;
