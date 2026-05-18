import { useState, useEffect, useRef } from "react";
import { generarPDFBlob } from "../../extras/pdfPortafolio";
import Fetch from "../../services/Fetch";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";

export function usePortafolioEditor() {
    const [componentes, setComponentes] = useState([]);
    const [tituloProyecto, setTituloProyecto] = useState("");
    const [descripcionProyecto, setDescripcionProyecto] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [activeElement, setActiveElement] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [portafolioId, setPortafolioId] = useState(
        () => localStorage.getItem("portafolioId") || null
    );

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

    // Persistencia localStorage — cargar
    useEffect(() => {
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
                usuarioId: localStorage.getItem("idUsuario") || usuarioActivo.id || "desconocido",
                componentes,
                titulo: tituloProyecto,
                descripcion: descripcionProyecto,
                categorias,
                pdf: pdfUrl,
                imgPortada: imgPortadaUrl,
                nombreUsuario: usuarioActivo.Nombre || "Usuario"
            };

            if (portafolioId) {
                await Fetch.patchData("portafolios", payload, portafolioId);
            } else {
                const response = await Fetch.postData(payload, "portafolios");
                if (response?.id) {
                    setPortafolioId(response.id);
                    localStorage.setItem("portafolioId", response.id);
                }
            }

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
