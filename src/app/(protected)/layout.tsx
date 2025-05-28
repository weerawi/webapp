"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import { redirect } from 'next/navigation';
// import Breadcrumb from "@/components/navigation/Breadcrumb";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
    // Do not return null immediately after redirect
  }

  // If authenticated, render the children (the protected page)
  return <>{children}</>;
} 