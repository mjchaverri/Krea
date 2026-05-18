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

function ComponentePortafolio({ comp, activeElement, onActivate, onUpdate, onEliminar }) {
    const Componente = MAPA_COMPONENTES[comp.type];
    if (!Componente) return null;

    return (
        <div className="componente-wrapper">
            <Componente
                onActivate={(e, data) => onActivate(e, { ...data, id: comp.id })}
                activeElement={activeElement}
                initialData={comp.data}
                onUpdate={(newData) => onUpdate(comp.id, newData)}
            />
            <button
                className="componente-eliminar"
                onClick={(e) => { e.stopPropagation(); onEliminar(comp.id); }}
                title="Eliminar bloque"
            >
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    );
}

export default ComponentePortafolio;
