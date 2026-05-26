import jsPDF from "jspdf";

// Acepta un HTMLCanvasElement ya renderizado (generado por capturarCanvas)
export const generarPDFBlob = async (canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 0.7);

    const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);

    return pdf.output("blob");
};