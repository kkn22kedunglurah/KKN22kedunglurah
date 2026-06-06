import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { FiCheckCircle, FiClock, FiActivity } from "react-icons/fi";

export const revalidate = 60; // Revalidate tiap menit

export default async function ProkerPage() {
  const supabase = await createClient();
  
  const { data: prokers, error } = await supabase
    .from("prokers")
    .select("*")
    .order("created_at", { ascending: false });

  // Fallback state jika belum ada data
  const prokerList = prokers || [];

  const completedCount = prokerList.filter(p => p.status === 'Selesai').length;
  const inProgressCount = prokerList.filter(p => p.status === 'Sedang Berjalan').length;
  const notStartedCount = prokerList.filter(p => p.status === 'Belum Mulai').length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container-custom">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Program <span className="text-gradient">Kerja</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Pelacakan progres dan status setiap inisiatif kelompok KKN 22 secara transparan.
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary text-muted-foreground rounded-full flex items-center justify-center">
                <FiClock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Belum Mulai</p>
                <p className="text-2xl font-bold font-display">{notStartedCount}</p>
              </div>
            </div>
            <div className="glass p-6 rounded-2xl flex items-center gap-4 border-primary/20">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <FiActivity size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Sedang Berjalan</p>
                <p className="text-2xl font-bold font-display">{inProgressCount}</p>
              </div>
            </div>
            <div className="glass p-6 rounded-2xl flex items-center gap-4 border-emerald-500/20">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <FiCheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-500">Selesai</p>
                <p className="text-2xl font-bold font-display">{completedCount}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center mb-8">
              Terjadi kesalahan memuat data: {error.message}
            </div>
          )}

          {/* Proker List */}
          {prokerList.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {prokerList.map((proker) => (
                <div key={proker.id} className="glass p-6 md:p-8 rounded-2xl hover-lift">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-secondary text-muted-foreground text-xs font-bold uppercase rounded-full tracking-wider">
                      {proker.category}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      proker.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      proker.status === 'Sedang Berjalan' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-secondary text-muted-foreground border-border'
                    }`}>
                      {proker.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
                    {proker.title}
                  </h3>
                  
                  {proker.description && (
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      {proker.description}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-foreground">Progres</span>
                      <span className="text-primary">{proker.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          proker.status === 'Selesai' ? 'bg-emerald-500' : 'bg-primary'
                        }`}
                        style={{ width: `${proker.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-card mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
                <FiCheckCircle size={28} className="text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Program Kerja</h3>
              <p className="max-w-md mx-auto">Daftar program kerja akan muncul di sini setelah diinput melalui Dashboard Admin.</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
