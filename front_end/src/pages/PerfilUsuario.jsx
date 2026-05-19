import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/ApartadoPaginaPrincipal/Footer';
import InfoUsuario from '../components/PerfilUsuario/InfoUsuario';
import SeccionesPerfil from '../components/PerfilUsuario/SeccionesPerfil';
import ProyectosRecientes from '../components/PerfilUsuario/ProyectosRecientes';
import "../styles/EstilosPerfilUsuario/PerfilUsuario.css";
import Fetch from '../services/Fetch';
import { normalizarUsuario } from '../utils/normalizers';
import ResenasUsuario from '../components/PerfilUsuario/ReseñasUsuario';

function PerfilUsuario() {
    const [usuarioPerfil, setUsuarioPerfil] = useState(null);

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

    useEffect(() => {
        cargarUsuario();
    }, []);

    const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioActivo"));

    return (
        <div className="perfil-page">

            <Navbar />

            <div className="perfil-content">
                <InfoUsuario
                    usuario={usuarioPerfil}
                    isOwner={String(usuarioActivo?.id) === String(usuarioPerfil?.id)}
                    onUpdate={cargarUsuario} // 🔥 mejor que reload
                />
            </div>

            {/* SECCIONES */}
            <div className="secciones-perfil">
                <SeccionesPerfil />
            </div>


            {/* PROYECTOS */}
            <div>
                <ProyectosRecientes />
            </div>

            {/* RESEÑAS NUEVAS */}
            <div className="perfil-resenas">
                <ResenasUsuario />
            </div>

            <Footer />
        </div>
    );
}

export default PerfilUsuario;