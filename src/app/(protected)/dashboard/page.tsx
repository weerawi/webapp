"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";  
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function DashboardHome() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect will be handled by the protected layout due to auth state change
    } catch (error) {
      console.error("Error signing out: ", error);
      // Optionally, show an error message to the user
    }
  };

  // vantajs wave adding start
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      const initVanta = async () => {
        try {
          // Load THREE.js from CDN first
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
          
          // Wait a bit for THREE to be available
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (!window.THREE) {
            console.error('THREE.js failed to load');
            return;
          }
          
          // Now load Vanta WAVES instead of birds
          const vantaModule = await import('vanta/dist/vanta.waves.min');
          const VANTA = vantaModule.default;
          
          if (vantaRef.current && !vantaEffect) {
            const effect = VANTA({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              // Wave-specific options
              color: 0x6188,
              shininess: 30,
              waveHeight: 20,
              waveSpeed: 1,
              zoom: 0.75
            });
            setVantaEffect(effect);
          }
        } catch (error) {
          console.error('Error loading Vanta effect:', error);
        }
      };
      
      initVanta();
    }
    
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  // vantajs end

  return (
    <div className="relative min-h-screen"> 
      <div 
        ref={vantaRef} 
        className="fixed inset-0 -z-10"
      />

      <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
        <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 w-[600px]">
          <Link href="/dashboard/staff">
            <Button 
              className="w-full h-12 text-lg cursor-pointer hover:animate-none transition-all duration-300 hover:scale-105"
            >
              Staff
            </Button>
          </Link>
          <Link href="/dashboard/report">
            <Button 
              className="w-full h-12 text-lg cursor-pointer hover:animate-none transition-all duration-300 hover:scale-105"
            >
              Report
            </Button>
          </Link>
          <Link href="/dashboard/water-board">
            <Button 
              className="w-full h-12 text-lg cursor-pointer hover:animate-none transition-all duration-300 hover:scale-105"
            >
              Water Board
            </Button>
          </Link>
          <Link href="/dashboard/live-location">
            <Button 
              className="w-full h-12 text-lg cursor-pointer hover:animate-none transition-all duration-300 hover:scale-105"
            >
              Live Location
            </Button>
          </Link>
          <Link href="/dashboard/settings" className="col-span-2">
            <Button 
              className="w-full h-12 text-lg cursor-pointer hover:animate-none transition-all duration-300 hover:scale-105"
            >
              Settings
            </Button>
          </Link>
        </div>
        <div 
          className="absolute bottom-4 right-4 cursor-pointer text-white hover:text-red-500 transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut size={32} />
        </div>
      </div>
    </div>
  );
}