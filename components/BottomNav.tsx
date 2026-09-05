"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlaySquare, Youtube, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/shorts', label: 'Shorts', icon: Youtube },
    { href: '/feed/subscriptions', label: 'Subscription', icon: PlaySquare },
    { href: '/feed/profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-[#303030] z-50 flex justify-around items-center pb-safe">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className="flex flex-col items-center justify-center w-full py-2"
          >
            <Icon 
              size={22} 
              className={cn("mb-1", isActive ? "text-white fill-white" : "text-gray-400")} 
            />
            <span className={cn("text-[10px]", isActive ? "text-white font-bold" : "text-gray-400")}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}