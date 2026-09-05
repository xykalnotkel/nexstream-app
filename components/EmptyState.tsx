import React from 'react';
import { VideoOff } from 'lucide-react';

export default function EmptyState({ message = "Tidak ada data yang ditemukan" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <VideoOff size={48} className="mb-4 opacity-50" />
      <p className="font-semibold text-lg">{message}</p>
    </div>
  );
}