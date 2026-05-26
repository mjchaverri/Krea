import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/ApartadoPaginaPrincipal/Footer';
import InfoUsuario from '../components/PerfilUsuario/InfoUsuario';
import SeccionesPerfil from '../components/PerfilUsuario/SeccionesPerfil';
import ProyectosRecientes from '../components/PerfilUsuario/ProyectosRecientes';
import ResenasPerfilUsuario from '../components/PerfilUsuario/ResenasPerfilUsuario';
import "../styles/EstilosPerfilUsuario/PerfilUsuario.css";
import Fetch from '../services/Fetch';
import { normalizarUsuario } from '../utils/normalizers';

function PerfilUsuario() {
    const [usuarioPerfil, setUsuarioPerfil] = useState(null);
    const [activeTab,     setActiveTab]     = useState('proyectos');
    const [resenasCount,  setResenasCount]  = useState(0);

    const cargarUsuario = async () => {
        try {
            const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioActivo"));
            if (!usuarioActivo?.id) return;
            const data = await Fetch.getData(`usuarios/${usuarioActivo.id}`);
            setUsuarioPerfil(data ? normalizarUsuario(data) : null);
        } catch (error) {
            console.error("Error cargando usuario:", error);
        }
    };

    useEffect(() => { cargarUsuario(); }, []);

    const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioActivo"));

    return (
        <div className="perfil-page">
            <Navbar />

            <div className="perfil-content">
                <InfoUsuario
                    usuario={usuarioPerfil}
                    isOwner={String(usuarioActivo?.id) === String(usuarioPerfil?.id)}
                    onUpdate={cargarUsuario}
                />
            </div>

            <div className="secciones-perfil">
                <SeccionesPerfil
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    resenasCount={resenasCount}
                />
            </div>

            {activeTab === 'proyectos' && (
                <ProyectosRecientes />
            )}

            {activeTab === 'resenas' && usuarioPerfil?.id && (
                <div className="perfil-resenas">
                    <ResenasPerfilUsuario
                        usuarioId={usuarioPerfil.id}
                        isOwner={true}
                        onCountChange={setResenasCount}
                    />
                </div>
            )}

            <Footer />
        </div>
    );
}

export default PerfilUsuario;
