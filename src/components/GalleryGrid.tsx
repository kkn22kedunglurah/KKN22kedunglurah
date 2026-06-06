"use client";

import { useState } from "react";
import { FiX, FiZoomIn } from "react-icons/fi";

export default function GalleryGrid({ items }: { items: any[] }) {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  // Close lightbox on escape key
  if (typeof window !== "undefined") {
    window.onkeydown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-secondary shadow-sm hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedImage(item)}
          >
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <FiZoomIn size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                {item.category || "Dokumentasi"}
              </span>
              <h3 className="text-white font-display font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-zoom-out" 
            onClick={() => setSelectedImage(null)}
          ></div>
          
          <div className="relative w-full max-w-5xl bg-background rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 animate-in zoom-in-95 duration-300">
            
            {/* Close Button Mobile */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="md:hidden absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md z-20"
            >
              <FiX size={20} />
            </button>

            <div className="w-full md:w-2/3 bg-black flex items-center justify-center min-h-[40vh] md:min-h-[70vh]">
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title} 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full tracking-wider">
                  {selectedImage.category || "Dokumentasi"}
                </span>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="hidden md:flex text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                {selectedImage.title}
              </h3>
              
              {selectedImage.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {selectedImage.description}
                </p>
              )}
              
              <div className="mt-auto pt-6 border-t border-border text-xs text-muted-foreground font-medium">
                Diunggah pada: {new Date(selectedImage.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
