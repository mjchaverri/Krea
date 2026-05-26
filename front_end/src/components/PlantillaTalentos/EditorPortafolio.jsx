import { useEffect } from "react";
import NavBarEditor from "./NavBarEditor";
import BarraHerramientas from "./BarraHerramientas";
import SidebarTalentos from "./SidebarTalentos";
import Lienzo from "./Lienzo";
import ComponentePortafolio from "./ComponentePortafolio";
import ModalVistaPrevia from "./ModalVistaPrevia";
import Estructura1 from "./Estructura1";
import Estructura1_1 from "./Estructura1_1";
import Estructura1_2 from "./Estructura1_2";
import Estructura1_3 from "./Estructura1_3";
import Estructura1_4 from "./Estructura1_4";
import GrillaDoble from "./GrillaDoble";
import GrillaTriple from "./GrillaTriple";
import Grilla1_2_Izda from "./Grilla1_2_Izda";
import { ImageProvider } from "./HookImagenCloudinary";
import { usePortafolioEditor } from "./usePortafolioEditor";
import "../../styles/PlantillaTalentos/Portafolio.css";
import ChatBotBubble from "./ChatBotBubble";

const MAPA = {
    Estructura1, Estructura1_1, Estructura1_2, Estructura1_3, Estructura1_4,
    GrillaDoble, GrillaTriple, Grilla1_2_Izda,
};

function EditorPortafolio() {
    const {
        componentes,
        tituloProyecto,
        descripcionProyecto,
        categorias,
        activeElement,
        setActiveElement,
        showPreviewModal,
        showPdfCapture,
        pdfCaptureRef,
        lienzoRef,
        indiceRef,
        historialRef,
        activarEditor,
        deshacer,
        rehacer,
        toggleComponente,
        eliminarComponente,
        moverComponente,
        updateComponentData,
        aplicarChatbot,
        handlePreview,
        closePreview,
        guardarPortafolio,
        descargarPDF,
        setTituloProyecto,
        setDescripcionProyecto,
        setCategorias,
    } = usePortafolioEditor();

    // ── Aplicar directamente al lienzo desde el ChatBot KreIA ──────────────────────────
    useEffect(() => {
        const handleKreiaPreview = (e) => {
            const data = e.detail;
            if (!data?.componentesSeleccionados?.length) return;
            aplicarChatbot(data.componentesSeleccionados);
        };
        window.addEventListener("kreia-preview", handleKreiaPreview);
        return () => window.removeEventListener("kreia-preview", handleKreiaPreview);
    }, [aplicarChatbot]);

    return (
        <>
            <NavBarEditor guardar={guardarPortafolio} onPreview={handlePreview} onDescargar={descargarPDF} />

            <BarraHerramientas
                activeElement={activeElement}
                onDeshacer={deshacer}
                onRehacer={rehacer}
                puedeDeshacer={indiceRef.current > 0}
                puedeRehacer={indiceRef.current < historialRef.current.length - 1}
            />

            <ImageProvider>
                <div className="portafolio-container" onClick={() => setActiveElement(null)}>
                    <div className="layout">

                        <div className="sidebar-container">
                            <SidebarTalentos
                                actEst1={() => toggleComponente("Estructura1")}
                                actEst1_1={() => toggleComponente("Estructura1_1")}
                                actEst1_2={() => toggleComponente("Estructura1_2")}
                                actEst1_3={() => toggleComponente("Estructura1_3")}
                                actEst1_4={() => toggleComponente("Estructura1_4")}
                                actGrillaDoble={() => toggleComponente("GrillaDoble")}
                                actGrillaTriple={() => toggleComponente("GrillaTriple")}
                                actGrilla1_2_Izda={() => toggleComponente("Grilla1_2_Izda")}
                            />
                        </div>

                        <div className="lienzo-container" ref={lienzoRef}>
                            <Lienzo
                                tituloProyecto={tituloProyecto}
                                descripcionProyecto={descripcionProyecto}
                                categorias={categorias}
                                onTituloChange={(e) => setTituloProyecto(e.target.value)}
                                onDescripcionChange={(e) => setDescripcionProyecto(e.target.value)}
                                onCategoriasChange={(nuevas) => setCategorias(nuevas)}
                                childrenEstructura={
                                    <>
                                        {componentes.map((comp, index) => (
                                            <ComponentePortafolio
                                                key={comp.id || index}
                                                comp={comp}
                                                activeElement={activeElement}
                                                onActivate={activarEditor}
                                                onUpdate={updateComponentData}
                                                onEliminar={eliminarComponente}
                                                onMover={moverComponente}
                                                isFirst={index === 0}
                                                isLast={index === componentes.length - 1}
                                            />
                                        ))}
                                    </>
                                }
                            />
                        </div>

                    </div>
                </div>
            </ImageProvider>

            {/* Div off-screen para captura de PDF con html2canvas — sin overflow ni clipping */}
            {showPdfCapture && (
                <div
                    ref={pdfCaptureRef}
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "-200vw",
                        width: "860px",
                        background: "#ffffff",
                        overflow: "visible",
                        zIndex: -9999,
                    }}
                >
                    <Lienzo
                        tituloProyecto={tituloProyecto}
                        descripcionProyecto={descripcionProyecto}
                        categorias={categorias}
                        childrenEstructura={
                            <>
                                {componentes.map((comp) => {
                                    const Comp = MAPA[comp.type];
                                    if (!Comp) return null;
                                    return (
                                        <Comp
                                            key={comp.id}
                                            initialData={comp.data}
                                            onActivate={() => {}}
                                            activeElement={null}
                                            onUpdate={() => {}}
                                        />
                                    );
                                })}
                            </>
                        }
                    />
                </div>
            )}

            <ModalVistaPrevia
                visible={showPreviewModal}
                componentes={componentes}
                tituloProyecto={tituloProyecto}
                descripcionProyecto={descripcionProyecto}
                categorias={categorias}
                onClose={closePreview}
            />

            <ChatBotBubble />
        </>
    );
}

export default EditorPortafolio;
