import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
        <div className="flex justify-between items-center h-20">

          <div className="flex items-center group cursor-pointer">
            <img
              src="/images/Untitled_Artwork.png"
              alt="Logo"
              className="w-30 h-30 object-contain relative -left-2"
            />
            <div className="flex flex-col justify-center -ml-6 mt-2">
              <span className="text-xl font-bold tracking-tight text-[#1a1a1a] leading-none mb-1">
                BloomBridge
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wide">
                For every child.
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12">

            <div className="h-4 w-[1px] bg-gray-200" />

            <button className="px-8 py-3 bg-[#EF90B9] text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#d4709e] transition-all active:scale-95 shadow-lg shadow-[#EF90B9]/30">
              Contact
            </button>
          </div>

          <div className="lg:hidden">
            <button className="p-2 text-[#1a1a1a]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}