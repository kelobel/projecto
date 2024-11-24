import React from 'react';
import { FolderDown, Trash2 } from 'lucide-react';
import { ClassifiedImage } from '../types';

interface ImageGridProps {
  images: ClassifiedImage[];
  onDownload: () => void;
  onDeleteImage: (imageId: string) => void;
}

export function ImageGrid({ images, onDownload, onDeleteImage }: ImageGridProps) {
  const categories = [...new Set(images.map(img => img.category))];

  if (categories.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Imágenes Clasificadas</h2>
        <button
          onClick={onDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FolderDown className="w-4 h-4 mr-2" />
          Descargar Todo
        </button>
      </div>

      {categories.map(category => (
        <div key={category} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images
              .filter(img => img.category === category)
              .map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <img
                    src={img.preview}
                    alt={`Calzado ${img.category}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onDeleteImage(img.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}