"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiLoader } from "react-icons/fi";

const DIVISIONS = [
  "Pimpinan Kelompok",
  "Divisi A: Ekonomi Kreatif",
  "Divisi B: IT dan Teknologi",
  "Divisi C: Pendidikan dan Keorganisasian",
  "Divisi D: Kesehatan dan Lingkungan",
];

const ROLES = ["Ketua", "Sekretaris 1", "Sekretaris 2", "Bendahara", "CO Divisi", "Anggota"];

interface Member {
  id: string;
  name: string;
  role: string;
  division: string;
  major: string;
  photo_url: string;
  instagram_url: string;
  linkedin_url: string;
  github_url: string;
}

const emptyForm: Omit<Member, "id"> = {
  name: "", role: "Anggota", division: DIVISIONS[0], major: "",
  photo_url: "", instagram_url: "", linkedin_url: "", github_url: "",
};

export default function AdminMembersPage() {
  const supabase = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: true });
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (m: Member) => {
    setForm({ name: m.name, role: m.role, division: m.division, major: m.major || "", photo_url: m.photo_url || "", instagram_url: m.instagram_url || "", linkedin_url: m.linkedin_url || "", github_url: m.github_url || "" });
    setEditId(m.id); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      await supabase.from("members").update(form).eq("id", editId);
    } else {
      await supabase.from("members").insert(form);
    }
    setSaving(false); setShowForm(false); fetchMembers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;
    await supabase.from("members").delete().eq("id", id);
    fetchMembers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Kelola Anggota</h1>
          <p className="text-muted-foreground mt-1">Tambah, edit, atau hapus data anggota kelompok KKN.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all hover-lift">
          <FiPlus size={18} /> Tambah
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl p-6 md:p-8 shadow-2xl border border-border z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">{editId ? "Edit Anggota" : "Tambah Anggota Baru"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Nama Lengkap *</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-foreground block mb-1">Jabatan</label>
                  <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground block mb-1">Divisi</label>
                  <select value={form.division} onChange={(e) => setForm({...form, division: e.target.value})} className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Jurusan</label>
                <input value={form.major} onChange={(e) => setForm({...form, major: e.target.value})} placeholder="Contoh: Teknik Informatika" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">URL Foto Profil</label>
                <input value={form.photo_url} onChange={(e) => setForm({...form, photo_url: e.target.value})} placeholder="https://..." className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground block mb-1">Instagram URL</label>
                <input value={form.instagram_url} onChange={(e) => setForm({...form, instagram_url: e.target.value})} placeholder="https://instagram.com/username" className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <><FiLoader className="animate-spin" /> Menyimpan...</> : <><FiSave size={18} /> Simpan</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
      ) : members.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-bold text-foreground">Nama</th>
                <th className="text-left p-4 font-bold text-foreground hidden md:table-cell">Jabatan</th>
                <th className="text-left p-4 font-bold text-foreground hidden lg:table-cell">Divisi</th>
                <th className="text-left p-4 font-bold text-foreground hidden lg:table-cell">Jurusan</th>
                <th className="text-right p-4 font-bold text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-medium text-foreground flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    {m.name}
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{m.role}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{m.division}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{m.major || "-"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"><FiEdit2 size={16} /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Anggota</h3>
          <p className="text-sm mb-4">Klik tombol "Tambah" untuk mulai memasukkan data anggota.</p>
        </div>
      )}
    </div>
  );
}
