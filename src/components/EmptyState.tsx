import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Sin imágenes</h3>
      <p className="mt-1 text-sm text-gray-500">Sube imágenes para comenzar</p>
    </div>
  );
}