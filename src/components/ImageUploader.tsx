import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

export function ImageUploader({ onUpload, isProcessing }: ImageUploaderProps) {
  return (
    <label
      htmlFor="image-upload"
      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-12 h-12 mb-4 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
        </p>
        <p className="text-xs text-gray-500">Formatos soportados: PNG, JPG, WEBP</p>
        <p className="text-xs text-gray-500 mt-1">Tipos: sandalias, tenis, zapatos, tacones, botas</p>
      </div>
      <input
        id="image-upload"
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={onUpload}
        disabled={isProcessing}
      />
    </label>
  );
}