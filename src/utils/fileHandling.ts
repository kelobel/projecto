import JSZip from 'jszip';
import { ClassifiedImage } from '../types';

let counter = 1;

function generateFileName(category: string): string {
  const paddedCounter = String(counter++).padStart(2, '0');
  return `cal_dev_img_${paddedCounter}`;
}

function generateTypeFileName(counter: number): string {
  const paddedCounter = String(counter).padStart(2, '0');
  return `cal_dev_type_${paddedCounter}.txt`;
}

export async function downloadZip(images: ClassifiedImage[]): Promise<void> {
  const zip = new JSZip();
  counter = 1; // Reset counter for each download

  // Agregar imágenes y archivos de texto
  for (const img of images) {
    const fileName = generateFileName(img.category);
    const typeFileName = generateTypeFileName(counter);
    
    // Agregar imagen PNG
    const arrayBuffer = await img.file.arrayBuffer();
    zip.file(`${fileName}.png`, arrayBuffer);
    
    // Agregar archivo de texto con el tipo
    zip.file(typeFileName, img.category);
    
    counter++;
  }

  // Generar y descargar el archivo zip
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'calzado-payless.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}