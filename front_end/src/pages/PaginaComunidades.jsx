import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/ApartadoPaginaPrincipal/Footer'
import SidebarComunidades from '../components/Comunidades/SidebarComunidades'
import CompComunidades from '../components/Comunidades/CompComunidades'

function PaginaComunidades() {
    const location = useLocation()
    const [usuario,              setUsuario]              = useState(null)
    const [comunidadActiva,      setComunidadActiva]      = useState(null)
    const [misComunidades,       setMisComunidades]       = useState([])
    const [comunidadesAdmin,     setComunidadesAdmin]     = useState([])
    const [pedidoEdicion,        setPedidoEdicion]        = useState(null)

    const abrirComunidadId = location.state?.abrirComunidadId || null

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('UsuarioActivo') || 'null')
        setUsuario(u)
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <SidebarComunidades
                    misComunidades={misComunidades}
                    comunidadesAdmin={comunidadesAdmin}
                    comunidadActiva={comunidadActiva}
                    usuario={usuario}
                    onSeleccionar={setComunidadActiva}
                    onExplorar={() => setComunidadActiva(null)}
                    onComunidadCreada={() => {}}
                    onEditarComunidad={setPedidoEdicion}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <CompComunidades
                        comunidadActivaExterna={comunidadActiva}
                        onComunidadActivaChange={setComunidadActiva}
                        onMisComunidadesChange={setMisComunidades}
                        onComunidadesAdminChange={setComunidadesAdmin}
                        pedidoEdicion={pedidoEdicion}
                        onPedidoEdicionConsumed={() => setPedidoEdicion(null)}
                        abrirComunidadId={abrirComunidadId}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default PaginaComunidades
