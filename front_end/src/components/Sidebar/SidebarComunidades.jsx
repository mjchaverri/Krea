import React from 'react'
import '../../styles/EstilosSidebar/SidebarComunidades.css'


/**
 * SidebarComunidades
 * 
 * Props:
 *  - misComunidades  {Array}    Lista de comunidades a las que el usuario está unido
 *  - comunidadActiva {Object}   Comunidad cuyo chat está abierto (null si ninguna)
 *  - usuario         {Object}   Datos del usuario activo (null si no hay sesión)
 *  - onSeleccionar   {Function} Callback(comunidad) al hacer click en un item
 *  - onExplorar      {Function} Callback para "Explorar más"
 */
function SidebarComunidades({
    misComunidades = [],
    comunidadActiva = null,
    usuario = null,
    onSeleccionar,
    onExplorar
}) {
    return (
        <aside className="sidebar-com" id="sidebar-comunidades">
            {/* ── Header ── */}
            <div className="sidebar-com__header">
                <span className="sidebar-com__header-icon">💬</span>
                <div>
                    <h2 className="sidebar-com__titulo">Mis comunidades</h2>
                    {usuario && (
                        <p className="sidebar-com__subtitulo">
                            {misComunidades.length} comunidad{misComunidades.length !== 1 ? 'es' : ''}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Contenido ── */}
            {!usuario ? (
                <div className="sidebar-com__empty">
                    <span className="sidebar-com__empty-icon">🔒</span>
                    <p>Inicia sesión para ver tus comunidades y chatear</p>
                </div>
            ) : misComunidades.length === 0 ? (
                <div className="sidebar-com__empty">
                    <span className="sidebar-com__empty-icon">🌱</span>
                    <p>Aún no te has unido a ninguna comunidad.<br />¡Explora y únete!</p>
                </div>
            ) : (
                <>
                    <p className="sidebar-com__label">Canales</p>
                    <ul className="sidebar-com__lista" id="sidebar-lista-comunidades">
                        {misComunidades.map(com => {
                            const activo = comunidadActiva?.id === com.id
                            return (
                                <li key={com.id}>
                                    <button
                                        id={`sidebar-item-${com.id}`}
                                        className={`sidebar-com__item ${activo ? 'sidebar-com__item--activo' : ''}`}
                                        style={activo
                                            ? { borderLeftColor: com.color, background: `${com.color}14` }
                                            : {}
                                        }
                                        onClick={() => onSeleccionar?.(com)}
                                        title={com.nombre}
                                    >
                                        {/* Indicador activo */}
                                        {activo && <span className="sidebar-com__item-badge"></span>}

                                        {/* Ícono */}
                                        <span
                                            className="sidebar-com__item-icono"
                                            style={{ background: `${com.color}1e`, color: com.color }}
                                        >
                                            {com.icono}
                                        </span>

                                        {/* Texto */}
                                        <span className="sidebar-com__item-texto">
                                            <span className="sidebar-com__item-nombre">{com.nombre}</span>
                                            <span className="sidebar-com__item-cat"># {com.categoria}</span>
                                        </span>

                                        {/* Flecha */}
                                        <span className="sidebar-com__item-arrow">›</span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </>
            )}

            {/* ── Footer ── */}
            <div className="sidebar-com__footer">
                <button
                    id="sidebar-btn-explorar"
                    className="sidebar-com__btn-explorar"
                    onClick={() => onExplorar?.()}
                >
                    🔭 Explorar comunidades
                </button>
            </div>
        </aside>
    )
}

export default SidebarComunidades
