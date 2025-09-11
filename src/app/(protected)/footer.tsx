"use client";
import Image from "next/image";
import hegraLogo from "@/assets/hegra.jpg";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-3 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Image
              src={hegraLogo}
              alt="Hegra Logo"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-xs sm:text-sm font-medium text-white">Water Board Management System</span>
            <span className="text-xs hidden sm:inline">Powered by Hegra Innovation</span>
          </div>
          
          <div className="text-xs text-center sm:text-right">
            <p>© {new Date().getFullYear()} Hegra Innovation. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}