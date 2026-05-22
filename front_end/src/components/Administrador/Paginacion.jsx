function Paginacion({ pagina, totalPaginas, onChange, totalItems, itemsMostrados }) {
    if (totalPaginas <= 1) return (
        <p className="text-sm text-slate-500">
            Mostrando <span className="font-medium">{itemsMostrados}</span> de <span className="font-medium">{totalItems}</span> resultados
        </p>
    )

    const paginas = []
    const delta = 1
    const left  = pagina - delta
    const right = pagina + delta

    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= left && i <= right)) {
            paginas.push(i)
        }
    }

    const conEllipsis = []
    let prev = null
    for (const p of paginas) {
        if (prev && p - prev > 1) conEllipsis.push('...')
        conEllipsis.push(p)
        prev = p
    }

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
                Mostrando <span className="font-medium">{itemsMostrados}</span> de <span className="font-medium">{totalItems}</span> resultados
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange(pagina - 1)}
                    disabled={pagina === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                    &lt;
                </button>

                {conEllipsis.map((p, i) =>
                    p === '...'
                        ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">…</span>
                        : <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors
                                ${pagina === p
                                    ? 'bg-sky-500 text-white border border-sky-500'
                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {p}
                        </button>
                )}

                <button
                    onClick={() => onChange(pagina + 1)}
                    disabled={pagina === totalPaginas}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                    &gt;
                </button>
            </div>
        </div>
    )
}

export default Paginacion
