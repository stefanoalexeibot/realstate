"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Building2, LayoutDashboard, Home, Calendar, Users, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/admin",             icon: LayoutDashboard },
  { label: "Propiedades", href: "/admin/propiedades",  icon: Home },
  { label: "Visitas",     href: "/admin/visitas",      icon: Calendar },
  { label: "Leads",       href: "/admin/leads",        icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const content = (
    <>
      <div className="flex h-16 items-center px-5 border-b border-cima-border">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-cima-gold" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-xs text-cima-text">Cima</span>
            <span className="font-mono text-[8px] tracking-widest text-cima-text-dim uppercase">Admin</span>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-cima-text-muted hover:text-cima-text">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-cima-gold/10 text-cima-gold"
                  : "text-cima-text-muted hover:bg-cima-surface hover:text-cima-text"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cima-border p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cima-text-muted hover:bg-cima-surface hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-cima-border bg-cima-card px-4 lg:hidden">
        <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-heading font-bold text-sm text-cima-text">Cima Admin</span>
        <div className="w-8" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-60 flex-col border-r border-cima-border bg-cima-card">
        {content}
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Mobile drawer */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 flex flex-col border-r border-cima-border bg-cima-card transition-transform duration-300 lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {content}
      </aside>
    </>
  );
}
