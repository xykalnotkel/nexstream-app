import { NextResponse } from 'next/server';

export const runtime = 'edge';

const mockData = [
	{videoId: "0e3GPea1Tyg", title: "MrBeast Squid Game Dalam Kehidupan Nyata!", author: "MrBeast", viewCount: 540000000, lengthSeconds: 1542, isLive: false},
	{videoId: "84_O4G9F2d8", title: "Beli PS5 Pro Seharga Rp 10 Juta!", author: "GadgetIn", viewCount: 2100000, lengthSeconds: 750, isLive: false},
	{videoId: "f62Z8Mmms2g", title: "Tutorial Next.js & React 2026 Lengkap", author: "Programming Indo", viewCount: 1500000, lengthSeconds: 3600, isLive: false},
	{videoId: "qZq5F8N-Ggc", title: "Genshin Impact - Main Sampai Pagi!", author: "Windah Basudara", viewCount: 3500000, lengthSeconds: 10800, isLive: false},
	{videoId: "1-xGerv5FOk", title: "10 Penemuan Teknologi Paling Gila di 2026!", author: "Calon Ilmuwan", viewCount: 8500000, lengthSeconds: 650, isLive: false},
	{videoId: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to", author: "Lofi Girl", viewCount: 15000000, lengthSeconds: 0, isLive: true}
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || 'trending';
  
  const endpoint = q === 'trending' ? '/popular' : `/search?q=${encodeURIComponent(q)}`;
  const instances = [
    "https://vid.puffyan.us/api/v1",
    "https://invidious.jing.rocks/api/v1",
    "https://invidious.flokinet.to/api/v1"
  ];

  for (const url of instances) {
    try {
      const res = await fetch(url + endpoint, { next: { revalidate: 60 } });
      if (res.ok) {
        const data = await res.json();
        // Check array
        if (Array.isArray(data) && data.length > 0) {
          return NextResponse.json(data);
        }
      }
    } catch (e) {
      // ignore and try next
    }
  }

  // Fallback
  return NextResponse.json(mockData);
}