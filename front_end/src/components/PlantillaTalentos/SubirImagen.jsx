import { useRef } from "react";
import { isDemoMode, archivoABase64 } from "../../mock/mockEngine";

function UploadImage({ setImageUrl, id = "upload-input" }) {
  const inputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (isDemoMode()) {
      try {
        setImageUrl(await archivoABase64(file));
      } catch (error) {
        console.error("Error leyendo imagen en modo demo:", error);
      }
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "imagenes"); 

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyy1yqvbv/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      setImageUrl(result.secure_url); 

    } catch (error) {
      console.error("Error subiendo imagen:", error);
    }
  };

  return (
     <>
      <input
        type="file"
        id={id}
        ref={inputRef}
        onChange={handleUpload}
        style={{ display: "none" }}
      />
    </>
  );
}

export default UploadImage;