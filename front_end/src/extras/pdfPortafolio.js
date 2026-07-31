import jsPDF from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Recorta una franja vertical [startY, endY) del canvas de origen a un
// canvas nuevo, para poder convertirla en la imagen de una sola página.
function recortarCanvas(origen, startY, endY) {
    const alto = endY - startY;
    const recorte = document.createElement("canvas");
    recorte.width = origen.width;
    recorte.height = alto;
    recorte.getContext("2d").drawImage(origen, 0, startY, origen.width, alto, 0, 0, origen.width, alto);
    return recorte;
}

// Agrupa los "cortes" (borde inferior de cada componente, en px del canvas)
// en páginas que no superen el alto máximo de una A4, sin partir nunca un
// componente entre dos páginas. Si un solo componente es más alto que una
// página completa, se le da una página a su propia medida.
function calcularPaginas(alturaTotalPx, cortes, maxAltoPx) {
    const paginas = [];
    let inicio = 0;
    let ultimoValido = 0;
    for (const corte of cortes) {
        if (corte - inicio > maxAltoPx) {
            if (ultimoValido > inicio) {
                paginas.push([inicio, ultimoValido]);
                inicio = ultimoValido;
            }
            if (corte - inicio > maxAltoPx) {
                paginas.push([inicio, corte]);
                inicio = corte;
                ultimoValido = corte;
                continue;
            }
        }
        ultimoValido = corte;
    }
    if (inicio < alturaTotalPx) {
        // Si lo que sobra (normalmente el padding/margen inferior del
        // lienzo, no contenido real) todavía cabe estirando la última
        // página ya armada, lo unimos ahí en vez de crear una página casi
        // vacía solo para ese resto.
        const ultimaPagina = paginas[paginas.length - 1];
        if (ultimaPagina && alturaTotalPx - ultimaPagina[0] <= maxAltoPx) {
            ultimaPagina[1] = alturaTotalPx;
        } else {
            paginas.push([inicio, alturaTotalPx]);
        }
    }
    return paginas;
}

// Acepta un HTMLCanvasElement ya renderizado (generado por capturarPdfCanvas)
// y, opcionalmente, la lista de puntos de corte seguros (borde inferior de
// cada componente del portafolio, en px del canvas) para repartir el
// contenido en varias páginas A4 sin partir un componente a la mitad.
export const generarPDFBlob = async (canvas, boundaries = []) => {
    const pxPerMM = canvas.width / A4_WIDTH_MM;
    const maxAltoPx = A4_HEIGHT_MM * pxPerMM;

    const cortes = boundaries.filter(b => b > 0 && b <= canvas.height);
    if (cortes.length === 0 || cortes[cortes.length - 1] < canvas.height) {
        cortes.push(canvas.height);
    }

    const paginas = calcularPaginas(canvas.height, cortes, maxAltoPx);

    const alturaPrimeraPaginaMM = (paginas[0][1] - paginas[0][0]) / pxPerMM;
    const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [A4_WIDTH_MM, alturaPrimeraPaginaMM],
        compress: true,
    });

    paginas.forEach(([startY, endY], i) => {
        const alturaMM = (endY - startY) / pxPerMM;
        if (i > 0) pdf.addPage([A4_WIDTH_MM, alturaMM], "p");

        const recorte = recortarCanvas(canvas, startY, endY);
        const imgData = recorte.toDataURL("image/jpeg", 0.7);
        pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, alturaMM);
    });

    return pdf.output("blob");
};
