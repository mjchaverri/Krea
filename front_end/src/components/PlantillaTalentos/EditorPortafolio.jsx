import NavBarEditor from "./NavBarEditor";
import BarraHerramientas from "./BarraHerramientas";
import SidebarTalentos from "./SidebarTalentos";
import Lienzo from "./Lienzo";
import ComponentePortafolio from "./ComponentePortafolio";
import ModalVistaPrevia from "./ModalVistaPrevia";
import { ImageProvider } from "./HookImagenCloudinary";
import { usePortafolioEditor } from "./usePortafolioEditor";
import "../../styles/PlantillaTalentos/Portafolio.css";

function EditorPortafolio() {
    const {
        componentes,
        tituloProyecto,
        descripcionProyecto,
        categorias,
        activeElement,
        setActiveElement,
        showPreviewModal,
        previewImage,
        lienzoRef,
        indiceRef,
        historialRef,
        activarEditor,
        deshacer,
        rehacer,
        toggleComponente,
        eliminarComponente,
        updateComponentData,
        handlePreview,
        closePreview,
        guardarPortafolio,
        setTituloProyecto,
        setDescripcionProyecto,
        setCategorias,
    } = usePortafolioEditor();

    return (
        <>
            <NavBarEditor guardar={guardarPortafolio} onPreview={handlePreview} />

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
                                            />
                                        ))}
                                    </>
                                }
                            />
                        </div>

                    </div>
                </div>
            </ImageProvider>

            <ModalVistaPrevia
                visible={showPreviewModal}
                imagen={previewImage}
                onClose={closePreview}
            />
        </>
    );
}

export default EditorPortafolio;
