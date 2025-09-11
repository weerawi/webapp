export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}