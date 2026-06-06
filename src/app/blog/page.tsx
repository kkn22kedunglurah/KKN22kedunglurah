import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FiCalendar, FiArrowRight, FiBookOpen } from "react-icons/fi";

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();
  
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("id, slug, title, content, cover_image_url, created_at")
    .order("created_at", { ascending: false });

  const blogList = blogs || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container-custom">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Catatan <span className="text-gradient">Harian</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Dokumentasi perjalanan, cerita, dan perkembangan kegiatan pengabdian kami dari hari ke hari.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center mb-8">
              Terjadi kesalahan memuat artikel: {error.message}
            </div>
          )}

          {blogList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogList.map((blog) => (
                <Link href={`/blog/${blog.slug}`} key={blog.id} className="group block">
                  <article className="glass rounded-2xl overflow-hidden h-full flex flex-col hover-lift">
                    <div className="aspect-video w-full bg-secondary relative overflow-hidden">
                      {blog.cover_image_url ? (
                        <img 
                          src={blog.cover_image_url} 
                          alt={blog.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                          <FiBookOpen size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3">
                        <FiCalendar size={14} />
                        <time dateTime={blog.created_at}>
                          {new Date(blog.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </time>
                      </div>
                      <h2 className="text-xl font-display font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                        {/* Menghapus markdown tag kasar untuk preview teks */}
                        {blog.content.replace(/[#_*~`>\[\]\(\)]/g, '').substring(0, 150)}...
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Baca Selengkapnya <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-card mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
                <FiBookOpen size={28} className="text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Catatan</h3>
              <p>Artikel pertama akan diterbitkan setelah anggota tim memposting dokumentasi awal melalui Dashboard Admin.</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
