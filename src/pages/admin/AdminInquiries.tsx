// src/pages/admin/AdminInquiries.tsx
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import {
  Search, RefreshCw, Trash2, CheckCircle2, Clock, Mail, Phone, User2, Filter, Tag as TagIcon, MonitorSmartphone
} from "lucide-react";

/* ===== Types, според твоята таблица ===== */
type Inquiry = {
  id: string;
  created_at: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  message: string | null;
  source_path: string | null;
  user_agent: string | null;
  status: string | null; // "done" => обработено, всичко друго => чакащо
};

const cls = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(" ");
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

function useDebounced<T>(v: T, ms = 300) {
  const [val, setVal] = useState(v);
  useEffect(() => { const t = setTimeout(() => setVal(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return val;
}

/* ===== Toaster (малки нотификации) ===== */
type Toast = { id: string; text: string; kind?: "success" | "error" | "info" };
function useToasts() {
  const [items, setItems] = useState<Toast[]>([]);
  function push(text: string, kind: Toast["kind"] = "info") {
    const t = { id: Math.random().toString(36).slice(2), text, kind };
    setItems((s) => [...s, t]);
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== t.id)), 2400);
  }
  return { toasts: items, push };
}
const ToastHost: React.FC<{ toasts: Toast[] }> = ({ toasts }) => (
  <div className="fixed bottom-4 right-4 z-[100] space-y-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={cls(
          "rounded-xl border shadow-md px-4 py-3 text-sm bg-white",
          t.kind === "success" && "border-emerald-300 text-emerald-700",
          t.kind === "error" && "border-red-300 text-red-800",
          (!t.kind || t.kind === "info") && "border-sand/40 text-gray-800"
        )}
      >
        {t.text}
      </div>
    ))}
  </div>
);

/* ===== Компонент ===== */
export default function AdminInquiries() {
  const { toasts, push } = useToasts();

  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);
  const [sort, setSort] = useState<"date" | "name" | "status">("date");
  const [status, setStatus] = useState<"all" | "pending" | "done">("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const order = useMemo(() => {
    switch (sort) {
      case "name": return { col: "full_name", asc: true } as const;
      case "status": return { col: "status", asc: true } as const;
      default: return { col: "created_at", asc: false } as const;
    }
  }, [sort]);

  // helper: done?
  const isDone = (s: string | null | undefined) => (s || "").toLowerCase() === "done";

  async function load() {
    setLoading(true);

    let query = supabase
      .from("contact_inquiries")
      .select("*")
      .order(order.col, { ascending: order.asc });

    // статус филтър (тъй като е text, правим филтър в клиента след fetch, за да избегнем сложни OR-и)
    const { data, error } = await query;
    setLoading(false);

    if (error) {
      console.error(error);
      push("Грешка при зареждане на запитванията.", "error");
      return;
    }

    let list = (data || []) as Inquiry[];

    // клиентски статус-филтър
    if (status === "done") list = list.filter((x) => isDone(x.status));
    if (status === "pending") list = list.filter((x) => !isDone(x.status));

    // текстово търсене (client-side)
    const s = dq.trim().toLowerCase();
    if (s) {
      list = list.filter((x) => {
        return [
          x.full_name, x.email, x.phone, x.message, x.status, x.source_path
        ].some((v) => (v || "").toLowerCase().includes(s));
      });
    }

    setRows(list);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [dq, sort, status, refreshKey]);

  function displayName(p: Inquiry) { return p.full_name || "(без име)"; }

  async function toggleStatus(p: Inquiry) {
    const next = isDone(p.status) ? "pending" : "done";
    // оптимистично
    setRows((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));

    const { error } = await supabase
      .from("contact_inquiries")
      .update({ status: next })
      .eq("id", p.id);

    if (error) {
      setRows((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: p.status } : x)));
      push("Грешка при промяна на статуса.", "error");
      return;
    }
    push(next === "done" ? "Маркирано като обработено." : "Върнато като чакащо.", "success");
  }

  async function remove(p: Inquiry) {
    const ok = window.confirm(`Да изтрием ли запитването от „${displayName(p)}“?`);
    if (!ok) return;
    const { error } = await supabase.from("contact_inquiries").delete().eq("id", p.id);
    if (error) {
      push("Грешка при изтриване.", "error");
      return;
    }
    setRows((prev) => prev.filter((x) => x.id !== p.id));
    push("Изтрито.", "success");
  }

  return (
    <AdminLayout>
      <div className="rounded-2xl bg-white border border-sand/30 shadow-md">
        {/* Header / toolbar */}
        <div className="p-5 border-b border-sand/30">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-xl font-semibold text-ink">Форми за запитване</h1>

            <div className="flex items-center gap-2 order-2 lg:order-2">
              {/* Sort segmented */}
              <div className="inline-flex rounded-xl border border-sand/40 overflow-hidden">
                <button
                  className={cls("px-3 py-2 text-sm", sort === "date" ? "bg-teal text-white" : "hover:bg-sand/20")}
                  onClick={() => setSort("date")}
                >
                  Дата
                </button>
                <button
                  className={cls("px-3 py-2 text-sm border-l border-sand/40", sort === "name" ? "bg-teal text-white" : "hover:bg-sand/20")}
                  onClick={() => setSort("name")}
                >
                  Име
                </button>
                <button
                  className={cls("px-3 py-2 text-sm border-l border-sand/40", sort === "status" ? "bg-teal text-white" : "hover:bg-sand/20")}
                  onClick={() => setSort("status")}
                >
                  Статус
                </button>
              </div>

              {/* Status filter */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-sand/40 px-3 py-2 text-sm">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="bg-transparent outline-none"
                >
                  <option value="all">Всички</option>
                  <option value="pending">Чакащи</option>
                  <option value="done">Обработени</option>
                </select>
              </div>

              <button
                onClick={() => setRefreshKey((x) => x + 1)}
                className="inline-flex items-center gap-2 rounded-xl border border-sand/40 px-3 py-2 text-gray-700 hover:border-teal hover:text-teal transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {/* Search */}
            <div className="flex flex-1 lg:max-w-xl order-1 lg:order-1">
              <div className="relative w-full">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Търси по име, имейл, телефон, статус, съобщение…"
                  className="w-full rounded-xl border border-sand/40 px-4 py-2.5 pr-10 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* List header */}
        <div className="px-5 pt-4 text-sm text-gray-600">
          Всички записи ({rows.length})
        </div>

        {/* List */}
        <div className="px-5">
          <div className="mt-2 rounded-2xl border border-sand/30 overflow-hidden">
            <div className="divide-y divide-sand/30">
              {loading && <div className="p-6 text-gray-600">Зареждане…</div>}
              {!loading && rows.length === 0 && <div className="p-6 text-gray-600">Няма запитвания.</div>}

              {rows.map((p) => {
                const name = displayName(p);
                const done = isDone(p.status);
                return (
                  <div key={p.id} className="grid grid-cols-[1fr_auto] gap-4 items-start p-4">
                    {/* Left info */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {fmtDate(p.created_at)}
                        </span>

                        <span
                          className={cls(
                            "inline-flex items-center px-2 py-0.5 rounded-full border text-xs",
                            done ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700"
                          )}
                          title="Статус"
                        >
                          {done ? "Обработено" : "Чака отговор"}
                        </span>

                        {p.source_path && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-teal/30 text-teal text-xs">
                            <TagIcon className="w-3.5 h-3.5" />
                            {p.source_path}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-1 text-[18px] font-pudelinka text-ink">
                        {name}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-700">
                        {p.email && (
                          <a href={`mailto:${p.email}`} className="inline-flex items-center gap-2 hover:text-teal">
                            <Mail className="w-4 h-4 text-gray-500" />
                            {p.email}
                          </a>
                        )}
                        {p.phone && (
                          <a href={`tel:${p.phone}`} className="inline-flex items-center gap-2 hover:text-teal">
                            <Phone className="w-4 h-4 text-gray-500" />
                            {p.phone}
                          </a>
                        )}
                        {p.user_agent && (
                          <span className="inline-flex items-center gap-2 text-gray-500">
                            <MonitorSmartphone className="w-4 h-4" />
                            <span className="line-clamp-1 max-w-[28rem]" title={p.user_agent}>{p.user_agent}</span>
                          </span>
                        )}
                      </div>

                      {p.message && (
                        <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                          {p.message}
                        </p>
                      )}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(p)}
                        className={cls(
                          "inline-flex items-center gap-2 rounded-xl border px-3 py-2 transition",
                          done
                            ? "border-teal text-teal bg-teal/5 hover:bg-teal/10"
                            : "border-sand/40 text-gray-700 hover:border-teal hover:text-teal"
                        )}
                        title={done ? "Отбележи като чакащо" : "Маркирай като обработено"}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {done ? "Обработено" : "Готово"}
                      </button>

                      <button
                        onClick={() => remove(p)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50 transition"
                        title="Изтрий"
                      >
                        <Trash2 className="w-4 h-4" />
                        Изтрий
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ToastHost toasts={toasts} />
    </AdminLayout>
  );
}
