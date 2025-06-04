// dashboard/settings/(admin-setting)/layout.tsx
import { redirect } from "next/navigation";

export default function AdminAccessLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = true; // Replace with actual logic
  if (!isAdmin) {
    redirect("/not-authorized");
  }

  return <>{children}</>;
}
