import Link from "next/link";
import { FiInstagram, FiMessageCircle } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="container-custom pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src="/logo-kampus.png" alt="Logo Kampus" className="w-14 h-14 object-contain bg-white rounded-full border-2 border-border p-1" />
              <img src="/logo-trenggalek.png" alt="Logo Trenggalek" className="w-14 h-14 object-contain bg-white rounded-full border-2 border-border p-1" />
              <img src="/logo-kkn.png" alt="Logo KKN" className="w-16 h-16 object-contain bg-white rounded-full border-2 border-border p-1" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground mb-4">
              KKN Kelompok <span className="text-primary">22</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Situs web resmi Mahasiswa Kuliah Kerja Nyata (KKN) Kelompok 22 Universitas Yudharta Pasuruan di Desa Kedunglurah, Kec. Pogalan, Kab. Trenggalek.
            </p>
            <p className="text-sm text-foreground/80 mt-4">
              Desa Kedunglurah, Kec. Pogalan, Kab. Trenggalek, Jawa Timur
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg text-foreground">Menu Pintas</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground hover:text-primary transition-colors">
                  Profil Tim
                </Link>
              </li>
              <li>
                <Link href="/proker" className="text-muted-foreground hover:text-primary transition-colors">
                  Program Kerja
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Dokumentasi & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg text-foreground">Terhubung</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/kkntrenggalek22"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors hover-lift"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://tiktok.com/@kkn.trenggalek_22"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors hover-lift"
                aria-label="TikTok"
              >
                <SiTiktok size={18} />
              </a>
            </div>
            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs text-muted-foreground">
                DPL: Sucipto, ST., MT.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} KKN Kelompok 22 Kedunglurah. Hak Cipta Dilindungi.
          </p>
          <div className="text-xs text-muted-foreground/60 flex items-center gap-1">
            Dibuat dengan <span className="text-red-500">❤️</span> dan Next.js
          </div>
        </div>
      </div>
    </footer>
  );
}
