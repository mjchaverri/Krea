import { useState } from 'react'
import SidebarAdmin from '../components/Administrador/SidebarAdmin'
import TablaUsuariosAdmin from '../components/Administrador/TablaUsuariosAdmin'
import DashboardAdmin from '../components/Administrador/DashboardAdmin'
import TabladePortafolios from '../components/PlantillaTalentos/TabladePortafolios'
import TablaConvocatoriasAdmin from '../components/Administrador/TablaConvocatoriasAdmin'
import TablaComunidadesAdmin from '../components/Administrador/TablaComunidadesAdmin'
import '../styles/EstilosAdmin/Admin.css'

const TITULOS = {
    dashboard:     'Panel de Control General',
    usuarios:      'Gestión de Usuarios',
    portafolio:    'Gestión de Portafolios',
    convocatorias: 'Convocatorias',
    comunidades:   'Comunidades',
}

const Admin = () => {
    const [vista, setVista] = useState('dashboard')

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f0f4f8' }}>
            <SidebarAdmin
                vistaActual={vista}
                mostrandoDashboard={()     => setVista('dashboard')}
                mostrandoUsuarios={()      => setVista('usuarios')}
                mostrandoPortafolio={()    => setVista('portafolio')}
                mostrandoConvocatorias={() => setVista('convocatorias')}
                mostrandoComunidades={()   => setVista('comunidades')}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <header style={{
                    height: 64, background: '#fff', borderBottom: '1px solid #e8edf2',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 32px', flexShrink: 0,
                }}>
                    <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
                        {TITULOS[vista]}
                    </h1>
                </header>

                {/* Content */}
                <main style={{ flex: 1, overflowY: 'auto', background: '#f0f4f8' }}>
                    {vista === 'dashboard'      && <DashboardAdmin onInspeccionar={() => setVista('convocatorias')} />}
                    {vista === 'usuarios'       && <TablaUsuariosAdmin />}
                    {vista === 'portafolio'     && <TabladePortafolios />}
                    {vista === 'convocatorias'  && <TablaConvocatoriasAdmin />}
                    {vista === 'comunidades'    && <TablaComunidadesAdmin />}
                </main>
            </div>
        </div>
    )
}

export default Admin
