import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { generarPDFBlob } from "../../extras/pdfPortafolio";
import Fetch from "../../services/Fetch";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";

export function usePortafolioEditor() {
    const location = useLocation();
    const proyectoEditando = location.state?.proyectoEditando ?? null;

    const [componentes, setComponentes] = useState([]);
    const [tituloProyecto, setTituloProyecto] = useState("");
    const [descripcionProyecto, setDescripcionProyecto] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [activeElement, setActiveElement] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [portafolioId, setPortafolioId] = useState(() => {
        if (proyectoEditando?.id) return String(proyectoEditando.id);
        const stored = localStorage.getItem("portafolioId");
        return stored && /^\d+$/.test(stored) ? stored : null;
    });

    const historialRef = useRef([]);
    const indiceRef = useRef(-1);
    const saltarRef = useRef(false);
    const lienzoRef = useRef();

    const activarEditor = (e, data) => {
        e.stopPropagation();
        setActiveElement({ ...data });
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
            // Editar portafolio existente: usar componentes del localStorage si coincide el id
            const storedId  = localStorage.getItem("portafolioId");
            const storedData = JSON.parse(localStorage.getItem("portafolio") || "null");
            const comps = (storedId && String(storedId) === String(proyectoEditando.id) && storedData?.componentes?.length > 0)
                ? storedData.componentes
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
    }, []);

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
    };

    const eliminarComponente = (id) => {
        setComponentes((prev) => prev.filter((c) => c.id !== id));
    };

    const updateComponentData = (id, newData) => {
        setComponentes(prev => prev.map(c =>
            c.id === id ? { ...c, data: { ...c.data, ...newData } } : c
        ));
    };

    const subirArchivoCloudinary = async (archivo, type = "raw") => {
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

    const handlePreview = async () => {
        setActiveElement(null);
        lienzoRef.current.classList.add("capturando");
        const canvas = await html2canvas(lienzoRef.current, { useCORS: true, allowTaint: true });
        lienzoRef.current.classList.remove("capturando");
        setPreviewImage(canvas.toDataURL());
        setShowPreviewModal(true);
    };

    const closePreview = () => {
        setShowPreviewModal(false);
        setPreviewImage(null);
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
            lienzoRef.current.classList.add("capturando");
            const canvas = await html2canvas(lienzoRef.current, { useCORS: true, allowTaint: true });
            const imagenBlob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.8));
            const imgPortadaUrl = await subirArchivoCloudinary(imagenBlob, "image");
            const pdfBlob = await generarPDFBlob(lienzoRef);
            lienzoRef.current.classList.remove("capturando");
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
            };
            
            const response = await Fetch.postData("portafolios", payload);

            // if (portafolioId) {
            //     await Fetch.putData(`portafolios/${portafolioId}`, payload);
            // } else {
            //     const response = await Fetch.postData("portafolios", payload);
            //     if (response?.id_portafolio) {
            //         setPortafolioId(response.id_portafolio);
            //         localStorage.setItem("portafolioId", response.id_portafolio);
            //     }
            // }

            Swal.fire({ icon: "success", title: "Portafolio guardado", text: "Guardado correctamente" });
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
    };
}
