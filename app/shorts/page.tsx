"use client";

import { useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ShortsPage() {
  const { data: videos, isLoading } = useSWR(`/api/search?q=%23shorts`, fetcher);

  // Auto scroll snap behavior
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (isLoading) return <div className="flex-1 flex justify-center items-center h-[calc(100vh-60px)]">Memuat Shorts...</div>;
  if (!videos) return <EmptyState />;

  return (
    <div className="h-[calc(100vh-60px)] md:h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black">
      {videos.map((vid: any) => (
        <div key={vid.videoId} className="h-full w-full snap-start flex justify-center items-center relative">
          
          <div className="relative w-full max-w-sm h-full md:h-[90%] md:rounded-2xl overflow-hidden bg-[#121212]">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${vid.videoId}?autoplay=0&loop=1&controls=0&mute=0`}
              title="Shorts player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
            
            <div className="absolute bottom-4 left-4 right-16 z-10">
              <h3 className="font-bold text-white text-shadow">{vid.title}</h3>
              <p className="text-sm text-gray-200 text-shadow">{vid.author}</p>
            </div>
            
            <div className="absolute bottom-4 right-4 flex flex-col gap-4 z-10">
              <button className="w-12 h-12 bg-black/50 rounded-full flex flex-col items-center justify-center text-white backdrop-blur">
                👍
              </button>
              <button className="w-12 h-12 bg-black/50 rounded-full flex flex-col items-center justify-center text-white backdrop-blur">
                💬
              </button>
              <button className="w-12 h-12 bg-black/50 rounded-full flex flex-col items-center justify-center text-white backdrop-blur">
                ↗️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}