import './globals.css'
import BottomNav from '@/components/BottomNav'
import { Video } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'NexStream - V2',
  description: 'Ultimate Next.js Streaming Interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-[#0f0f0f] text-white min-h-screen flex flex-col font-sans">
        
        {/* Top Navbar */}
        <nav className="flex justify-between items-center px-4 py-3 bg-[#0f0f0f] border-b border-[#303030] sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter hover:opacity-80 transition">
            <div className="bg-red-600 p-1.5 rounded-xl shadow-lg shadow-red-600/20">
              <Video size={18} className="text-white" fill="white" />
            </div>
            Nex<span className="text-red-500">Stream</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/feed/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-sm shadow-lg cursor-pointer">
              X
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar (hidden on mobile) */}
          <aside className="hidden md:flex w-64 flex-col gap-2 p-4 border-r border-[#303030] bg-[#0f0f0f] overflow-y-auto">
            <Link href="/" className="px-4 py-3 rounded-xl hover:bg-[#272727] font-semibold transition">Beranda</Link>
            <Link href="/shorts" className="px-4 py-3 rounded-xl hover:bg-[#272727] font-semibold transition">Shorts</Link>
            <Link href="/feed/subscriptions" className="px-4 py-3 rounded-xl hover:bg-[#272727] font-semibold transition">Subscription</Link>
            <hr className="border-[#303030] my-2" />
            <Link href="/feed/profile" className="px-4 py-3 rounded-xl hover:bg-[#272727] font-semibold transition">Profil Saya</Link>
          </aside>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative">
            {children}
          </main>
        </div>

        <BottomNav />
      </body>
    </html>
  )
}