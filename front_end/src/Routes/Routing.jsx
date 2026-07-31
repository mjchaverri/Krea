import { createBrowserRouter, RouterProvider } from "react-router-dom"
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
import RutaPrivada from "./RutaPrivada"
import PaginaConsejos from "../pages/PaginaConsejos"
import RutaPrivadaAdmin from "./RutaPrivadaAdmin"
import TodosProyectos from "../pages/TodosProyectos"
import FormularioConvo from "../pages/FormularioConvo"
import PaginaComunidades from "../pages/PaginaComunidades"

const router = createBrowserRouter([
    { path: "/",               element: <Inicio /> },
    { path: "/Iniciar",        element: <PaguinaIniciar /> },
    { path: "/Registro",       element: <PaginaRegistro /> },
    { path: "/principal",      element: <RutaPrivada><Principal /></RutaPrivada> },
    { path: "/perfil-usuario", element: <RutaPrivada><PerfilUsuario /></RutaPrivada> },
    { path: "/pagina-contacto",element: <PaginaContacto /> },
    { path: "/sobre-nosotros", element: <SobreNosotros /> },
    { path: "/portafolio",     element: <RutaPrivada><Portafolio /></RutaPrivada> },
    { path: "/Admin",          element: <RutaPrivadaAdmin><Admin /></RutaPrivadaAdmin> },
    { path: "/Consejos",       element: <RutaPrivada><PaginaConsejos /></RutaPrivada> },
    { path: "/todos-proyectos",element: <TodosProyectos /> },
    { path: "/perfil/:usuarioId", element: <PerfilVisitante /> },
    { path: "/FormularioConvo",element: <RutaPrivadaAdmin><FormularioConvo /></RutaPrivadaAdmin> },
    { path: "/comunidades",    element: <RutaPrivada><PaginaComunidades /></RutaPrivada> },
])

function Routing() {
    return <RouterProvider router={router} />
}
export default Routing
