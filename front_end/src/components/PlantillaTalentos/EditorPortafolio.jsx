import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
    Estructura1,
    Estructura1_1,
    Estructura1_2,
    Estructura1_3,
    Estructura1_4,
    GrillaDoble,
    GrillaTriple,
    Grilla1_2_Izda,
};

function EditorPortafolio() {

    const location = useLocation();
    const portfolioId = location.state?.proyectoEditando?.id ?? null;

    const {
        componentes,
        tituloProyecto,
        descripcionProyecto,
        categorias,
        activeElement,
        setActiveElement,
        showPreviewModal,
        showPdfCapture,
        mostrarPlantillasMobile,
        setMostrarPlantillasMobile,
        mostrarOpcionesMobile,
        setMostrarOpcionesMobile,
        cerrarHojasMobile,
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

    // Cierra las hojas móviles al entrar al editor y también cuando el
    // navegador restaura la página desde su caché de atrás/adelante
    // (bfcache), que congela y repone el estado de React tal como quedó
    // la última vez — incluida una hoja que se había dejado abierta.
    useEffect(() => {
        cerrarHojasMobile();
        const handlePageShow = (e) => {
            if (e.persisted) cerrarHojasMobile();
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    // =========================================
    // ESCUCHAR PORTAFOLIO GENERADO POR KREIA
    // =========================================

    useEffect(() => {

        const handleKreiaPreview = (e) => {

            console.log(
                "EVENTO KREIA RECIBIDO:",
                e.detail
            );

            const portfolio = e.detail;

            // Validar array
            if (
                !portfolio ||
                !Array.isArray(portfolio)
            ) {
                return;
            }

            // Aplicar directamente al lienzo
            aplicarChatbot(portfolio);
        };

        window.addEventListener(
            "kreia-preview",
            handleKreiaPreview
        );

        return () => {
            window.removeEventListener(
                "kreia-preview",
                handleKreiaPreview
            );
        };

    }, [aplicarChatbot]);

    return (
        <>
            <NavBarEditor
                guardar={guardarPortafolio}
                onPreview={handlePreview}
                onDescargar={descargarPDF}
            />

            {/* Escritorio: barra completa (ver Portafolio.css la oculta en mobile) */}
            <BarraHerramientas
                vista="completa"
                activeElement={activeElement}
                onDeshacer={deshacer}
                onRehacer={rehacer}
                puedeDeshacer={indiceRef.current > 0}
                puedeRehacer={
                    indiceRef.current <
                    historialRef.current.length - 1
                }
            />

            {/* Mobile: hoja de Opciones (fondo/imagen + formato de texto),
                anclada arriba de la barra inferior, se abre desde su ícono
                o desde la flechita del ícono Texto */}
            <div
                className={`barra-sheet-mobile${mostrarOpcionesMobile ? " barra-sheet-mobile--abierta" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <BarraHerramientas vista="opciones" activeElement={activeElement} />
            </div>

            <ImageProvider>

                <div
                    className="portafolio-container"
                    onClick={() => {
                        setActiveElement(null)
                        cerrarHojasMobile()
                    }}
                >

                    <div className="layout">

                        <div
                            className={`sidebar-container${mostrarPlantillasMobile ? " sidebar-container--mobile-abierto" : ""}`}
                            onClick={(e) => e.stopPropagation()}
                        >

                            <SidebarTalentos
                                actEst1={() =>
                                    toggleComponente("Estructura1")
                                }

                                actEst1_1={() =>
                                    toggleComponente("Estructura1_1")
                                }

                                actEst1_2={() =>
                                    toggleComponente("Estructura1_2")
                                }

                                actEst1_3={() =>
                                    toggleComponente("Estructura1_3")
                                }

                                actEst1_4={() =>
                                    toggleComponente("Estructura1_4")
                                }

                                actGrillaDoble={() =>
                                    toggleComponente("GrillaDoble")
                                }

                                actGrillaTriple={() =>
                                    toggleComponente("GrillaTriple")
                                }

                                actGrilla1_2_Izda={() =>
                                    toggleComponente("Grilla1_2_Izda")
                                }
                            />
                        </div>

                        <div
                            className="lienzo-container"
                            ref={lienzoRef}
                        >

                            <Lienzo
                                escalarMobile

                                tituloProyecto={tituloProyecto}

                                descripcionProyecto={descripcionProyecto}

                                categorias={categorias}

                                onTituloChange={(e) =>
                                    setTituloProyecto(e.target.value)
                                }

                                onDescripcionChange={(e) =>
                                    setDescripcionProyecto(e.target.value)
                                }

                                onCategoriasChange={(nuevas) =>
                                    setCategorias(nuevas)
                                }

                                childrenEstructura={
                                    <>
                                        {componentes.map(
                                            (comp, index) => (

                                                <ComponentePortafolio
                                                    key={comp.id || index}

                                                    comp={comp}

                                                    activeElement={activeElement}

                                                    onActivate={activarEditor}

                                                    onUpdate={updateComponentData}

                                                    onEliminar={eliminarComponente}

                                                    onMover={moverComponente}

                                                    isFirst={index === 0}

                                                    isLast={
                                                        index ===
                                                        componentes.length - 1
                                                    }
                                                />
                                            )
                                        )}
                                    </>
                                }
                            />
                        </div>
                    </div>
                </div>
            </ImageProvider>

            {/* Barra inferior — solo visible en mobile (ver Portafolio.css) */}
            <div className="editor-bottombar">
                <button
                    className="editor-bottombar__btn"
                    title="Deshacer"
                    disabled={indiceRef.current <= 0}
                    onClick={deshacer}
                >
                    <i className="fa-solid fa-rotate-left"></i>
                    <span>Deshacer</span>
                </button>

                <button
                    className="editor-bottombar__btn"
                    title="Rehacer"
                    disabled={indiceRef.current >= historialRef.current.length - 1}
                    onClick={rehacer}
                >
                    <i className="fa-solid fa-rotate-right"></i>
                    <span>Rehacer</span>
                </button>

                <button
                    className={`editor-bottombar__btn${mostrarPlantillasMobile ? " editor-bottombar__btn--activo" : ""}`}
                    onClick={() => {
                        setActiveElement(null)
                        setMostrarOpcionesMobile(false)
                        setMostrarPlantillasMobile(v => !v)
                    }}
                >
                    <i className="fa-solid fa-shapes"></i>
                    <span>Plantillas</span>
                </button>

                <button
                    className={`editor-bottombar__btn${mostrarOpcionesMobile ? " editor-bottombar__btn--activo" : ""}`}
                    disabled={!activeElement}
                    onClick={() => {
                        setMostrarPlantillasMobile(false)
                        setMostrarOpcionesMobile(v => !v)
                    }}
                >
                    <i className="fa-solid fa-sliders"></i>
                    <span>Opciones</span>
                </button>
            </div>

            {/* PDF */}

            {showPdfCapture && (
                <div
                    ref={pdfCaptureRef}
                    aria-hidden="true"
                    className="pvw-preview-mode"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "-200vw",
                        width: "860px",
                        background: "#FFFFFF",
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

                                    const Comp =
                                        MAPA[comp.type];

                                    if (!Comp) return null;

                                    return (
                                        <Comp
                                            key={comp.id}

                                            initialData={comp.data}

                                            onActivate={() => { }}

                                            activeElement={null}

                                            onUpdate={() => { }}
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

            <ChatBotBubble portfolioId={portfolioId} />
        </>
    );
}

export default EditorPortafolio;