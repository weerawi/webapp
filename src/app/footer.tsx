"use client";
import Image from "next/image";
import hegraLogo from "@/assets/hegra.jpg";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src={hegraLogo}
              alt="Hegra Logo"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-sm font-medium text-white">Water Board Management System</span>
            <span className="text-xs">Powered by Hegra Innovation</span>
          </div>
          
          <div className="text-xs text-right">
            <p>© {new Date().getFullYear()} Hegra Innovation. All rights reserved.</p> 
          </div>
        </div>
      </div>
    </footer>
  );
}