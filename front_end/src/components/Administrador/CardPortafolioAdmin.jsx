import PreviewComponentes from '../PlantillaTalentos/PreviewComponentes';

function CardPortafolioAdmin({ portafolio, nombrePropietario, onVer, onEliminar }) {
    const estado    = portafolio.pdf ? 'Publicado' : 'Pendiente';
    const publicado = estado === 'Publicado';
    const cats      = (portafolio.categorias || []).slice(0, 2);

    return (
        <div className="pfa-card">
            {/* Preview thumbnail */}
            <div className="pfa-thumb" onClick={onVer}>
                <PreviewComponentes componentes={portafolio.componentes || []} />
                <div className="pfa-thumb-overlay">
                    <span className="pfa-thumb-ver">
                        <span className="material-symbols-outlined">visibility</span>
                        Ver portafolio
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="pfa-body">
                <div className="pfa-body-top">
                    <p className="pfa-titulo">{portafolio.titulo || 'Sin título'}</p>
                    <span className={`pfa-estado ${publicado ? 'pfa-estado--pub' : 'pfa-estado--pend'}`}>
                        {estado}
                    </span>
                </div>

                <p className="pfa-propietario">
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>person</span>
                    {nombrePropietario}
                </p>

                {cats.length > 0 && (
                    <div className="pfa-cats">
                        {cats.map(cat => <span key={cat} className="pfa-cat">{cat}</span>)}
                        {portafolio.categorias.length > 2 && (
                            <span className="pfa-cat pfa-cat--more">+{portafolio.categorias.length - 2}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Acciones */}
            <div className="pfa-acciones">
                <button className="pfa-btn pfa-btn--ver" onClick={onVer} title="Ver portafolio">
                    <span className="material-symbols-outlined">open_in_new</span>
                    Ver
                </button>
                <button className="pfa-btn pfa-btn--del" onClick={onEliminar} title="Eliminar portafolio">
                    <span className="material-symbols-outlined">delete</span>
                    Eliminar
                </button>
            </div>
        </div>
    );
}

export default CardPortafolioAdmin;
