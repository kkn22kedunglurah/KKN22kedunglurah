import { createClient } from "@/utils/supabase/server";
import { FiUsers, FiCheckSquare, FiEdit3, FiImage, FiMessageSquare, FiActivity } from "react-icons/fi";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts dari semua tabel secara paralel
  const [membersRes, prokersRes, blogsRes, galleryRes, guestbookRes] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("prokers").select("id", { count: "exact", head: true }),
    supabase.from("blogs").select("id", { count: "exact", head: true }),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
    supabase.from("guestbook").select("id", { count: "exact", head: true }).eq("is_approved", false),
  ]);

  const stats = [
    { label: "Anggota Tim", count: membersRes.count || 0, icon: FiUsers, href: "/admin/members", color: "text-blue-500 bg-blue-500/10" },
    { label: "Program Kerja", count: prokersRes.count || 0, icon: FiCheckSquare, href: "/admin/proker", color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Artikel Blog", count: blogsRes.count || 0, icon: FiEdit3, href: "/admin/blog", color: "text-purple-500 bg-purple-500/10" },
    { label: "Foto Galeri", count: galleryRes.count || 0, icon: FiImage, href: "/admin/gallery", color: "text-amber-500 bg-amber-500/10" },
    { label: "Pesan Menunggu", count: guestbookRes.count || 0, icon: FiMessageSquare, href: "/admin/guestbook", color: "text-rose-500 bg-rose-500/10" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang di panel admin KKN Kelompok 22 Kedunglurah.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="glass p-6 rounded-2xl hover-lift block">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={26} />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">{stat.count}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass p-6 md:p-8 rounded-2xl">
        <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <FiActivity className="text-primary" /> Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/members" className="p-4 bg-secondary hover:bg-secondary/80 rounded-xl text-center font-medium text-sm transition-colors">
            + Tambah Anggota
          </Link>
          <Link href="/admin/proker" className="p-4 bg-secondary hover:bg-secondary/80 rounded-xl text-center font-medium text-sm transition-colors">
            + Tambah Proker
          </Link>
          <Link href="/admin/blog" className="p-4 bg-secondary hover:bg-secondary/80 rounded-xl text-center font-medium text-sm transition-colors">
            + Tulis Artikel
          </Link>
          <Link href="/admin/gallery" className="p-4 bg-secondary hover:bg-secondary/80 rounded-xl text-center font-medium text-sm transition-colors">
            + Upload Foto
          </Link>
        </div>
      </div>
    </div>
  );
}
