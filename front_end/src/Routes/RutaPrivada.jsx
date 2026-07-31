import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PantallaBaneado from '../components/PantallaBaneado'
import { isDemoMode } from '../mock/mockEngine'

const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token')
    const [banInfo, setBanInfo] = useState(null)  // null = sin verificar | false = libre | { razon, expira }
    const [verificado, setVerificado] = useState(false)

    useEffect(() => {
        if (!token) { setVerificado(true); return }
        if (isDemoMode()) { setBanInfo(false); setVerificado(true); return }

        // Verificar estado del ban via API en cada visita a ruta privada
        fetch('http://localhost:3000/usuarios/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(json => {
                const u = json.data
                if (u?.bloqueado) {
                    setBanInfo({ razon: u.razon_ban, expira: u.fecha_ban_expira })
                    // Actualizar localStorage para consistencia
                    try {
                        const stored = JSON.parse(localStorage.getItem('UsuarioActivo') || '{}')
                        localStorage.setItem('UsuarioActivo', JSON.stringify({
                            ...stored, bloqueado: true,
                            razon_ban: u.razon_ban,
                            fecha_ban_expira: u.fecha_ban_expira,
                        }))
                    } catch { }
                } else {
                    setBanInfo(false)
                }
            })
            .catch(() => setBanInfo(false))  // Si falla el check, dejar pasar
            .finally(() => setVerificado(true))
    }, [token])

    if (!token) return <Navigate to="/" replace />

    // Mientras se verifica, mostrar nada (breve)
    if (!verificado) return null

    if (banInfo) {
        return <PantallaBaneado razon={banInfo.razon} fechaExpira={banInfo.expira} />
    }

    return children
}

export default RutaPrivada
