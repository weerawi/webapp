"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VantaWaves from "@/components/effects/VantaWaves";
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { LogOut } from 'lucide-react';

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

  return (
    <>
      <VantaWaves />
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
    </>
  );
}