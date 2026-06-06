"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiPlus, FiTrash2, FiX, FiSave, FiLoader, FiUpload } from "react-icons/fi";

interface GalleryItem {
  id: string; title: string; description: string; image_url: string; category: string; created_at: string;
}

const CATEGORIES = ["Sosialisasi", "Gotong Royong", "Mengajar", "Keagamaan", "Kesehatan", "UMKM", "Keseruan", "Lainnya"];
const emptyForm = { title: "", description: "", image_url: "", category: CATEGORIES[0] };

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("gallery").upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
      setForm({ ...form, image_url: urlData.publicUrl });
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await supabase.from("gallery").insert(form);
    setSaving(false); setShowForm(false); setForm(emptyForm); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;
    await supabase.from("gallery").delete().eq("id", id); fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Kelola Galeri</h1>
          <p className="text-muted-foreground mt-1">Unggah foto dokumentasi kegiatan KKN.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowForm(true); }} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all hover-lift">
          <FiPlus size={18} /> Upload Foto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl p-6 md:p-8 shadow-2xl border border-border z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">Upload Foto Baru</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Judul Foto *</label>
                <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Upload Gambar (ke Supabase Storage)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-primary-foreground" />
                  {uploading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><FiLoader className="animate-spin text-primary" size={18} /></div>}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Atau Tempelkan URL Gambar</label>
                <input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} placeholder="https://..." className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              {form.image_url && (
                <div className="rounded-xl overflow-hidden border border-border">
                  <img src={form.image_url} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <button type="submit" disabled={saving || !form.image_url} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <><FiLoader className="animate-spin" /> Mengunggah...</> : <><FiUpload size={18} /> Publikasikan Foto</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-secondary border border-border">
              <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                <p className="text-white/60 text-xs mb-3">{item.category}</p>
                <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors flex items-center gap-1">
                  <FiTrash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Foto</h3>
          <p className="text-sm">Klik "Upload Foto" untuk mulai mengunggah dokumentasi.</p>
        </div>
      )}
    </div>
  );
}
