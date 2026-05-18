import "../../styles/PlantillaTalentos/EditorContenedores.css"
import UploadImage from "./SubirImagen";

function EditorContenedores({ tipo, setColorFondo, setImageUrl, imageUrl, setColorTexto, position }) {
    const uploadId = `upload-${tipo}`;

    return (
        <div className="editor-toolbar"
            onClick={(e) => e.stopPropagation()}
            style={{
                position: "fixed",
                top: position.y,
                left: position.x,
                transform: "translate(-50%, -100%)",
                zIndex: 9999
            }}
        >
            {(tipo === "fondo" || tipo === "bloque") && (
                <>
                    <span className="color-wrapper">
                        <input
                            className="btnColor"
                            type="color"
                            onChange={(e) => setColorFondo(e.target.value)}
                        />
                        <i className="fa-solid fa-palette"></i>
                    </span>

                    <label className="image-wrapper" htmlFor={uploadId} title="Subir imagen">
                        <UploadImage setImageUrl={setImageUrl} id={uploadId} />
                        <i className="fa-solid fa-image"></i>
                    </label>

                    {imageUrl && (
                        <span className="remove-img" onClick={() => setImageUrl("")} title="Quitar imagen">
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    )}
                </>
            )}

            {tipo === "texto" && (
                <span className="text-color-wrapper">
                    <input
                        type="color"
                        className="btnTextColor"
                        onChange={(e) => setColorTexto(e.target.value)}
                    />
                    <span className="icono-texto">
                        <i className="fa-solid fa-brush"></i>
                        <i className="fa-solid fa-font"></i>
                    </span>
                </span>
            )}
        </div>
    );
}

export default EditorContenedores;