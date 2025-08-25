"use client";

import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from "sonner";
import Footer from './footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen pb-20"> {/* pb matches footer height */}
        <Providers>
          <main>
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </Providers>
        <footer className="z-50 fixed bottom-0 left-0 w-full h-10flex items-center justify-center shadow">
          
          <Footer/>
        </footer>
      </body>
    </html>
  );
}