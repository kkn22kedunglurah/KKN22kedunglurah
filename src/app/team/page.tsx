import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";

// Definisi Divisi
const DIVISIONS = [
  "Pimpinan Kelompok",
  "Divisi A: Ekonomi Kreatif",
  "Divisi B: IT dan Teknologi",
  "Divisi C: Pendidikan dan Keorganisasian",
  "Divisi D: Kesehatan dan Lingkungan"
];

// Revalidate data setiap jam (3600 detik) untuk performa ISR
export const revalidate = 3600;

export default async function TeamPage() {
  const supabase = await createClient();
  
  // Mengambil data anggota dari Supabase
  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: true });

  // Mengelompokkan anggota berdasarkan divisi
  const groupedMembers = DIVISIONS.reduce((acc, division) => {
    acc[division] = members?.filter((m) => m.division === division) || [];
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container-custom">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Tim <span className="text-gradient">Kami</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Kenali lebih dekat mahasiswa pengabdi di balik program-program inovatif KKN Kelompok 22 Kedunglurah.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center mb-8">
              Terjadi kesalahan saat memuat data tim. Silakan periksa koneksi Supabase Anda.
            </div>
          )}

          <div className="space-y-24">
            {DIVISIONS.map((division) => (
              <section key={division} className="scroll-mt-32" id={division.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}>
                <div className="border-b border-border pb-4 mb-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {division}
                  </h2>
                </div>

                {groupedMembers[division].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groupedMembers[division].map((member) => (
                      <div key={member.id} className="glass p-6 rounded-2xl flex flex-col items-center text-center hover-lift">
                        <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden mb-4 border-2 border-border shadow-inner">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground/30">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-lg text-foreground mb-1">{member.name}</h3>
                        <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
                        {member.major && <p className="text-xs text-muted-foreground mb-4">{member.major}</p>}
                        
                        <div className="flex gap-3 mt-auto pt-4">
                          {member.instagram_url && (
                            <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                              <FiInstagram size={18} />
                            </a>
                          )}
                          {member.linkedin_url && (
                            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                              <FiLinkedin size={18} />
                            </a>
                          )}
                          {member.github_url && (
                            <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                              <FiGithub size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-8 text-center text-muted-foreground">
                    <p className="font-medium mb-2">Anggota Divisi Belum Ditambahkan</p>
                    <p className="text-sm">Data anggota {division} akan segera diperbarui melalui sistem admin.</p>
                  </div>
                )}
              </section>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
