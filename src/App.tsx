import React, { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { classifyImage } from './services/azure';
import { downloadZip } from './utils/fileHandling';
import { convertToPNG } from './utils/imageUtils';
import { ImageUploader } from './components/ImageUploader';
import { ErrorList } from './components/ErrorList';
import { ImageGrid } from './components/ImageGrid';
import { EmptyState } from './components/EmptyState';
import { ClassifiedImage } from './types';

function App() {
  const [images, setImages] = useState<ClassifiedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    setErrors(new Map());

    try {
      const processedImages: ClassifiedImage[] = [];
      const newErrors = new Map<string, string>();

      await Promise.all(
        Array.from(files).map(async (file) => {
          try {
            const pngFile = await convertToPNG(file);
            const category = await classifyImage(pngFile);
            const preview = URL.createObjectURL(pngFile);
            processedImages.push({
              id: crypto.randomUUID(), // Generate unique ID
              file: pngFile,
              category,
              preview
            });
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al procesar la imagen';
            newErrors.set(file.name, errorMessage);
          }
        })
      );

      setImages(prev => [...prev, ...processedImages]);
      setErrors(newErrors);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDeleteImage = useCallback((imageId: string) => {
    setImages(prev => {
      const newImages = prev.filter(img => img.id !== imageId);
      // Revoke object URL to prevent memory leaks
      const imageToDelete = prev.find(img => img.id === imageId);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.preview);
      }
      return newImages;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Clasificador de Calzado Payless</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <ImageUploader onUpload={handleImageUpload} isProcessing={isProcessing} />
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Procesando imágenes...</span>
          </div>
        )}

        <ErrorList errors={errors} />

        {images.length > 0 ? (
          <ImageGrid 
            images={images} 
            onDownload={() => downloadZip(images)}
            onDeleteImage={handleDeleteImage}
          />
        ) : (
          !isProcessing && <EmptyState />
        )}
      </main>
    </div>
  );
}

export default App;