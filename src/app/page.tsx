import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Countdown from "@/components/Countdown";
import Link from "next/link";
import { FiArrowRight, FiUsers, FiCheckCircle, FiImage } from "react-icons/fi";

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full w-full bg-background -z-20"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/10 via-transparent to-transparent blur-3xl -z-10"></div>
        
        <div className="container-custom relative z-10 flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm text-sm font-medium text-muted-foreground mb-8 hover-lift">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Menuju Pengabdian 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
            Sinergi Membangun <br className="hidden md:block" />
            <span className="text-gradient">Desa Kedunglurah</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
            "Karsa Bersama, Mengabdi dengan Hati, Membangun Kedunglurah yang Mandiri." 
            Platform dokumentasi dan rekam jejak program kerja KKN Kelompok 22.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
            <Link
              href="/proker"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Lihat Program Kerja <FiArrowRight />
            </Link>
            <Link
              href="/team"
              className="px-8 py-4 bg-card border border-border text-foreground rounded-full font-bold hover:bg-secondary transition-all flex items-center justify-center"
            >
              Kenali Tim Kami
            </Link>
          </div>

          {/* Countdown Widget */}
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Countdown />
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 bg-secondary/30 border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover-lift">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <FiUsers size={28} />
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground mb-2">23</h3>
              <p className="text-muted-foreground font-medium">Mahasiswa Mengabdi</p>
              <p className="text-sm text-muted-foreground/80 mt-2">Terbagi dalam 4 Divisi Fungsional</p>
            </div>
            
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover-lift">
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6">
                <FiCheckCircle size={28} />
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground mb-2">0</h3>
              <p className="text-muted-foreground font-medium">Program Kerja</p>
              <p className="text-sm text-muted-foreground/80 mt-2">Dalam tahap perencanaan</p>
            </div>

            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center hover-lift">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <FiImage size={28} />
              </div>
              <h3 className="text-4xl font-display font-bold text-foreground mb-2">0</h3>
              <p className="text-muted-foreground font-medium">Galeri Momen</p>
              <p className="text-sm text-muted-foreground/80 mt-2">Segera hadir setelah penerjunan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Village Map / Info Section placeholder */}
      <section className="py-24 relative">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                Lokasi Pengabdian
              </h2>
              <div className="w-20 h-1.5 bg-primary rounded-full"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Desa Kedunglurah terletak di Kecamatan Pogalan, Kabupaten Trenggalek, Jawa Timur. 
                Desa ini memiliki potensi besar di bidang UMKM dan Agrikultur yang menjadi fokus utama 
                pengembangan inovasi kelompok KKN kami.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">1</div>
                  <span>Pengembangan Ekonomi Kreatif (UMKM)</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">2</div>
                  <span>Literasi Digital & Teknologi Informasi</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">3</div>
                  <span>Kesehatan Masyarakat & Lingkungan Bersih</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2">
              {/* Map Placeholder */}
              <div className="aspect-video bg-secondary border border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                <div className="w-16 h-16 rounded-full bg-background shadow-lg flex items-center justify-center text-primary mb-4 animate-bounce relative z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <p className="font-display font-bold text-xl text-foreground relative z-10">Desa Kedunglurah</p>
                <p className="text-sm relative z-10">Kec. Pogalan, Trenggalek</p>
                
                {/* Decorative map lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
