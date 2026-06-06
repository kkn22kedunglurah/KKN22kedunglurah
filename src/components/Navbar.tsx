"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";

const navLinks = [
  { name: "Beranda", path: "/" },
  { name: "Tim", path: "/team" },
  { name: "Proker", path: "/proker" },
  { name: "Blog", path: "/blog" },
  { name: "Galeri", path: "/gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Theme setup
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(isDark ? "dark" : "light");

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-3 z-50">
          <div className="flex items-center -space-x-2 hover:-space-x-0 transition-all duration-300">
            <a href="https://yudharta.ac.id/id/" target="_blank" rel="noopener noreferrer" className="z-0 hover:z-30 transition-transform hover:scale-110">
              <img src="/logo-kampus.png" alt="Logo Kampus" className="w-10 h-10 md:w-12 md:h-12 object-contain bg-white rounded-full border-2 border-background shadow-sm" />
            </a>
            <a href="https://kedunglurah-pogalan.trenggalekkab.go.id/first" target="_blank" rel="noopener noreferrer" className="z-10 hover:z-30 transition-transform hover:scale-110">
              <img src="/logo-trenggalek.png" alt="Logo Trenggalek" className="w-10 h-10 md:w-12 md:h-12 object-contain bg-white rounded-full border-2 border-background shadow-sm" />
            </a>
            <Link href="/" className="z-20 hover:z-30 transition-transform hover:scale-110">
              <img src="/logo-kkn.png" alt="Logo KKN 22" className="w-11 h-11 md:w-14 md:h-14 object-contain bg-white rounded-full border-2 border-background shadow-md" />
            </Link>
          </div>
          <Link href="/" className="hidden sm:block">
            <span className="font-display font-bold text-xl md:text-2xl text-foreground block leading-none">KKN <span className="text-primary">22</span></span>
            <span className="text-xs text-muted-foreground font-medium">Kedunglurah</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium text-sm transition-colors hover:text-primary ${
                  pathname === link.path ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-border pl-4">
            <button
              onClick={toggleTheme}
              className="text-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
            
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity hover-lift"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="text-foreground p-2 rounded-full"
          >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground p-2"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full glass border-t border-border shadow-lg md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-medium p-3 rounded-lg ${
                  pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center mt-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
