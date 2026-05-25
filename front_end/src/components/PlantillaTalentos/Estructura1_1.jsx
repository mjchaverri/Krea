import "../../styles/PlantillaTalentos/Estructura1_1.css";
import EditableBlock from "./EditableBlock";
import { useEditable } from "./useEditable";
import { useState, useEffect } from "react";

function Estructura1_1({ onActivate, activeElement, initialData, onUpdate }) {

  const handleUpdate = (key, newData) => {
    if (onUpdate) {
      onUpdate({ ...initialData, [key]: newData });
    }
  };

  const fondo = useEditable(initialData?.fondo, (d) => handleUpdate('fondo', d));
  const bloqueTop = useEditable(initialData?.bloqueTop, (d) => handleUpdate('bloqueTop', d));
  const bloqueBottom = useEditable(initialData?.bloqueBottom, (d) => handleUpdate('bloqueBottom', d));

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
    <div
      className="est1_1"
      style={{
        backgroundColor: fondo.state.colorFondo,
        backgroundImage: fondo.state.imageUrl && !loadingFondo
          ? `url(${fondo.state.imageUrl})`
          : "none",
        outline:
          (activeElement?.id && activeElement.id === fondo.state.id) ? "2px solid #3b82f6" : "none",
        position: "relative"
      }}
      onClick={(e) => {
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

      <div className="est1_1__content">

        <EditableBlock
          className="est1_1__title"
          data={bloqueTop.state}
          update={bloqueTop.update}
          onActivate={onActivate}
          activeElement={activeElement}
        />

        <EditableBlock
          className="est1_1__description"
          data={bloqueBottom.state}
          update={bloqueBottom.update}
          onActivate={onActivate}
          activeElement={activeElement}
        />

      </div>
    </div>
  );
}

export default Estructura1_1;