import "../../styles/PlantillaTalentos/NavBarEditor.css"

function NavBarEditor({ guardar, onPreview }) {
    const usuario = JSON.parse(localStorage.getItem("UsuarioActivo") || "{}");
    const fotoPerfil = usuario?.img || "";

    return (
        <nav className="navbar-editor">

            <div className="navbar-editor__left">
                <span className="navbar-editor__logo" onClick={() => window.location.href = "/principal"}>Krea</span>
                <div className="navbar-editor__divider" />
                <span className="navbar-editor__subtitle">Editor de portafolios</span>
            </div>

            <div className="navbar-editor__center">
                <a href="/principal">Inicio</a>
                <a href="/perfil-usuario">Mis proyectos</a>
            </div>

            <div className="navbar-editor__right">
                <button className="btn-preview" onClick={onPreview}>
                    <i className="fa-solid fa-eye"></i> Vista previa
                </button>

                <button className="btn-save" onClick={guardar}>
                    <i className="fa-solid fa-floppy-disk"></i> Guardar portafolio
                </button>

                <a href="/perfil-usuario" className="avatar-link" title="Volver al perfil">
                    <img src={fotoPerfil} alt="Perfil" className="avatar" />
                </a>
            </div>

        </nav>
    )
}

export default NavBarEditor
