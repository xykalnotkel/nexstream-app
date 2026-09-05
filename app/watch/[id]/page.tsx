"use client";

import { useEffect, useState, useRef } from 'react';
import useSWR from 'swr';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useStore } from '@/store/useStore';
import { ThumbsUp, Share2, PlusSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import ErrorState from '@/components/ErrorState';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function WatchPage({ params }: { params: { id: string } }) {
  const videoId = params.id;
  const { likedVideos, toggleLike, subscriptions, toggleSubscription, addToHistory } = useStore();
  const isLiked = likedVideos.includes(videoId);
  
  // Data Fetching
  const { data: video, error: vidErr } = useSWR(`/api/video?id=${videoId}`, fetcher);
  const { data: comments } = useSWR(`/api/comments?id=${videoId}`, fetcher);
  
  // SponsorBlock Fetching (Direct from official API)
  const { data: sponsorData } = useSWR(`https://sponsor.ajay.app/api/skipSegments?videoID=${videoId}&categories=["sponsor","intro","outro"]`, fetcher);

  const playerRef = useRef<any>(null);
  const [skipped, setSkipped] = useState(0);

  useEffect(() => {
    addToHistory(videoId);
  }, [videoId]);

  // SponsorBlock Engine Checker
  useEffect(() => {
    if (!sponsorData || !playerRef.current) return;
    
    const interval = setInterval(async () => {
      try {
        const player = playerRef.current.getInternalPlayer();
        const currentTime = await player.getCurrentTime();
        
        for (const segment of sponsorData) {
          if (currentTime >= segment.segment[0] && currentTime < segment.segment[1]) {
            await player.seekTo(segment.segment[1], true);
            setSkipped(prev => prev + 1);
            console.log(`[SponsorBlock] Skipped a ${segment.category} segment!`);
          }
        }
      } catch (e) {}
    }, 1000); // Check every second
    
    return () => clearInterval(interval);
  }, [sponsorData]);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const isSubbed = video?.author ? subscriptions.some(s => s.name === video.author) : false;

  if (vidErr) return <ErrorState error="Gagal memuat video." />;
  if (!video) return <div className="p-4 animate-pulse">Memuat Video...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto">
      {/* Left Column (Video + Info + Comments) */}
      <div className="flex-1">
        
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl">
          <YouTube 
            videoId={videoId} 
            opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }} 
            onReady={onPlayerReady} 
            className="w-full h-full absolute inset-0"
          />
        </div>

        {/* SponsorBlock Alert */}
        {skipped > 0 && (
          <div className="bg-green-900/40 border border-green-700 text-green-400 p-2 rounded-lg mt-3 flex items-center gap-2 text-sm">
            <ShieldCheck size={18} />
            SponsorBlock: Berhasil melewati {skipped} segmen sponsor/intro!
          </div>
        )}

        <h1 className="text-xl md:text-2xl font-bold mt-4 line-clamp-2">{video.title}</h1>
        
        {/* Action Bar */}
        <div className="flex flex-wrap justify-between items-center mt-3 gap-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex justify-center items-center font-bold shadow-md">
              {video.author?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-[15px]">{video.author}</h3>
              <p className="text-xs text-gray-400">{video.subCountText || '1.2M'} subs</p>
            </div>
            <button 
              onClick={() => toggleSubscription({ id: video.authorId || video.author, name: video.author, thumbnail: '' })}
              className={`ml-2 px-4 py-2 rounded-full font-bold text-sm transition ${isSubbed ? 'bg-[#272727] text-white hover:bg-[#3f3f3f]' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {isSubbed ? 'Disubscribe' : 'Subscribe'}
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="flex bg-[#272727] rounded-full overflow-hidden">
              <button 
                onClick={() => toggleLike(videoId)}
                className={`px-4 py-2 flex items-center gap-2 text-sm border-r border-[#3f3f3f] transition ${isLiked ? 'text-blue-400' : 'hover:bg-[#3f3f3f]'}`}
              >
                <ThumbsUp size={16} className={isLiked ? "fill-blue-400" : ""} /> 
                {video.likeCount ? video.likeCount.toLocaleString() : 'Suka'}
              </button>
              <button className="px-4 py-2 hover:bg-[#3f3f3f] text-sm transition">
                <ThumbsUp size={16} className="rotate-180" />
              </button>
            </div>
            <button className="bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] flex items-center gap-2 text-sm transition">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-[#272727] rounded-xl p-4 mt-2 hover:bg-[#3f3f3f] transition text-sm whitespace-pre-wrap break-words">
          <span className="font-bold">{video.viewCount?.toLocaleString()} x ditonton</span>
          <p className="mt-2 text-gray-300" dangerouslySetInnerHTML={{ __html: video.descriptionHtml || video.description || 'Tidak ada deskripsi.' }} />
        </div>

        {/* Comments Section */}
        <div className="mt-8 mb-16">
          <h2 className="text-xl font-bold mb-6">Komentar</h2>
          {!comments ? (
            <p className="text-gray-400 animate-pulse">Memuat komentar dari Invidious API...</p>
          ) : comments.comments && comments.comments.length > 0 ? (
            <div className="flex flex-col gap-5">
              {comments.comments.slice(0, 20).map((c: any) => (
                <div key={c.commentId} className="flex gap-4">
                  <img src={c.authorThumbnails?.[0]?.url || ''} className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0" alt="avatar" />
                  <div>
                    <p className="text-sm font-bold">{c.author} <span className="font-normal text-xs text-gray-400 ml-1">{c.publishedText}</span></p>
                    <p className="text-sm mt-1 text-gray-200" dangerouslySetInnerHTML={{ __html: c.contentHtml }} />
                    <div className="flex items-center gap-3 mt-2 text-gray-400">
                      <button className="hover:text-white flex items-center gap-1 text-xs"><ThumbsUp size={14}/> {c.likeCount}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Komentar dinonaktifkan atau tidak tersedia.</p>
          )}
        </div>
      </div>

      {/* Right Column (Related Videos Simulation) */}
      <div className="w-full lg:w-[400px] flex-shrink-0">
        <h3 className="font-bold text-lg mb-4">Video Terkait</h3>
        <p className="text-sm text-gray-400 bg-[#272727] p-3 rounded-lg flex gap-2">
          <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0"/>
          Video terkait untuk purwarupa ini mengambil dari hasil beranda.
        </p>
      </div>

    </div>
  );
}