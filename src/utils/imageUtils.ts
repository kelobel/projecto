export async function convertToPNG(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // Si ya es PNG, devolver archivo original
    if (file.type === 'image/png') {
      resolve(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject(new Error('Error al obtener el contexto del canvas'));
        return;
      }

      // Dibujar imagen en el canvas
      ctx.drawImage(img, 0, 0);

      // Convertir a blob PNG
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Error al convertir la imagen'));
            return;
          }

          // Crear nuevo archivo con extensión PNG
          const fileName = file.name.replace(/\.[^/.]+$/, '') + '.png';
          const newFile = new File([blob], fileName, {
            type: 'image/png',
            lastModified: file.lastModified,
          });

          resolve(newFile);
        },
        'image/png',
        1.0
      );
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = URL.createObjectURL(file);
  });
}