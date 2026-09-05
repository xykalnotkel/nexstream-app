import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ error, retry }: { error: string, retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-red-400">
      <AlertCircle size={48} className="mb-4" />
      <p className="font-semibold text-lg">{error}</p>
      {retry && (
        <button 
          onClick={retry}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}