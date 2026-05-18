import "../../styles/PlantillaTalentos/GrillaDoble.css";
import EditorContenedores from "./EditorContenedores";
import EditableBlock from "./EditableBlock";
import { useEditable } from "./useEditable";
import { useEstilos } from "./useEstilos";
import { useState } from "react";

function GrillaDoble({ onActivate, activeElement, initialData, onUpdate }) {

    const handleUpdate = (key, newData) => {
        if (onUpdate) {
            onUpdate({ ...initialData, [key]: newData });
        }
    };

    const fondo = useEditable(initialData?.fondo, (d) => handleUpdate('fondo', d));
    const bloque1 = useEditable(initialData?.bloque1, (d) => handleUpdate('bloque1', d));
    const bloque2 = useEditable(initialData?.bloque2, (d) => handleUpdate('bloque2', d));

    return (
        <div className="grillaDoble__grid"
            style={{
                backgroundColor: fondo.state.colorFondo,
                backgroundImage: fondo.state.imageUrl
                    ? `url(${fondo.state.imageUrl})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            onClick={(e) => {
                e.stopPropagation();

                onActivate(e, {

                    id: "grillaDoble-fondo",
                    
                    tipo: "fondo",

                    setColorFondo: (color) =>
                        fondo.update({ colorFondo: color }),

                    setImageUrl: (url) =>
                        fondo.update({ imageUrl: url }),

                    imageUrl: fondo.state.imageUrl   
                });
            }}
        >

            <EditableBlock
                className="grillaDoble__image"
                data={bloque1.state}
                update={bloque1.update}
                onActivate={onActivate}
                activeElement={activeElement}
            />

            <EditableBlock
                className="grillaDoble__image"
                data={bloque2.state}
                update={bloque2.update}
                onActivate={onActivate}
                activeElement={activeElement}
            />

        </div>
    );
}
export default GrillaDoble;