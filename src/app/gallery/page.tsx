import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { FiImage, FiCamera } from "react-icons/fi";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 60;

export default async function GalleryPage() {
  const supabase = await createClient();
  
  const { data: gallery, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  const galleryList = gallery || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container-custom">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Galeri <span className="text-gradient">Dokumentasi</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Jejak visual kegiatan dan momen pengabdian kami di Desa Kedunglurah.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center mb-8">
              Terjadi kesalahan memuat galeri: {error.message}
            </div>
          )}

          {galleryList.length > 0 ? (
            <GalleryGrid items={galleryList} />
          ) : (
            <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground max-w-2xl mx-auto mt-12 hover-lift">
              <div className="w-20 h-20 bg-card mx-auto rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-border">
                <FiCamera size={36} className="text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-display">Album Masih Kosong</h3>
              <p className="text-lg">Foto-foto keseruan dan dokumentasi proker akan segera diunggah setelah KKN dimulai.</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
