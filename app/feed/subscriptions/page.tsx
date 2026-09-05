"use client";

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';

export default function SubscriptionsPage() {
  const subscriptions = useStore(state => state.subscriptions);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Subscription Anda</h1>
      
      {subscriptions.length === 0 ? (
        <EmptyState message="Anda belum mensubscribe channel siapapun." />
      ) : (
        <div className="flex flex-col gap-4">
          {subscriptions.map(sub => (
            <div key={sub.id} className="flex items-center gap-4 bg-[#121212] p-4 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
                {sub.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{sub.name}</h3>
                <p className="text-sm text-gray-400">Channel tersimpan</p>
              </div>
              <button 
                className="bg-[#272727] hover:bg-[#3f3f3f] px-4 py-2 rounded-full font-semibold transition"
                onClick={() => useStore.getState().toggleSubscription(sub)}
              >
                Disubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}