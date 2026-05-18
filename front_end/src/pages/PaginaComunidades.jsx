import React, { useState, useEffect, useMemo } from 'react'
import SidebarComunidades from '../components/Sidebar/SidebarComunidades'
import CompComunidades from '../components/ApartadoPaginaPrincipal/CompComunidades'
import '../styles/EstilosSidebar/SidebarComunidades.css'
import Fetch from '../services/Fetch'

/**
 * PaginaComunidades
 *
 * Página contenedora que:
 *  - Obtiene datos de sesión y membresías
 *  - Renderiza el SidebarComunidades (siempre visible, responsivo)
 *  - Renderiza CompComunidades en el área principal
 *  - Gestiona la comunidad activa para el chat
 */
function PaginaComunidades() {
    const [usuario, setUsuario] = useState(null)
    const [comunidades, setComunidades] = useState([])
    const [miembros, setMiembros] = useState([])
    const [comunidadActiva, setComunidadActiva] = useState(null)

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('UsuarioActivo') || 'null')
        setUsuario(u)

        const cargar = async () => {
            const [coms, mbs] = await Promise.all([
                Fetch.getData('comunidades'),
                Fetch.getData('miembros_comunidades')
            ])
            setComunidades(coms || [])
            setMiembros(mbs || [])
        }
        cargar()
    }, [])

    // Comunidades del usuario activo
    const misComunidades = useMemo(() => {
        if (!usuario) return []
        const ids = miembros
            .filter(m => m.usuarioId === usuario.id)
            .map(m => m.comunidadId)
        return comunidades.filter(c => ids.includes(c.id))
    }, [comunidades, miembros, usuario])

    // Callback cuando CompComunidades notifica un cambio en membresías
    const handleMiembrosChange = (nuevosMiembros) => {
        setMiembros(nuevosMiembros)
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8ff' }}>
            {/* ─── Sidebar siempre visible ─── */}
            <SidebarComunidades
                misComunidades={misComunidades}
                comunidadActiva={comunidadActiva}
                usuario={usuario}
                onSeleccionar={(com) => setComunidadActiva(com)}
                onExplorar={() => setComunidadActiva(null)}
            />

            {/* ─── Área principal ─── */}
            <div style={{ flex: 3, minWidth: 0 }}>
                <CompComunidades
                    comunidadActivaExterna={comunidadActiva}
                    onComunidadActivaChange={setComunidadActiva}
                    onMiembrosChange={handleMiembrosChange}
                />
            </div>
        </div>
    )
}

export default PaginaComunidades
