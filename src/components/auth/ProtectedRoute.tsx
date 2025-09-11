"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("Admin" | "Waterboard")[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push("/login");
        return;
      }

      if (allowedRoles.length > 0 && user) {
        if (!allowedRoles.includes(user.role as any)) {
          toast.error("You don't have permission to access this page",{ closeButton: true });
          router.push("/dashboard");
        }
      }
    }
  }, [user, loading, requireAuth, allowedRoles, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role as any)) {
    return null;
  }

  return <>{children}</>;
}