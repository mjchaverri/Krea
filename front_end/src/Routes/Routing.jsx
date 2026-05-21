import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Inicio from "../pages/Inicio"
import Principal from "../pages/Principal"
import PerfilUsuario from "../pages/PerfilUsuario"
import PerfilVisitante from "../pages/PerfilVisitante"
import PaginaContacto from "../pages/PaginaContacto"
import SobreNosotros from "../pages/SobreNosotros"
import PaguinaIniciar from "../pages/PaguinaIniciar"
import PaginaRegistro from "../pages/PaginaRegistro"
import Portafolio from "../pages/Portafolio"
import Admin from "../pages/Admin"
import Funcionalidad from "../pages/Funcionalidad"
import RutaPrivada from "./RutaPrivada"
import PaginaConsejos from "../pages/PaginaConsejos"
import RutaPrivadaAdmin from "./RutaPrivadaAdmin"
import TodosProyectos from "../pages/TodosProyectos"
import FormularioConvo from "../pages/FormularioConvo"
import PaginaComunidades from "../pages/PaginaComunidades"

function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/Iniciar" element={<PaguinaIniciar />} />
                <Route path="/Registro" element={<PaginaRegistro />} />
                <Route path="/principal" element={<RutaPrivada children={<Principal />} />} />
                <Route path="/perfil-usuario" element={<RutaPrivada children={<PerfilUsuario />} />} />
                <Route path="/pagina-contacto" element={<PaginaContacto />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="Iniciar" element={<PaguinaIniciar />} />
                <Route path="/Registro" element={<PaginaRegistro />} />
                <Route path="/portafolio" element={<RutaPrivada children={<Portafolio />} />} />
                <Route path="/Admin" element={<RutaPrivadaAdmin children={<Admin />} />} />
                <Route path="/Funcionalidad" element={<RutaPrivada children={<Funcionalidad />} />} />
                <Route path="/Consejos" element={<RutaPrivada children={<PaginaConsejos />} />} />
                <Route path="/todos-proyectos" element={<TodosProyectos />} />
                <Route path="/perfil/:usuarioId" element={<PerfilVisitante />} />
                <Route path="/FormularioConvo" element={<RutaPrivadaAdmin children={<FormularioConvo />} />} />
                <Route path="/comunidades" element={<RutaPrivada children={<PaginaComunidades />} />} />
            </Routes>
        </Router>
    )
}
export default Routing
