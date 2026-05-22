import { useState, useEffect } from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/ApartadoPaginaPrincipal/Footer'
import SidebarComunidades from '../components/Comunidades/SidebarComunidades'
import CompComunidades from '../components/Comunidades/CompComunidades'

function PaginaComunidades() {
    const [usuario, setUsuario] = useState(null)
    const [comunidadActiva, setComunidadActiva] = useState(null)

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('UsuarioActivo') || 'null')
        setUsuario(u)
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1, minHeight: 0, alignItems: 'stretch' }}>
                <SidebarComunidades
                    misComunidades={[]}
                    comunidadActiva={comunidadActiva}
                    usuario={usuario}
                    onSeleccionar={setComunidadActiva}
                    onExplorar={() => setComunidadActiva(null)}
                    onComunidadCreada={() => {}}
                />
                <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                    <CompComunidades
                        comunidadActivaExterna={comunidadActiva}
                        onComunidadActivaChange={setComunidadActiva}
                        onMiembrosChange={() => {}}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default PaginaComunidades
