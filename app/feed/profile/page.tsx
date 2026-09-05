"use client";

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Settings, History, Heart, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import BottomSheet from '@/components/BottomSheet';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { likedVideos, history, subscriptions } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        {session?.user?.image ? (
          <img src={session.user.image} alt="User Avatar" className="w-24 h-24 rounded-full shadow-xl" />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-4xl shadow-xl">
            {session?.user?.name ? session.user.name.charAt(0) : 'X'}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{session?.user?.name || 'XySpace User'}</h1>
          <p className="text-gray-400 text-sm mb-2">{session?.user?.email || '@xyspace_user'}</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="text-sm font-semibold bg-[#272727] hover:bg-[#3f3f3f] px-4 py-1.5 rounded-full flex items-center gap-2 transition"
            >
              <Settings size={16} /> Pengaturan Lengkap
            </button>
            {session ? (
              <button onClick={() => signOut()} className="text-sm font-semibold bg-red-600/20 text-red-400 hover:bg-red-600/30 px-4 py-1.5 rounded-full flex items-center gap-2 transition">
                <LogOut size={16} /> Keluar
              </button>
            ) : (
              <button onClick={() => signIn('google')} className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full flex items-center gap-2 transition">
                <LogIn size={16} /> Sinkronisasi YouTube
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* History */}
        <div className="bg-[#121212] rounded-xl p-4 border border-[#272727]">
          <div className="flex items-center gap-2 mb-4 text-lg font-bold">
            <History className="text-blue-400" /> Histori Tontonan
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
            <Heart className="text-red-400" /> Video Disukai ({likedVideos.length})
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
      <BottomSheet isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Pengaturan XyTube">
        <div className="flex flex-col gap-4">
          
          <div className="p-3 bg-blue-900/20 border border-blue-900 rounded-xl mb-2">
            <h4 className="font-bold flex items-center gap-2 text-blue-400"><ShieldCheck size={16}/> Status Sinkronisasi Akun</h4>
            {session ? (
              <p className="text-xs text-blue-300 mt-1">Akun Google / YouTube Anda berhasil terhubung. Data fallback disimpan secara lokal.</p>
            ) : (
              <p className="text-xs text-blue-300 mt-1">Gunakan tombol 'Sinkronisasi' di atas untuk login Google OAuth.</p>
            )}
          </div>

          <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl">
            <div>
              <h4 className="font-bold">Kualitas Video Bawaan</h4>
              <p className="text-xs text-gray-400">Selalu putar video di 1080p</p>
            </div>
            <select className="bg-[#272727] text-sm px-2 py-1 rounded outline-none">
              <option>Otomatis</option>
              <option>1080p</option>
              <option>720p</option>
              <option>480p</option>
            </select>
          </div>

          <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl">
            <div>
              <h4 className="font-bold">Putar Otomatis (Autoplay)</h4>
              <p className="text-xs text-gray-400">Mainkan video selanjutnya saat selesai</p>
            </div>
            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" /></div>
          </div>

          <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl">
            <div>
              <h4 className="font-bold">SponsorBlock Cerdas</h4>
              <p className="text-xs text-gray-400">Lewati segmen sponsor & intro secara otomatis</p>
            </div>
            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" /></div>
          </div>
          
          <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl">
            <div>
              <h4 className="font-bold">Tema Aplikasi</h4>
              <p className="text-xs text-gray-400">Gelap Terang (AMOLED)</p>
            </div>
            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" /></div>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4 font-mono">Made by XySpace • XyTube V3.0</p>
        </div>
      </BottomSheet>
    </div>
  );
}

// Temporary icon for shield since it's not imported at top
function ShieldCheck(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
}