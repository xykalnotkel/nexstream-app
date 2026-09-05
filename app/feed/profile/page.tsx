"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Settings, History, Heart } from 'lucide-react';
import BottomSheet from '@/components/BottomSheet';
import Link from 'next/link';

export default function ProfilePage() {
  const { likedVideos, history } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-4xl shadow-xl">
          X
        </div>
        <div>
          <h1 className="text-2xl font-bold">XySpace User</h1>
          <p className="text-gray-400">@xyspace_user • {history.length} video ditonton</p>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="mt-2 text-sm font-semibold bg-[#272727] hover:bg-[#3f3f3f] px-4 py-1.5 rounded-full flex items-center gap-2 transition"
          >
            <Settings size={16} /> Pengaturan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* History */}
        <div className="bg-[#121212] rounded-xl p-4 border border-[#272727]">
          <div className="flex items-center gap-2 mb-4 text-lg font-bold">
            <History className="text-blue-400" /> Histori (Terakhir)
          </div>
          {history.length === 0 ? <p className="text-sm text-gray-500">Belum ada histori.</p> : (
            <div className="flex flex-col gap-2">
              {history.slice(0, 5).map(id => (
                <Link href={`/watch/${id}`} key={id} className="text-sm hover:text-blue-400 truncate bg-[#222] p-2 rounded">
                  Video ID: {id}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Liked */}
        <div className="bg-[#121212] rounded-xl p-4 border border-[#272727]">
          <div className="flex items-center gap-2 mb-4 text-lg font-bold">
            <Heart className="text-red-400" /> Disukai ({likedVideos.length})
          </div>
          {likedVideos.length === 0 ? <p className="text-sm text-gray-500">Belum ada video disukai.</p> : (
            <div className="flex flex-col gap-2">
              {likedVideos.slice(0, 5).map(id => (
                <Link href={`/watch/${id}`} key={id} className="text-sm hover:text-red-400 truncate bg-[#222] p-2 rounded">
                  Video ID: {id}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Bottom Sheet */}
      <BottomSheet isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Pengaturan NexStream">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl">
            <div>
              <h4 className="font-bold">Tema Gelap</h4>
              <p className="text-xs text-gray-400">Gunakan tampilan default NexStream.</p>
            </div>
            <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" /></div>
          </div>
          <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl">
            <div>
              <h4 className="font-bold">SponsorBlock Otomatis</h4>
              <p className="text-xs text-gray-400">Lewati segmen sponsor secara otomatis.</p>
            </div>
            <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" /></div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-4">Made by XySpace • V2.0.0</p>
        </div>
      </BottomSheet>

    </div>
  );
}