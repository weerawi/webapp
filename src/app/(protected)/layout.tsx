"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import { redirect } from 'next/navigation'; 
import Footer from './footer';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <Footer />
    </div>
  );
}