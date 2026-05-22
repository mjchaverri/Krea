import { Navigate } from "react-router-dom"

const RutaPrivadaAdmin = ({ children }) => {
    const token   = localStorage.getItem("token")
    const rol     = localStorage.getItem("rol")

    if (!token || rol !== "Admin") return <Navigate to="/" replace />
    return children
}
export default RutaPrivadaAdmin