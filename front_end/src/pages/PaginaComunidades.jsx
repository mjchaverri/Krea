import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/ApartadoPaginaPrincipal/Footer'
import SidebarComunidades from '../components/Comunidades/SidebarComunidades'
import CompComunidades from '../components/Comunidades/CompComunidades'
import Fetch from '../services/Fetch'

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

    const misComunidades = useMemo(() => {
        if (!usuario) return []
        const ids = miembros.filter(m => m.usuarioId === usuario.id).map(m => m.comunidadId)
        return comunidades.filter(c => ids.includes(c.id))
    }, [comunidades, miembros, usuario])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1, minHeight: 0, alignItems: 'stretch' }}>
                <SidebarComunidades
                    misComunidades={misComunidades}
                    comunidadActiva={comunidadActiva}
                    usuario={usuario}
                    onSeleccionar={setComunidadActiva}
                    onExplorar={() => setComunidadActiva(null)}
                    onComunidadCreada={(nueva) => setComunidades(prev => [...prev, nueva])}
                />
                <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
                    <CompComunidades
                        comunidadActivaExterna={comunidadActiva}
                        onComunidadActivaChange={setComunidadActiva}
                        onMiembrosChange={(mbs) => setMiembros(mbs)}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default PaginaComunidades
