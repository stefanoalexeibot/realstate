import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cima-bg">
      <AdminSidebar />
      {/* Desktop: offset for sidebar; Mobile: offset for top bar */}
      <main className="lg:pl-60 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
