"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiLoader } from "react-icons/fi";

const CATEGORIES = ["Fisik", "Non-Fisik", "Sosial", "Keagamaan", "Edukasi", "Kesehatan", "Lainnya"];
const STATUSES = ["Belum Mulai", "Sedang Berjalan", "Selesai"];

interface Proker {
  id: string; title: string; description: string; category: string;
  status: string; progress: number; target_date: string;
}

const emptyForm = { title: "", description: "", category: CATEGORIES[0], status: STATUSES[0], progress: 0, target_date: "" };

export default function AdminProkerPage() {
  const supabase = createClient();
  const [prokers, setProkers] = useState<Proker[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchProkers = async () => {
    setLoading(true);
    const { data } = await supabase.from("prokers").select("*").order("created_at", { ascending: false });
    setProkers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProkers(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (p: Proker) => {
    setForm({ title: p.title, description: p.description || "", category: p.category, status: p.status, progress: p.progress, target_date: p.target_date || "" });
    setEditId(p.id); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, progress: Number(form.progress), target_date: form.target_date || null };
    if (editId) { await supabase.from("prokers").update(payload).eq("id", editId); }
    else { await supabase.from("prokers").insert(payload); }
    setSaving(false); setShowForm(false); fetchProkers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus program kerja ini?")) return;
    await supabase.from("prokers").delete().eq("id", id); fetchProkers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Kelola Program Kerja</h1>
          <p className="text-muted-foreground mt-1">Pantau dan perbarui status setiap program kerja.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all hover-lift">
          <FiPlus size={18} /> Tambah
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl p-6 md:p-8 shadow-2xl border border-border z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">{editId ? "Edit Proker" : "Tambah Proker Baru"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Judul Proker *</label>
                <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-foreground block mb-1">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Progres: {form.progress}%</label>
                <input type="range" min="0" max="100" step="5" value={form.progress} onChange={(e) => setForm({...form, progress: Number(e.target.value)})} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Target Tanggal</label>
                <input type="date" value={form.target_date} onChange={(e) => setForm({...form, target_date: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <><FiLoader className="animate-spin" /> Menyimpan...</> : <><FiSave size={18} /> Simpan</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
      ) : prokers.length > 0 ? (
        <div className="space-y-4">
          {prokers.map((p) => (
            <div key={p.id} className="glass p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-secondary text-muted-foreground">{p.category}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    p.status === "Selesai" ? "bg-emerald-500/10 text-emerald-500" :
                    p.status === "Sedang Berjalan" ? "bg-primary/10 text-primary" :
                    "bg-secondary text-muted-foreground"
                  }`}>{p.status}</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">{p.title}</h3>
                <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${p.status === "Selesai" ? "bg-emerald-500" : "bg-primary"}`} style={{ width: `${p.progress}%` }}></div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 inline-block">{p.progress}%</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"><FiEdit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"><FiTrash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Proker</h3>
          <p className="text-sm">Klik tombol "Tambah" untuk menambahkan program kerja baru.</p>
        </div>
      )}
    </div>
  );
}
