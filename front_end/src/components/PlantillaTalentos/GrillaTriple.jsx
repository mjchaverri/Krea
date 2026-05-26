import "../../styles/PlantillaTalentos/GrillaTriple.css";
import EditableBlock from "./EditableBlock";
import { useEditable } from "./useEditable";
import { useImagePan } from "./useImagePan";
import { useState, useEffect } from "react";

function GrillaTriple({ onActivate, activeElement, initialData, onUpdate }) {

  const handleUpdate = (key, newData) => {
    if (onUpdate) {
      onUpdate({ ...initialData, [key]: newData });
    }
  };

  const fondo = useEditable(initialData?.fondo, (d) => handleUpdate('fondo', d));
  const bloque1 = useEditable(initialData?.bloque1, (d) => handleUpdate('bloque1', d));
  const bloque2 = useEditable(initialData?.bloque2, (d) => handleUpdate('bloque2', d));
  const bloque3 = useEditable(initialData?.bloque3, (d) => handleUpdate('bloque3', d));

  const pan = useImagePan(fondo.state.imageUrl, fondo.state.imagePosition, (pos) => fondo.update({ imagePosition: pos }));

  const [loadingFondo, setLoadingFondo] = useState(false);

  useEffect(() => {
    if (fondo.state.imageUrl) {
      setLoadingFondo(true);
      const img = new Image();
      img.onload = () => setLoadingFondo(false);
      img.onerror = () => setLoadingFondo(false);
      img.src = fondo.state.imageUrl;
    } else {
      setLoadingFondo(false);
    }
  }, [fondo.state.imageUrl]);

  return (
    <>
      <div
        className="grillaTriple__grid"
        style={{
          backgroundColor: fondo.state.colorFondo,
          backgroundImage: fondo.state.imageUrl && !loadingFondo
            ? `url(${fondo.state.imageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: fondo.state.imagePosition || "50% 50%",
          outline: (activeElement?.id && activeElement.id === fondo.state.id) ? "2px solid #3b82f6" : "none",
          cursor: pan.cursor,
        }}
        onMouseDown={pan.onMouseDown}
        onClick={(e) => {
          if (pan.consumeClick()) return;
          e.stopPropagation();
          onActivate(e, {
            id: fondo.state.id,
            tipo: "fondo",
            setColorFondo: (c) => fondo.update({ colorFondo: c }),
            setImageUrl: (u) => fondo.update({ imageUrl: u }),
            imageUrl: fondo.state.imageUrl,
            colorFondo: fondo.state.colorFondo,
          });
        }}
      >
        {loadingFondo && (
          <div className="loading-overlay-fondo">
            <div className="spinner"></div>
          </div>
        )}

        {fondo.state.imageUrl && !loadingFondo && (
          <button
            className="bloque-quitar-imagen"
            onClick={(e) => { e.stopPropagation(); fondo.update({ imageUrl: '' }); }}
            title="Quitar imagen"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}

        <EditableBlock
          className="grillaTriple__image"
          data={bloque1.state}
          update={bloque1.update}
          onActivate={onActivate}
          activeElement={activeElement}
        />

        <EditableBlock
          className="grillaTriple__image"
          data={bloque2.state}
          update={bloque2.update}
          onActivate={onActivate}
          activeElement={activeElement}
        />

        <EditableBlock
          className="grillaTriple__image"
          data={bloque3.state}
          update={bloque3.update}
          onActivate={onActivate}
          activeElement={activeElement}
        />

      </div>
    </>
  );
}
export default GrillaTriple;