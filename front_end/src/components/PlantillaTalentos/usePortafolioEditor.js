import { useState, useEffect, useRef } from "react";
import { useLocation, useBlocker } from "react-router-dom";
import { generarPDFBlob } from "../../extras/pdfPortafolio";
import Fetch from "../../services/Fetch";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { isDemoMode, archivoABase64 } from "../../mock/mockEngine";

export function usePortafolioEditor() {
    const location = useLocation();
    const proyectoEditando = location.state?.proyectoEditando ?? null;

    const [componentes, setComponentes] = useState([]);
    const [tituloProyecto, setTituloProyecto] = useState("");
    const [descripcionProyecto, setDescripcionProyecto] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [activeElement, setActiveElement] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showPdfCapture, setShowPdfCapture] = useState(false);
    // Paneles como hoja inferior en mobile (ver Portafolio.css / BarraHerramientas)
    const [mostrarPlantillasMobile, setMostrarPlantillasMobile] = useState(false);
    const [mostrarOpcionesMobile, setMostrarOpcionesMobile] = useState(false);

    // Cierra cualquier hoja móvil abierta (plantillas / opciones)
    const cerrarHojasMobile = () => {
        setMostrarPlantillasMobile(false);
        setMostrarOpcionesMobile(false);
    };
    const pdfCaptureRef = useRef(null);
    const isEditMode = !!proyectoEditando?.id;

    const [esDirty, setEsDirty] = useState(false);
    const inicializadoRef = useRef(false);

    const historialRef = useRef([]);
    const indiceRef = useRef(-1);
    const saltarRef = useRef(false);
    const lienzoRef = useRef();

    const activarEditor = (e, data) => {
        e.stopPropagation();
        setActiveElement({ ...data });
        cerrarHojasMobile();
    };

    // Historial undo/redo
    useEffect(() => {
        if (saltarRef.current) { saltarRef.current = false; return; }
        historialRef.current = historialRef.current.slice(0, indiceRef.current + 1);
        historialRef.current.push(JSON.parse(JSON.stringify(componentes)));
        indiceRef.current = historialRef.current.length - 1;
    }, [componentes]);

    // Persistencia localStorage — guardar
    useEffect(() => {
        localStorage.setItem("portafolio", JSON.stringify({ componentes, tituloProyecto, descripcionProyecto, categorias }));
    }, [componentes, tituloProyecto, descripcionProyecto, categorias]);

    // Persistencia localStorage — cargar (o cargar portafolio existente para editar)
    useEffect(() => {
        if (proyectoEditando) {
            const comps = proyectoEditando.componentes?.length > 0
                ? proyectoEditando.componentes
                : [];

            historialRef.current = [JSON.parse(JSON.stringify(comps))];
            indiceRef.current = 0;
            saltarRef.current = true;
            setComponentes(comps);
            setTituloProyecto(proyectoEditando.titulo || "");
            setDescripcionProyecto(proyectoEditando.descripcion || "");
            setCategorias(proyectoEditando.categorias || []);
            localStorage.setItem("portafolioId", String(proyectoEditando.id));
        } else {
            const data = JSON.parse(localStorage.getItem("portafolio"));
            if (data) {
                const comps = data.componentes || [];
                historialRef.current = [JSON.parse(JSON.stringify(comps))];
                indiceRef.current = 0;
                saltarRef.current = true;
                setComponentes(comps);
                setTituloProyecto(data.tituloProyecto || "");
                setDescripcionProyecto(data.descripcionProyecto || "");
                setCategorias(data.categorias || []);
            }
        }
        // Marcar como inicializado después de que React procese los cambios de estado
        setTimeout(() => { inicializadoRef.current = true; }, 0);
    }, []);

    // Marcar cambios pendientes de guardar (solo después de la carga inicial)
    useEffect(() => {
        if (!inicializadoRef.current) return;
        setEsDirty(true);
    }, [componentes, tituloProyecto, descripcionProyecto, categorias]);

    // Advertencia al cerrar/recargar la pestaña del navegador
    useEffect(() => {
        const handler = (e) => {
            if (!esDirty) return;
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [esDirty]);

    // Bloqueo de navegación interna con confirmación
    const bloqueador = useBlocker(esDirty);
    useEffect(() => {
        if (bloqueador.state !== 'blocked') return;
        Swal.fire({
            title: '¿Salir sin guardar?',
            text: 'Tienes cambios sin guardar. Si sales ahora se perderán.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Quedarme',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#0ea5e9',
        }).then(result => {
            if (result.isConfirmed) bloqueador.proceed();
            else bloqueador.reset();
        });
    }, [bloqueador.state]);

    const deshacer = () => {
        if (indiceRef.current <= 0) return;
        saltarRef.current = true;
        indiceRef.current--;
        setComponentes(JSON.parse(JSON.stringify(historialRef.current[indiceRef.current])));
    };

    const rehacer = () => {
        if (indiceRef.current >= historialRef.current.length - 1) return;
        saltarRef.current = true;
        indiceRef.current++;
        setComponentes(JSON.parse(JSON.stringify(historialRef.current[indiceRef.current])));
    };

    const toggleComponente = (nombre) => {
        const nuevoComp = {
            id: crypto.randomUUID(),
            type: nombre,
            data: {
                texto: "", colorTexto: "#1a202c", colorFondo: "",
                imageUrl: "", fontSize: "16px", bold: false,
                italic: false, align: "left", textPosition: "center",
                childColorFondo: "", childImageUrl: ""
            }
        };
        setComponentes((prev) => [...prev, nuevoComp]);
        cerrarHojasMobile();
    };

    const eliminarComponente = (id) => {
        setComponentes((prev) => prev.filter((c) => c.id !== id));
    };

    const moverComponente = (id, direction) => {
        setComponentes(prev => {
            const idx = prev.findIndex(c => c.id === id);
            if (idx === -1) return prev;
            if (direction === 'up' && idx === 0) return prev;
            if (direction === 'down' && idx === prev.length - 1) return prev;
            const next = [...prev];
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
            [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
            return next;
        });
    };

    const updateComponentData = (id, newData) => {
        setComponentes(prev => prev.map(c =>
            c.id === id ? { ...c, data: { ...c.data, ...newData } } : c
        ));
    };

    const aplicarChatbot = (componentesPreformateados) => {
        setComponentes(componentesPreformateados);
    };

    const subirArchivoCloudinary = async (archivo, type = "raw") => {
        if (isDemoMode()) {
            try {
                return await archivoABase64(archivo);
            } catch {
                return null;
            }
        }
        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("upload_preset", "portfolios");
        formData.append("resource_type", type);
        const res = await fetch(`https://api.cloudinary.com/v1_1/dyy1yqvbv/${type}/upload`, {
            method: "POST", body: formData
        });
        if (!res.ok) return null;
        return (await res.json()).secure_url;
    };

    // Recorre recursivamente el "data" de cada componente y junta todas las
    // URLs de imagen (imageUrl/childImageUrl), sin importar si el shape es
    // plano (Estructura1) o anidado (fondo/bloque1/bloque2/content, etc.).
    const extraerImagenes = (comps) => {
        const urls = new Set();
        const visitar = (obj) => {
            if (!obj || typeof obj !== "object") return;
            for (const [key, val] of Object.entries(obj)) {
                if ((key === "imageUrl" || key === "childImageUrl") && typeof val === "string" && val) {
                    urls.add(val);
                } else if (val && typeof val === "object") {
                    visitar(val);
                }
            }
        };
        comps.forEach((c) => visitar(c.data));
        return Array.from(urls);
    };

    // Precarga cada URL en el caché del navegador esperando a que termine
    // de descargar (o falle) antes de continuar.
    const precargarImagenes = (urls) => Promise.all(
        urls.map((url) => new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
        }))
    );

    // Captura el div de PDF (off-screen, sin overflow) y devuelve el canvas
    // junto con los puntos de corte seguros (borde inferior de cada
    // componente, en px del canvas) para que generarPDFBlob pueda repartir
    // el contenido en varias páginas sin partir un componente a la mitad.
    const capturarPdfCanvas = () => new Promise((resolve, reject) => {
        setShowPdfCapture(true);
        const precarga = precargarImagenes(extraerImagenes(componentes));
        // Esperar a que React monte el div fuera de pantalla
        setTimeout(async () => {
            try {
                // Garantiza que ninguna imagen quede a medio cargar en la captura,
                // sin importar su tamaño o la velocidad de conexión.
                await precarga;
                // Pequeño margen para que React repinte ya con las imágenes en caché
                await new Promise((r) => setTimeout(r, 150));

                const el = pdfCaptureRef.current;
                if (!el) throw new Error("pdfCaptureRef no disponible");
                const canvas = await html2canvas(el, { useCORS: true, allowTaint: true });

                const rootRect = el.getBoundingClientRect();
                const escala = canvas.width / rootRect.width;
                const lienzoCanvas = el.querySelector(".lienzo__canvas");
                const hijos = lienzoCanvas ? Array.from(lienzoCanvas.children) : [];
                const boundaries = hijos.map((hijo) => {
                    const r = hijo.getBoundingClientRect();
                    return Math.round((r.bottom - rootRect.top) * escala);
                });

                resolve({ canvas, boundaries });
            } catch (e) {
                reject(e);
            } finally {
                setShowPdfCapture(false);
            }
        }, 600);
    });

    const handlePreview = () => {
        setActiveElement(null);
        setShowPreviewModal(true);
    };

    const closePreview = () => {
        setShowPreviewModal(false);
    };

    const descargarPDF = async () => {
        try {
            Swal.fire({
                title: "Generando PDF...",
                text: "Preparando la descarga",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });
            const { canvas, boundaries } = await capturarPdfCanvas();
            const pdfBlob = await generarPDFBlob(canvas, boundaries);
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${tituloProyecto.trim() || "portafolio"}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            Swal.close();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo generar el PDF" });
        }
    };

    const guardarPortafolio = async () => {
        if (!tituloProyecto.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'El portafolio debe tener un título antes de guardarse.',
                confirmButtonColor: '#0ea5e9',
            })
            return
        }
        if (!descripcionProyecto.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'El portafolio debe tener una descripción antes de guardarse.',
                confirmButtonColor: '#0ea5e9',
            })
            return
        }
        if (componentes.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Portafolio vacío',
                text: 'Agrega al menos una sección antes de guardar.',
                confirmButtonColor: '#0ea5e9',
            })
            return
        }
        try {
            Swal.fire({
                title: "Guardando portafolio...",
                text: "Capturando vista previa y subiendo archivos",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            setActiveElement(null);
            const { canvas, boundaries } = await capturarPdfCanvas();
            const imagenBlob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.8));
            const imgPortadaUrl = await subirArchivoCloudinary(imagenBlob, "image");
            const pdfBlob = await generarPDFBlob(canvas, boundaries);
            const pdfUrl = await subirArchivoCloudinary(pdfBlob, "raw");

            if (!pdfUrl) throw new Error("No se pudo subir el PDF");

            const usuarioActivo = JSON.parse(localStorage.getItem("UsuarioActivo") || "{}");
            const payload = {
                id_usuario:       usuarioActivo.id,
                titulo:           tituloProyecto,
                descripcion:      descripcionProyecto,
                pdf:              pdfUrl,
                img_portada:      imgPortadaUrl,
                componentes_json: JSON.stringify(componentes),
                categorias,
            };
            
            if (isEditMode) {
                await Fetch.putData(`portafolios/${proyectoEditando.id}`, payload);
            } else {
                await Fetch.postData("portafolios", payload);
            }

            setEsDirty(false);
            Swal.fire({
                icon: "success",
                title: isEditMode ? "Portafolio actualizado" : "Portafolio guardado",
                text: isEditMode ? "Los cambios fueron guardados correctamente." : "Guardado correctamente.",
                confirmButtonColor: '#0ea5e9',
            });
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el portafolio" });
        }
    };

    return {
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
    };
}
