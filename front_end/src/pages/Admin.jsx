import React, { useState } from 'react'
import SidebarAdmin from '../components/Administrador/SidebarAdmin'
import TablaUsuariosAdmin from '../components/Administrador/TablaUsuariosAdmin'
import DashboardAdmin from '../components/Administrador/DashboardAdmin'
import TabladePortafolios from '../components/PlantillaTalentos/TabladePortafolios'
import TablaConvocatoriasAdmin from '../components/Administrador/TablaConvocatoriasAdmin'
import TablaComunidadesAdmin from '../components/Administrador/TablaComunidadesAdmin'
import '../styles/EstilosAdmin/Admin.css'

const Admin = () => {
    const [vista, setVista] = useState('dashboard')

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden', backgroundColor: '#f5f8f8', color: '#0f172a' }}>
            <SidebarAdmin
                vistaActual={vista}
                mostrandoDashboard={()     => setVista('dashboard')}
                mostrandoUsuarios={()      => setVista('usuarios')}
                mostrandoPortafolio={()    => setVista('portafolio')}
                mostrandoConvocatorias={() => setVista('convocatorias')}
                mostrandoComunidades={()   => setVista('comunidades')}
            />

            <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f5f8f8', color: '#0f172a' }}>
                {vista === 'dashboard'      && <DashboardAdmin />}
                {vista === 'usuarios'       && <TablaUsuariosAdmin />}
                {vista === 'portafolio'     && <TabladePortafolios />}
                {vista === 'convocatorias'  && <TablaConvocatoriasAdmin />}
                {vista === 'comunidades'    && <TablaComunidadesAdmin />}
            </main>
        </div>
    )
}

export default Admin
