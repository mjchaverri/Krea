/**
 * PerfilVisitanteModal
 * -------------------------------------------------------------------
 * Muestra el perfil PÚBLICO de cualquier usuario identificado por
 * su `usuarioId`.  Reutiliza exactamente los mismos estilos CSS que
 * usa la página PerfilUsuario (InfoUsuarios.css, PerfilUsuario.css,
 * ProyectosRecientes.css, ResenasUsuario.css, SeccionesPerfil.css)
 * y el componente InfoUsuario con isOwner=false.
 *
 * NO modifica ningún componente existente.
 * NO usa localStorage para identificar al propietario — siempre
 * muestra la vista de visitante (solo lectura).
 * -------------------------------------------------------------------
 */

import React, { useState, useEffect, useMemo } from "react";
import InfoUsuario from "./InfoUsuario";
import CardProyecto from "./CardProyecto";
import ModalProyecto from "./ModalProyecto";
import Fetch from "../../services/Fetch";
import { normalizarPortafolio, normalizarResena, normalizarUsuario } from "../../utils/normalizers";
import { calcularPromedio } from "../../utils/calcularPromedio";

// Reutilizamos los estilos existentes — sin duplicar ni crear nuevos
import "../../styles/EstilosPerfilUsuario/PerfilUsuario.css";
import "../../styles/EstilosPerfilUsuario/InfoUsuarios.css";
import "../../styles/EstilosPerfilUsuario/ProyectosRecientes.css";
import "../../styles/EstilosPerfilUsuario/ResenasUsuario.css";
import "../../styles/EstilosPerfilUsuario/SeccionesPerfil.css";

function PerfilVisitanteModal({ usuarioId, onClose }) {
  const [usuario, setUsuario] = useState(null);
  const [portafolios, setPortafolios] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Sub-modal: ver proyecto desde el perfil del visitante
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        // Si hay sub-modal abierto, ciérralo primero
        if (proyectoSeleccionado) {
          setProyectoSeleccionado(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, proyectoSeleccionado]);

  // Cargar datos del usuario, sus portafolios y reseñas — misma lógica
  // que ProyectosRecientes y ReseñasUsuario pero parametrizada por usuarioId
  useEffect(() => {
    if (!usuarioId) return;

    async function cargarDatos() {
      setCargando(true);
      try {
        const [resU, resP, resR] = await Promise.all([
          Fetch.getData(`usuarios/${usuarioId}`),
          Fetch.getData(`portafolios/usuario/${usuarioId}?limit=50`),
          Fetch.getData('resenas?limit=100'),
        ]);

        setUsuario(resU ? normalizarUsuario(resU) : null);

        const portafoliosNorm = (resP || []).map(normalizarPortafolio);
        setPortafolios(portafoliosNorm);

        const idsPortafolios = new Set(portafoliosNorm.map((p) => p.id));
        const resenasNorm = (resR || [])
          .map(normalizarResena)
          .filter((r) => idsPortafolios.has(r.portafolioId));
        setResenas(resenasNorm);
      } catch (error) {
        console.error("PerfilVisitanteModal — error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [usuarioId]);

  // ── Distribución de estrellas (misma lógica que ResenasUsuario) ──
  const promedio = useMemo(() => calcularPromedio(resenas), [resenas]);

  const distribucion = useMemo(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    resenas.forEach((r) => dist[r.rating]++);
    return dist;
  }, [resenas]);

  const total = resenas.length || 1;

  // ── Reseñas del proyecto seleccionado (para el sub-modal) ──────────
  const resenasProyecto = useMemo(() => {
    if (!proyectoSeleccionado) return [];
    return resenas.filter(
      (r) => r.portafolioId === proyectoSeleccionado.id
    );
  }, [proyectoSeleccionado, resenas]);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Overlay principal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflowY: "auto",
          padding: "32px 16px",
          animation: "pfv-fadeIn .3s ease-out",
        }}
        onClick={onClose}
      >
        {/* Panel */}
        <div
          style={{
            background: "#f5f8f8",
            width: "100%",
            maxWidth: "1100px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 25px 60px -10px rgba(0,0,0,0.3)",
            animation: "pfv-slideUp .4s cubic-bezier(0.16,1,0.3,1)",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Encabezado del modal ──────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              background: "#fff",
              borderBottom: "1px solid #e0e6ed",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                className="material-symbols-outlined"
                style={{ color: "#0db9f2", fontSize: "22px" }}
              >
                person
              </span>
              <span
                style={{ fontWeight: "700", fontSize: "16px", color: "#1a202c" }}
              >
                Perfil del creador
              </span>
              {usuario && (
                <span style={{ color: "#6b7a8c", fontSize: "14px" }}>
                  — {usuario.Nombre}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              title="Cerrar"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                transition: "all .2s",
                fontSize: "18px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "rotate(90deg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "rotate(0deg)")
              }
            >
              ×
            </button>
          </div>

          {/* ── Cuerpo ───────────────────────────────────────────── */}
          {cargando ? (
            <div
              style={{
                padding: "80px 20px",
                textAlign: "center",
                color: "#6b7a8c",
                fontSize: "15px",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "48px",
                  display: "block",
                  marginBottom: "12px",
                  animation: "pfv-spin 1s linear infinite",
                }}
              >
                progress_activity
              </span>
              Cargando perfil...
            </div>
          ) : !usuario ? (
            <div
              style={{
                padding: "80px 20px",
                textAlign: "center",
                color: "#6b7a8c",
              }}
            >
              No se encontró el usuario.
            </div>
          ) : (
            <div style={{ paddingBottom: "40px" }}>

              {/* INFO DEL USUARIO — reutilizando InfoUsuario con isOwner=false (vista de visitante, sin edición) */}
              <div className="perfil-content">
                <InfoUsuario
                  usuario={usuario}
                  isOwner={false}
                  onUpdate={null}
                />
              </div>

              {/* TABS — reutilizando .tabs-container / .tab / .tab.active */}
              <div className="secciones-perfil">
                <div className="tabs-container">
                  <div className="tabs">
                    <div className="tab active">
                      <span className="fa-solid fa-table-cells" />
                      <h6>Proyectos</h6>
                    </div>
                    <div className="tab">
                      <span className="fa-solid fa-star" />
                      <h6>Reseñas ({resenas.length})</h6>
                    </div>
                  </div>
                </div>
              </div>

              {/* RESEÑAS — reutilizando .resenas-container / .resenas-score / .resena-card */}
              <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
                <div className="resenas-container">
                  {/* Score */}
                  <div className="resenas-score">
                    <h2>{promedio}</h2>
                    <p>Promedio de {resenas.length} valoraciones</p>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="barra">
                        <span>{star}</span>
                        <div className="barra-bg">
                          <div
                            className="barra-fill"
                            style={{
                              width: `${(distribucion[star] / total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Lista de reseñas */}
                  <div className="resenas-list">
                    <h4>Reseñas de Clientes</h4>
                    {resenas.length === 0 ? (
                      <p style={{ color: "#777", fontStyle: "italic" }}>
                        Este usuario aún no tiene reseñas.
                      </p>
                    ) : (
                      resenas.map((r, i) => (
                        <div key={i} className="resena-card">
                          <div className="resena-stars">
                            {"★".repeat(r.rating)}
                            {"☆".repeat(5 - r.rating)}
                          </div>
                          <p className="resena-text">{r.comentario}</p>
                          <span className="resena-user">
                            {new Date(r.fecha).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* PROYECTOS — reutilizando .proyectos-container / .proyectos-grid / CardProyecto */}
              <div className="proyectos-container">
                <div className="proyectos-header">
                  <h4>Proyectos</h4>
                  <p>{portafolios.length} proyecto{portafolios.length !== 1 ? "s" : ""}</p>
                </div>

                {portafolios.length === 0 ? (
                  <div className="empty-state-container">
                    <div className="empty-state-icon">📁</div>
                    <h4>Este usuario aún no tiene proyectos</h4>
                  </div>
                ) : (
                  <div className="proyectos-grid">
                    {portafolios.map((proyecto) => {
                      const resenasP = resenas.filter(
                        (r) => r.portafolioId === proyecto.id
                      );
                      return (
                        <CardProyecto
                          key={proyecto.id}
                          idProyecto={proyecto.id}
                          nombreProyecto={proyecto.titulo}
                          descripcionProyecto={proyecto.descripcion}
                          estructura={proyecto.componentes?.[0]}
                          promedio={calcularPromedio(resenasP)}
                          imgPortada={proyecto.imgPortada}
                          onVerProyecto={() => setProyectoSeleccionado(proyecto)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-modal: ver proyecto (solo lectura — isOwner nunca es true aquí
          porque no venimos del perfil personal) */}
      {proyectoSeleccionado && (
        <ModalProyecto
          proyecto={proyectoSeleccionado}
          resenas={resenasProyecto}
          onClose={() => setProyectoSeleccionado(null)}
          onReviewAdded={null}
        />
      )}

      {/* Keyframes propios para no contaminar estilos globales */}
      <style>{`
        @keyframes pfv-fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes pfv-slideUp {
          from { transform: translateY(40px) scale(0.97); opacity:0 }
          to   { transform: translateY(0)     scale(1);    opacity:1 }
        }
        @keyframes pfv-spin    { to { transform: rotate(360deg) } }
      `}</style>
    </>
  );
}

export default PerfilVisitanteModal;
