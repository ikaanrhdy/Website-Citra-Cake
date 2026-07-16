/**
 * Convert elemen <svg> jadi PNG data URL (base64), supaya bisa dipakai
 * langsung sebagai <img src="..."> di halaman lain (Cart, Checkout, dst)
 * tanpa perlu render ulang SVG-nya.
 */
export function svgToPngDataUrl(
  svgEl: SVGSVGElement,
  width = 300,
  height = 280,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas context tidak tersedia"));
        return;
      }

      // Kasih background putih dulu, biar gak transparan pas ditampilin
      // sebagai thumbnail kotak di Cart/Checkout
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}
