"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#212121] rounded-t-2xl z-[70] max-h-[85vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-4 border-b border-[#3f3f3f]">
              <h2 className="font-bold text-lg">{title}</h2>
              <button onClick={onClose} className="p-1 hover:bg-[#3f3f3f] rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}