"use client";

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Search } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const [query, setQuery] = useState('trending');
  const [searchInput, setSearchInput] = useState('');
  
  const { data: videos, error, isLoading } = useSWR(`/api/search?q=${encodeURIComponent(query)}`, fetcher);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchInput.trim()) setQuery(searchInput);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'Live';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="flex-1 flex bg-[#121212] border border-[#303030] rounded-full overflow-hidden focus-within:border-blue-500">
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari video..." 
            className="w-full bg-transparent px-4 py-2 focus:outline-none"
          />
          <button type="submit" className="px-6 bg-[#222222] border-l border-[#303030] hover:bg-[#303030]">
            <Search size={18} className="text-gray-400" />
          </button>
        </div>
      </form>

      <h1 className="text-xl font-bold mb-4 capitalize">Hasil untuk: {query}</h1>

      {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="animate-pulse">
            <div className="w-full aspect-video bg-[#272727] rounded-xl mb-3"></div>
            <div className="h-4 bg-[#272727] rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-[#272727] rounded w-1/2"></div>
          </div>
        ))}
      </div>}

      {error && <ErrorState error="Gagal mengambil data video." />}

      {!isLoading && !error && videos?.length === 0 && <EmptyState />}

      {!isLoading && !error && videos && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((vid: any, i: number) => {
            const isLive = vid.isLive || vid.lengthSeconds === 0;
            return (
              <Link href={`/watch/${vid.videoId}`} key={i} className="group cursor-pointer">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-[#272727]">
                  <img 
                    src={`https://i.ytimg.com/vi/${vid.videoId}/maxresdefault.jpg`} 
                    onError={(e) => { e.currentTarget.src = `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`; }}
                    alt={vid.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                  />
                  <div className={`absolute bottom-1.5 right-1.5 text-white text-xs px-1.5 py-0.5 rounded font-medium tracking-wide ${isLive ? 'bg-red-600' : 'bg-black/80'}`}>
                    {isLive ? 'LIVE' : formatDuration(vid.lengthSeconds)}
                  </div>
                </div>
                <div className="flex gap-3 pr-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold overflow-hidden">
                    {vid.authorThumbnails ? (
                      <img src={vid.authorThumbnails[0].url} alt={vid.author} className="w-full h-full object-cover"/>
                    ) : (
                      vid.author?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      {vid.author}
                      {vid.authorVerified && <span className="bg-gray-500 text-black rounded-full w-3 h-3 flex items-center justify-center text-[8px]">✓</span>}
                    </p>
                    <p className="text-xs text-gray-400">{vid.viewCount?.toLocaleString()} x ditonton {vid.publishedText && `• ${vid.publishedText}`}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}