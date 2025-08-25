"use client";

import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from "sonner";
import Footer from './footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col">
        <Providers>
          {/* Main content area that accounts for footer height */}
          <main className="flex-1 pb-16">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}