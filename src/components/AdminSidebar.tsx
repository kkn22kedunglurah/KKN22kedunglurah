"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FiHome, FiUsers, FiCheckSquare, FiEdit3, FiImage, FiMessageSquare, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const adminLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: FiHome },
  { name: "Anggota", path: "/admin/members", icon: FiUsers },
  { name: "Proker", path: "/admin/proker", icon: FiCheckSquare },
  { name: "Blog", path: "/admin/blog", icon: FiEdit3 },
  { name: "Galeri", path: "/admin/gallery", icon: FiImage },
  { name: "Buku Tamu", path: "/admin/guestbook", icon: FiMessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="font-display font-bold text-lg text-gradient">Admin KKN 22</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-2">
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border">
          <Link href="/admin/dashboard" className="font-display font-bold text-xl text-gradient">
            Admin KKN 22
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Panel Pengelolaan</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <FiHome size={18} />
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all w-full"
          >
            <FiLogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
