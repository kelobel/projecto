import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorListProps {
  errors: Map<string, string>;
}

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.size === 0) return null;

  return (
    <div className="mb-8 space-y-2">
      {Array.from(errors.entries()).map(([filename, error]) => (
        <div key={filename} className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">{filename}</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}