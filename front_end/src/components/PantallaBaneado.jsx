import Fetch from '../services/Fetch'

function PantallaBaneado({ razon, fechaExpira }) {
    const expiraTexto = fechaExpira
        ? new Date(fechaExpira).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : null

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            <div style={{
                background: '#fff', borderRadius: 24, padding: '48px 40px',
                maxWidth: 480, width: '100%', textAlign: 'center',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
            }}>
                {/* Icono */}
                <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: '#fef2f2', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 24px',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#ef4444' }}>block</span>
                </div>

                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
                    Cuenta suspendida
                </h1>
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
                    Tu cuenta ha sido suspendida temporalmente por el equipo de administración.
                </p>

                {/* Razón */}
                {razon && (
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fecaca',
                        borderRadius: 12, padding: '14px 20px', marginBottom: 16, textAlign: 'left',
                    }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 4px' }}>Motivo</p>
                        <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{razon}</p>
                    </div>
                )}

                {/* Expiración */}
                <div style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: 12, padding: '14px 20px', marginBottom: 32, textAlign: 'left',
                }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 4px' }}>
                        {expiraTexto ? 'Suspensión hasta' : 'Duración'}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {expiraTexto || 'Indefinida'}
                    </p>
                </div>

                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 24px' }}>
                    Si crees que esto es un error, contacta al equipo de soporte.
                </p>

                <button
                    onClick={() => Fetch.logoutClient()}
                    style={{
                        width: '100%', padding: '12px', borderRadius: 12,
                        border: 'none', background: '#0f172a', color: '#fff',
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}

export default PantallaBaneado
