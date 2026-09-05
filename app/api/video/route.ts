import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const instances = [
    "https://vid.puffyan.us/api/v1",
    "https://invidious.jing.rocks/api/v1",
    "https://invidious.flokinet.to/api/v1"
  ];

  for (const url of instances) {
    try {
      const res = await fetch(`${url}/videos/${id}`, { next: { revalidate: 60 } });
      if (res.ok) {
        const data = await res.json();
        if (data.videoId) {
          // Extract playable URL
          let playableUrl = "";
          if (data.formatStreams && data.formatStreams.length > 0) {
            // Find highest resolution MP4
            const mp4 = data.formatStreams.find((s:any) => s.container === 'mp4' && s.resolution === '720p') 
                     || data.formatStreams.find((s:any) => s.container === 'mp4')
                     || data.formatStreams[0];
            playableUrl = mp4.url;
          } else if (data.hlsUrl) {
            playableUrl = data.hlsUrl;
          }
          data.playableUrl = playableUrl;
          return NextResponse.json(data);
        }
      }
    } catch (e) {}
  }

  // Fallback Mock with custom valid video URL for player
  const mock = {
    videoId: id, 
    title: "Video Menarik di XyTube", 
    author: "XyTube Creator", 
    descriptionHtml: "Video ini dimuat menggunakan sistem Fallback karena server YouTube publik sedang memblokir request data center.<br><br><b>Namun, kami telah memasang custom player buat sendiri dengan fallback video nyata (Big Buck Bunny) agar Anda tetap bisa mengetes Player dan Komentar!</b><br><br>Selamat menikmati XyTube!", 
    viewCount: 2504123,
    likeCount: 154000,
    subCountText: "2.4M",
    lengthSeconds: 596,
    isLive: false,
    authorThumbnails: [{url: "https://api.dicebear.com/7.x/avataaars/svg?seed=XyTube"}],
    // High quality standard test video MP4 for custom player fallback
    playableUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  };

  return NextResponse.json(mock);
}