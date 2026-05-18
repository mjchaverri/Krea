import { useState } from "react";
import "../../styles/PlantillaTalentos/SidebarTalentos.css";

function SidebarTalentos({ actEst1, actEst1_1, actEst1_2, actEst1_3, actEst1_4, actGrillaDoble, actGrillaTriple, actGrilla1_2_Izda }) {
  const [busqueda, setBusqueda] = useState("");

  const plantillas = [
    {
      nombre: "Layout Centrado",
      accion: actEst1,
      preview: (
        <div className="sidebartalentos__layout-preview layout-centered">
          <div className="layout-centered__box"></div>
        </div>
      ),
    },
    {
      nombre: "Layout 1:1",
      accion: actEst1_1,
      preview: (
        <div className="sidebartalentos__layout-preview layout-header-column">
          <div className="layout-header-column__top"></div>
          <div className="layout-header-column__bottom"></div>
        </div>
      ),
    },
    {
      nombre: "Layout 1:2",
      accion: actEst1_2,
      preview: (
        <div className="sidebartalentos__layout-preview layout-1-2">
          <div className="layout-1-2__top"></div>
          <div className="layout-1-2__bottom">
            <div></div>
            <div></div>
          </div>
        </div>
      ),
    },
    {
      nombre: "Layout 1:3",
      accion: actEst1_3,
      preview: (
        <div className="sidebartalentos__layout-preview layout-1-3">
          <div className="layout-1-3__top"></div>
          <div className="layout-1-3__bottom">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ),
    },
    {
      nombre: "Layout 1:4",
      accion: actEst1_4,
      preview: (
        <div className="sidebartalentos__layout-preview layout-1-4">
          <div className="layout-1-4__top"></div>
          <div className="layout-1-4__bottom">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ),
    },
    {
      nombre: "Grilla Doble",
      accion: actGrillaDoble,
      preview: (
        <div className="sidebartalentos__layout-preview layout-2-cols">
          <div></div>
          <div></div>
        </div>
      ),
    },
    {
      nombre: "Grilla Triple",
      accion: actGrillaTriple,
      preview: (
        <div className="sidebartalentos__layout-preview layout-3-cols">
          <div></div>
          <div></div>
          <div></div>
        </div>
      ),
    },
  ];

  const filtradas = plantillas.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="sidebartalentos">

      <div className="sidebartalentos__header">
        <div className="sidebartalentos__title">
          <span className="sidebartalentos__icon">▦</span>
          <h6>Plantillas</h6>
        </div>
        <span className="sidebartalentos__badge">EDITOR</span>
      </div>

      <input
        type="text"
        className="sidebartalentos__search"
        placeholder="Buscar componentes..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <p className="sidebartalentos__section-title">ESTRUCTURAS Y GRILLAS</p>

      <div className="sidebartalentos__grid">
        {filtradas.length > 0 ? (
          filtradas.map((p) => (
            <div key={p.nombre} className="sidebartalentos__layout" onClick={p.accion}>
              {p.preview}
              <span>{p.nombre}</span>
            </div>
          ))
        ) : (
          <p className="sidebartalentos__empty">
            Sin resultados para "<strong>{busqueda}</strong>"
          </p>
        )}
      </div>

    </div>
  );
}

export default SidebarTalentos;
