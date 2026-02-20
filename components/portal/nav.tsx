"use client";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Building2, Home, ImageIcon, LogOut, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortalNavProps {
  propName: string;
  pendingVisits: number;
}

export default function PortalNav({ propName, pendingVisits }: PortalNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  const links = [
    { href: "/portal",            label: "Mi propiedad", icon: Home,      badge: pendingVisits },
    { href: "/portal/fotos",      label: "Fotos",         icon: ImageIcon, badge: 0 },
    { href: "/portal/documentos", label: "Documentos",    icon: FileText,  badge: 0 },
    { href: "/portal/settings",   label: "Cuenta",        icon: Settings,  badge: 0 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-cima-border bg-cima-card/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-cima-gold/10 border border-cima-gold/30 flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-cima-gold" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-xs text-cima-text">Cima</span>
            <span className="font-mono text-[8px] tracking-widest text-cima-text-dim uppercase">Portal</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                pathname === href
                  ? "bg-cima-gold/10 text-cima-gold"
                  : "text-cima-text-muted hover:bg-cima-surface hover:text-cima-text"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 text-[9px] font-bold text-cima-bg flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-7 w-7 rounded-full bg-cima-gold/10 border border-cima-gold/20 items-center justify-center">
            <span className="font-bold text-[10px] text-cima-gold">{propName.charAt(0).toUpperCase()}</span>
          </div>
          <span className="hidden sm:block text-xs text-cima-text-muted max-w-[120px] truncate">{propName}</span>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-cima-text-muted hover:bg-cima-surface hover:text-red-400 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="sm:hidden flex border-t border-cima-border">
        {links.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              pathname === href ? "text-cima-gold" : "text-cima-text-muted"
            )}
          >
            <span className="relative">
              <Icon className="h-4 w-4" />
              {badge > 0 && (
                <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-amber-400 text-[8px] font-bold text-cima-bg flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </span>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
