"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiCheck, FiTrash2, FiLoader, FiMessageSquare } from "react-icons/fi";

interface GuestbookEntry {
  id: string; name: string; message: string; is_approved: boolean; created_at: string;
}

export default function AdminGuestbookPage() {
  const supabase = createClient();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase.from("guestbook").select("*").order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleApprove = async (id: string) => {
    await supabase.from("guestbook").update({ is_approved: true }).eq("id", id);
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;
    await supabase.from("guestbook").delete().eq("id", id);
    fetchEntries();
  };

  const pendingEntries = entries.filter(e => !e.is_approved);
  const approvedEntries = entries.filter(e => e.is_approved);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Moderasi Buku Tamu</h1>
        <p className="text-muted-foreground mt-1">Tinjau dan setujui pesan dari pengunjung website.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
      ) : (
        <div className="space-y-10">
          {/* Pending Section */}
          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              Menunggu Persetujuan ({pendingEntries.length})
            </h2>
            {pendingEntries.length > 0 ? (
              <div className="space-y-3">
                {pendingEntries.map(entry => (
                  <div key={entry.id} className="glass p-5 rounded-2xl border-l-4 border-l-amber-500">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-foreground">{entry.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{entry.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleApprove(entry.id)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors">
                          <FiCheck size={16} /> Setujui
                        </button>
                        <button onClick={() => handleDelete(entry.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary/30 border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                Tidak ada pesan yang menunggu persetujuan.
              </div>
            )}
          </section>

          {/* Approved Section */}
          <section>
            <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Sudah Disetujui ({approvedEntries.length})
            </h2>
            {approvedEntries.length > 0 ? (
              <div className="space-y-3">
                {approvedEntries.map(entry => (
                  <div key={entry.id} className="glass p-5 rounded-2xl border-l-4 border-l-emerald-500">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-foreground">{entry.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{entry.message}</p>
                      </div>
                      <button onClick={() => handleDelete(entry.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10 shrink-0">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary/30 border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                Belum ada pesan yang disetujui.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
