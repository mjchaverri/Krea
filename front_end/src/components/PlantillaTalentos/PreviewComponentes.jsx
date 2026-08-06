import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import Estructura1 from './Estructura1';
import Estructura1_1 from './Estructura1_1';
import Estructura1_2 from './Estructura1_2';
import Estructura1_3 from './Estructura1_3';
import Estructura1_4 from './Estructura1_4';
import GrillaDoble from './GrillaDoble';
import GrillaTriple from './GrillaTriple';
import Grilla1_2_Izda from './Grilla1_2_Izda';
import '../../styles/PlantillaTalentos/PreviewComponentes.css';

const MAPA = {
    Estructura1, Estructura1_1, Estructura1_2, Estructura1_3, Estructura1_4,
    GrillaDoble, GrillaTriple, Grilla1_2_Izda,
};

const CANVAS_WIDTH = 860;
const noop = () => {};

// Las 7 plantillas reales comparten min-height:400px a 860px de ancho, así
// que la proporción 860:400 es constante — usamos aspect-ratio en CSS para
// la altura en vez de medirla con JS, evitando cualquier condición de
// carrera entre el cálculo de escala y el render (la causa de las cajas
// vacías/descuadradas que aparecían en grillas de varias columnas).
function PreviewComponentes({ componentes }) {
    const outerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const primeros = useMemo(() => (componentes || []).slice(0, 1), [componentes]);

    // Recalculate scale whenever outer width changes
    useLayoutEffect(() => {
        const outer = outerRef.current;
        if (!outer) return;

        const applyScale = () => {
            const outerW = outer.offsetWidth;
            if (!outerW) return;
            setScale(outerW / CANVAS_WIDTH);
        };

        applyScale();
        const ro = new ResizeObserver(applyScale);
        ro.observe(outer);
        // Red de seguridad: si la primera medición cae en 0 (grillas con
        // varias tarjetas montando a la vez), reintenta en el próximo frame.
        const raf = requestAnimationFrame(applyScale);
        return () => {
            ro.disconnect();
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="prevc-outer" ref={outerRef}>
            <div
                className="prevc-inner"
                style={{ transform: `scale(${scale})` }}
            >
                {primeros.length === 0 && <div className="prevc-empty" />}
                {primeros.map((comp, i) => {
                    const Comp = MAPA[comp.type];
                    if (!Comp) return <div key={i} className="prevc-empty" />;
                    return (
                        <Comp
                            key={i}
                            onActivate={noop}
                            activeElement={null}
                            initialData={comp.data}
                            onUpdate={noop}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default PreviewComponentes;
