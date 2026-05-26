import { useEffect, useState, useMemo, useCallback } from "react";
import Fetch from "../../services/Fetch";
import { normalizarResenaPerfil } from "../../utils/normalizers";
import { calcularPromedio } from "../../utils/calcularPromedio";
import Paginacion from "../Administrador/Paginacion";
import "../../styles/EstilosPerfilUsuario/ResenasUsuario.css";
import "../../styles/EstilosPerfilUsuario/ResenasPerfilUsuario.css";

function tiempoRelativo(fecha) {
    const diff = Date.now() - new Date(fecha).getTime();
    const dias = Math.floor(diff / 86400000);
    if (dias === 0) return "Hoy";
    if (dias === 1) return "Hace 1 día";
    if (dias < 7)  return `Hace ${dias} días`;
    const semanas = Math.floor(dias / 7);
    if (semanas === 1) return "Hace 1 semana";
    if (semanas < 4)   return `Hace ${semanas} semanas`;
    const meses = Math.floor(dias / 30);
    if (meses === 1) return "Hace 1 mes";
    return `Hace ${meses} meses`;
}

function EstrellasSelectorInput({ value, onChange }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="rp-star-selector">
            {[1, 2, 3, 4, 5].map((s) => (
                <span
                    key={s}
                    className={`rp-star-btn ${s <= (hover || value) ? "rp-star-btn--on" : ""}`}
                    onClick={() => onChange(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                >★</span>
            ))}
        </div>
    );
}

const LIMITE = 6;

function ResenasPerfilUsuario({ usuarioId, isOwner, onCountChange }) {
    const [resenas, setResenas]         = useState([]);
    const [pagina, setPagina]           = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalResenas, setTotalResenas] = useState(0);
    const [cargando, setCargando]       = useState(true);
    const [enviando, setEnviando]       = useState(false);
    const [rating, setRating]           = useState(0);
    const [comentario, setComentario]   = useState("");
    const [error, setError]             = useState("");
    const [exito, setExito]             = useState("");

    const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioActivo") || "null");
    const puedeEscribir = !isOwner && !!usuarioActivo;

    const cargar = useCallback(async (pag = 1) => {
        setCargando(true);
        try {
            const res = await Fetch.getData(`resenas-perfil/usuario/${usuarioId}?page=${pag}&limit=${LIMITE}`);
            const lista = (res?.data || res || []).map(normalizarResenaPerfil);
            const pages = res?.meta?.pages || 1;
            const total = res?.meta?.total ?? lista.length;
            setResenas(lista);
            setPagina(pag);
            setTotalPaginas(pages);
            setTotalResenas(total);
            if (onCountChange) onCountChange(total);
        } catch (e) {
            console.error("Error cargando reseñas de perfil:", e);
        } finally {
            setCargando(false);
        }
    }, [usuarioId]);

    useEffect(() => { cargar(1); }, [cargar]);

    const enviar = async (e) => {
        e.preventDefault();
        setError("");
        setExito("");
        if (rating === 0) { setError("Selecciona una calificación."); return; }
        if (!comentario.trim()) { setError("Escribe un comentario."); return; }
        setEnviando(true);
        try {
            await Fetch.postData("resenas-perfil", {
                id_usuario_receptor: Number(usuarioId),
                calificacion: rating,
                comentarios: comentario.trim(),
            });
            setRating(0);
            setComentario("");
            setExito("¡Reseña enviada!");
            cargar(1);
            setPagina(1);
        } catch (err) {
            setError(err.message || "Error al enviar la reseña.");
        } finally {
            setEnviando(false);
        }
    };

    const promedio = useMemo(() => calcularPromedio(resenas), [resenas]);
    const totalParaDistribucion = resenas.length || 1;

    const distribucion = useMemo(() => {
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        resenas.forEach((r) => dist[r.rating]++);
        return dist;
    }, [resenas]);

    const total = totalParaDistribucion;

    return (
        <div className="resenas-container">

            {/* IZQUIERDA — score */}
            <div className="resenas-score">
                <h2>{promedio}</h2>
                <div className="rp-estrellas-score">
                    {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ color: s <= Math.round(Number(promedio)) ? "#0db9f2" : "#e2e8f0" }}>★</span>
                    ))}
                </div>
                <p>Promedio de {resenas.length} valoraciones</p>
                {[5,4,3,2,1].map((star) => (
                    <div key={star} className="barra">
                        <span>{star}</span>
                        <div className="barra-bg">
                            <div className="barra-fill" style={{ width: `${(distribucion[star] / total) * 100}%` }} />
                        </div>
                        <span className="barra-count">{distribucion[star]}</span>
                    </div>
                ))}
            </div>

            {/* DERECHA */}
            <div className="resenas-list">

                {/* Formulario */}
                {puedeEscribir && (
                    <form className="rp-form" onSubmit={enviar}>
                        <h4 className="rp-form-titulo">Escribir una reseña</h4>
                        <label className="rp-label">Tu calificación</label>
                        <EstrellasSelectorInput value={rating} onChange={setRating} />
                        <label className="rp-label">Tu opinión</label>
                        <textarea
                            className="rp-textarea"
                            placeholder={`Cuéntanos tu experiencia...`}
                            value={comentario}
                            onChange={e => setComentario(e.target.value)}
                            rows={4}
                        />
                        {error  && <p className="rp-msg rp-msg--error">{error}</p>}
                        {exito  && <p className="rp-msg rp-msg--ok">{exito}</p>}
                        <button className="rp-btn-enviar" type="submit" disabled={enviando}>
                            {enviando ? "Enviando..." : "Enviar reseña ▶"}
                        </button>
                    </form>
                )}

                {/* Lista */}
                <h4>Reseñas de Clientes</h4>

                {cargando && resenas.length === 0 ? (
                    <p style={{ color: "#94a3b8" }}>Cargando...</p>
                ) : resenas.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
                        {isOwner ? "Aún no tienes reseñas de perfil." : "Este usuario aún no tiene reseñas."}
                    </p>
                ) : (
                    resenas.map((r) => (
                        <div key={r.id} className="resena-card rp-resena-card">
                            <div className="rp-card-header">
                                <div className="rp-avatar">
                                    {r.autor?.img
                                        ? <img src={r.autor.img} alt={r.autor.nombre} />
                                        : <i className="fa-solid fa-user" />
                                    }
                                </div>
                                <div className="rp-card-meta">
                                    <span className="rp-autor-nombre">{r.autor?.nombre || "Usuario"}</span>
                                    <span className="rp-fecha">{tiempoRelativo(r.fecha)}</span>
                                </div>
                                <div className="resena-stars rp-card-stars">
                                    {[1,2,3,4,5].map(s => (
                                        <span key={s} style={{ color: s <= r.rating ? "#0db9f2" : "#e2e8f0" }}>★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="resena-text">"{r.comentario}"</p>
                        </div>
                    ))
                )}

                {totalPaginas > 1 && (
                    <div style={{ marginTop: "24px" }}>
                        <Paginacion
                            pagina={pagina}
                            totalPaginas={totalPaginas}
                            onChange={p => cargar(p)}
                            totalItems={totalResenas}
                            itemsMostrados={resenas.length}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResenasPerfilUsuario;
