"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, Bell, Video, Mic, ThumbsUp, Share, MessageSquare } from 'lucide-react';

export default function NexStream() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{user: string, text: string, color: string}[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Load awal
  useEffect(() => {
    handleSearch('lofi');
  }, []);

  const handleSearch = async (q: string) => {
    if (!q) return;
    setLoading(true);
    try {
      // Fetch ke Next.js (yang akan diproxy otomatis ke Go Backend di port 8080)
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setVideos(data);
        setCurrentVideo(data[0]); // Auto play hasil pertama
      }
    } catch (e) {
      console.error("Gagal mendapatkan data:", e);
    }
    setLoading(false);
  };

  // Chat Simulator Engine (Biar selalu ramai!)
  useEffect(() => {
    const users = ["Alex_Pro", "Budi99", "SitiCute", "GamerIndo", "DevNinja", "Ayu_Sri"];
    const msgs = ["Keren banget ui-nya! 🔥", "Lanjut bang!!", "Wah Next.js + Go mantap", "Halo semua dari Indo 👋", "Ada yang lagi ngoding?", "Vibes-nya enak bgt"];
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    
    // Inject chat baru setiap 2.5 detik
    const interval = setInterval(() => {
      setChatMessages(prev => {
        const newMsg = {
          user: users[Math.floor(Math.random() * users.length)],
          text: msgs[Math.floor(Math.random() * msgs.length)],
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        const updated = [...prev, newMsg];
        if (updated.length > 50) updated.shift(); // Limit memori
        return updated;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll ke pesan chat paling bawah
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white overflow-hidden font-sans">
      
      {/* Navbar Premium */}
      <nav className="flex justify-between items-center p-3 sm:p-4 border-b border-[#303030] bg-[#0f0f0f] z-50">
        <div className="flex items-center gap-4">
          <Menu className="cursor-pointer hover:text-gray-400 hidden sm:block" />
          <div className="flex items-center gap-2 font-black text-xl sm:text-2xl tracking-tighter cursor-pointer text-white">
            <div className="bg-red-600 p-1.5 rounded-lg flex items-center justify-center">
              <Video size={20} className="text-white" fill="white" />
            </div>
            Nex<span className="text-red-500">Stream</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl flex mx-4 items-center">
          <div className="flex w-full bg-[#121212] border border-[#303030] rounded-full overflow-hidden focus-within:border-blue-500 transition-colors">
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Telusuri video (Tekan enter)..." 
              className="w-full bg-transparent px-4 py-2 focus:outline-none text-sm sm:text-base"
            />
            <button 
              onClick={() => handleSearch(searchQuery)}
              className="px-5 sm:px-6 bg-[#222222] border-l border-[#303030] hover:bg-[#303030] transition-colors"
            >
              <Search size={18} className="text-gray-300" />
            </button>
          </div>
          <button className="ml-3 p-2.5 bg-[#222222] hover:bg-[#303030] rounded-full hidden sm:block">
            <Mic size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Video className="cursor-pointer hover:text-gray-400 hidden sm:block" />
          <Bell className="cursor-pointer hover:text-gray-400 hidden sm:block" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold shadow-lg cursor-pointer">
            B
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Content Layout */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col xl:flex-row gap-6">
          
          {/* Kolom Video Utama */}
          <div className="flex-1">
            {loading ? (
              <div className="w-full aspect-video bg-[#272727] animate-pulse rounded-xl flex items-center justify-center">
                Mencari ke Server Go...
              </div>
            ) : currentVideo && (
              <>
                <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`} 
                    title="Video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
                
                <h1 className="text-xl md:text-2xl font-bold mt-4 line-clamp-2">{currentVideo.title}</h1>
                
                <div className="flex flex-wrap justify-between items-center mt-3 gap-4 border-b border-[#303030] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex justify-center items-center font-bold text-lg shadow-md">
                      {currentVideo.author?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] flex items-center gap-1">
                        {currentVideo.author} 
                        <span className="text-gray-400 text-xs">✓</span>
                      </h3>
                      <p className="text-xs text-gray-400">NexStream Creator</p>
                    </div>
                    <button className="ml-4 bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 text-sm transition-transform active:scale-95">
                      Subscribe
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex bg-[#272727] rounded-full overflow-hidden">
                      <button className="px-4 py-2 hover:bg-[#3f3f3f] flex items-center gap-2 text-sm border-r border-[#3f3f3f] transition-colors">
                        <ThumbsUp size={16} /> 12RB
                      </button>
                      <button className="px-4 py-2 hover:bg-[#3f3f3f] text-sm transition-colors">
                        <ThumbsUp size={16} className="rotate-180" />
                      </button>
                    </div>
                    <button className="bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] flex items-center gap-2 text-sm transition-colors">
                      <Share size={16} /> Bagikan
                    </button>
                  </div>
                </div>

                <div className="bg-[#272727] rounded-xl p-4 mt-4 hover:bg-[#3f3f3f] cursor-pointer transition-colors text-sm">
                  <span className="font-bold">{currentVideo.viewCount?.toLocaleString() || '15,000'} x ditonton</span>
                  <p className="mt-1 text-gray-300">
                    Video didapatkan melalui API Go-lang Backend dengan sistem Fallback otomatis. 
                    <br/><br/>
                    <b>Tech Stack:</b><br/>
                    - Frontend: Next.js + TailwindCSS<br/>
                    - Backend: Golang (Goroutine untuk request API)<br/>
                    - Proxy: Next.js Rewrite to Go
                  </p>
                </div>
              </>
            )}

            {/* List Video Rekomendasi / Hasil Pencarian */}
            <div className="mt-8">
              <h3 className="font-bold text-xl mb-4">Hasil / Rekomendasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((vid: any, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setCurrentVideo(vid);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex gap-4 p-2 hover:bg-[#272727] rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={`https://i.ytimg.com/vi/${vid.videoId}/mqdefault.jpg`} 
                        alt="Thumbnail" 
                        className="w-40 h-24 object-cover rounded-xl bg-gray-800"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">Live</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{vid.title}</h4>
                      <span className="text-xs text-gray-400 mt-2">{vid.author}</span>
                      <span className="text-xs text-gray-400">{vid.viewCount?.toLocaleString() || '9.2M'} x ditonton</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Live Chat (Simulator Real-time) */}
          <div className="w-full xl:w-[380px] flex-shrink-0 h-[500px] xl:h-auto bg-[#181818] border border-[#303030] rounded-xl flex flex-col shadow-lg overflow-hidden">
            <div className="p-3 border-b border-[#303030] flex items-center justify-between bg-[#121212]">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-300" />
                <span className="font-bold text-[15px]">Live Chat</span>
              </div>
              <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> 4,512 Watching
              </span>
            </div>
            
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-sm">
              <div className="bg-[#272727] p-2 rounded text-xs text-center text-gray-300 mb-2">
                Welcome to NexStream Live Chat! Please be respectful to others.
              </div>
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-3 hover:bg-[#272727] p-1 -mx-1 rounded">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md ${msg.color} flex-shrink-0`}>
                    {msg.user.charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <span className="text-gray-400 font-bold mr-2 text-xs">{msg.user}</span>
                    <span className="break-all text-[13px]">{msg.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#303030] bg-[#121212]">
              <div className="flex bg-[#272727] rounded-full p-1 pl-4 border border-transparent focus-within:border-gray-500 transition-colors">
                <input 
                  type="text" 
                  placeholder="Chat publik..." 
                  className="bg-transparent flex-1 focus:outline-none text-sm placeholder-gray-500" 
                />
                <button className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-md">
                  <Mic size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}