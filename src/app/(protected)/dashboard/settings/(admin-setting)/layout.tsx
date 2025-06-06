// dashboard/settings/(admin-setting)/layout.tsx
// import { redirect } from "next/navigation";

// export default function AdminAccessLayout({ children }: { children: React.ReactNode }) {
//   const isAdmin = true; // Replace with actual logic
//   if (!isAdmin) {
//     redirect("/not-authorized");
//   }

//   return <>{children}</>;
// }


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      // Only Admin users can access admin settings
      if (user.role !== "Admin") {
        toast.error("You don't have permission to access this page");
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || user.role !== "Admin") {
    return null;
  }

  return <>{children}</>;
}