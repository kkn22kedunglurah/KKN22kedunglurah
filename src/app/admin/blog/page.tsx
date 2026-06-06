"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiLoader, FiUpload } from "react-icons/fi";

interface Blog {
  id: string; slug: string; title: string; content: string; cover_image_url: string; created_at: string;
}

const emptyForm = { slug: "", title: "", content: "", cover_image_url: "" };

export default function AdminBlogPage() {
  const supabase = createClient();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `blog_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("gallery").upload(fileName, file);
    if (error) {
      alert(`Gagal mengupload gambar: ${error.message}\nPastikan Bucket "gallery" sudah dibuat dan Policy sudah diset ke public.`);
    } else {
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
      setForm({ ...form, cover_image_url: urlData.publicUrl });
    }
    setUploading(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  };

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (b: Blog) => {
    setForm({ slug: b.slug, title: b.title, content: b.content, cover_image_url: b.cover_image_url || "" });
    setEditId(b.id); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, slug: form.slug || generateSlug(form.title) };
    if (editId) { await supabase.from("blogs").update(payload).eq("id", editId); }
    else { await supabase.from("blogs").insert(payload); }
    setSaving(false); setShowForm(false); fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    await supabase.from("blogs").delete().eq("id", id); fetchBlogs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Kelola Blog</h1>
          <p className="text-muted-foreground mt-1">Tulis dan publikasikan catatan harian atau dokumentasi kegiatan.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all hover-lift">
          <FiPlus size={18} /> Tulis Artikel
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="relative w-full max-w-2xl bg-card rounded-2xl p-6 md:p-8 shadow-2xl border border-border z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">{editId ? "Edit Artikel" : "Tulis Artikel Baru"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Judul Artikel *</label>
                <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value, slug: generateSlug(e.target.value)})} required className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Slug URL</label>
                <input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="otomatis-dari-judul" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Upload Gambar Cover</label>
                <div className="relative mb-2">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-primary-foreground" />
                  {uploading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><FiLoader className="animate-spin text-primary" size={18} /></div>}
                </div>
                <label className="text-sm font-bold text-foreground block mb-1">Atau Tempelkan URL Gambar</label>
                <input value={form.cover_image_url} onChange={(e) => setForm({...form, cover_image_url: e.target.value})} placeholder="https://..." className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              {form.cover_image_url && (
                <div className="rounded-xl overflow-hidden border border-border mt-2">
                  <img src={form.cover_image_url} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Konten (Format Markdown) *</label>
                <textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} required rows={12} placeholder="# Judul&#10;&#10;Tulis konten menggunakan format Markdown di sini..." className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <><FiLoader className="animate-spin" /> Menyimpan...</> : <><FiSave size={18} /> Publikasikan</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
      ) : blogs.length > 0 ? (
        <div className="space-y-4">
          {blogs.map((b) => (
            <div key={b.id} className="glass p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground truncate">{b.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  /blog/{b.slug} • {new Date(b.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(b)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"><FiEdit2 size={16} /></button>
                <button onClick={() => handleDelete(b.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"><FiTrash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Artikel</h3>
          <p className="text-sm">Klik "Tulis Artikel" untuk membuat catatan harian pertama.</p>
        </div>
      )}
    </div>
  );
}
