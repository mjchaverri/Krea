import React from 'react'
import "../../styles/EstilosPerfilUsuario/SeccionesPerfil.css"

function SeccionesPerfil({ activeTab, onTabChange, resenasCount = 0 }) {
    return (
        <div className="tabs-container">
            <div className="tabs">

                <div
                    className={`tab ${activeTab === 'proyectos' ? 'active' : ''}`}
                    onClick={() => onTabChange('proyectos')}
                >
                    <span className="fa-solid fa-table-cells"></span>
                    <h6>Proyectos</h6>
                </div>

                <div
                    className={`tab ${activeTab === 'resenas' ? 'active' : ''}`}
                    onClick={() => onTabChange('resenas')}
                >
                    <span className="fa-solid fa-star"></span>
                    <h6>Reseñas ({resenasCount})</h6>
                </div>

            </div>
        </div>
    )
}

export default SeccionesPerfil
