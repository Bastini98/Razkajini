// src/pages/admin/AdminBlog.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, RefreshCw, Calendar, Star, StarOff,
  Pencil, Trash2, Tag as TagIcon
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "../../layouts/AdminLayout";

/* ========= Types ========= */
type BlogPost = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

/* ========= Helpers ========= */
const PAGE_SIZE = 20;
const FALLBACK_IMG = "https://i.ibb.co/4V8kLnm/placeholder-16x9.webp";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric" });

const cls = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(" ");

function useDebounced<T>(v: T, ms = 300) {
  const [val, setVal] = useState(v);
  useEffect(() => { const t = setTimeout(() => setVal(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return val;
}

/* ========= Toasts ========= */
type Toast = { id: string; text: string; kind?: "success" | "error" | "info" };
function useToasts() {
  const [list, setList] = useState<Toast[]>([]);
  const push = (text: string, kind: Toast["kind"] = "info") => {
    const t = { id: Math.random().toString(36).slice(2), text, kind };
    setList((s) => [...s, t]);
    setTimeout(() => setList((s) => s.filter((x) => x.id !== t.id)), 2400);
  };
  return { toasts: list, push };
}
const ToastHost: React.FC<{ toasts: Toast[] }> = ({ toasts }) => (
  <div className="fixed bottom-4 right-4 z-[100] space-y-2">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={cls(
          "rounded-xl border shadow-md px-4 py-3 text-sm bg-white",
          t.kind === "success" && "border-emerald-300 text-emerald-800",
          t.kind === "error" && "border-red-300 text-red-800",
          (!t.kind || t.kind === "info") && "border-sand/40 text-gray-800"
        )}
      >
        {t.text}
      </div>
    ))}
  </div>
);

/* ========= Row (list look like screenshot 2) ========= */
const RowItem: React.FC<{
  p: BlogPost;
  onEdit: (p: BlogPost) => void;
  onDelete: (p: BlogPost) => void;
  onToggleFeatured: (p: BlogPost) => void;
}> = ({ p, onEdit, onDelete, onToggleFeatured }) => {
  const img = p.image_url || FALLBACK_IMG;
  return (
    <div className="grid grid-cols-[92px_1fr_auto] gap-4 items-center border-b border-sand/30 py-4">
      {/* Thumb */}
      <button
        type="button"
        onClick={() => onEdit(p)}
        className="w-[92px] h-[64px] overflow-hidden rounded-xl border border-sand/30 bg-sand/20 hover:shadow transition"
        title="Редактирай"
      >
        <img src={img} alt={p.title} className="w-full h-full object-cover" />
      </button>

      {/* Middle content */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            {fmtDate(p.created_at)}
          </span>

          <span
            className={cls(
              "inline-flex items-center px-2 py-0.5 rounded-full border text-xs",
              p.is_published ? "border-emerald-300 text-emerald-700" : "border-gray-300 text-gray-600"
            )}
          >
            {p.is_published ? "Публикувано" : "Чернова"}
          </span>

          {p.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-teal/30 text-teal text-xs">
              <TagIcon className="w-3.5 h-3.5" />
              {p.category}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEdit(p)}
          className="mt-1 block text-left text-[19px] leading-tight font-pudelinka text-ink hover:text-teal"
          title="Редактирай"
        >
          {p.title}
        </button>

        {p.excerpt && (
          <p className="mt-1 text-gray-700 text-sm line-clamp-1">{p.excerpt}</p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleFeatured(p)}
          className={cls(
            "inline-flex items-center justify-center w-9 h-9 rounded-full border transition",
            p.is_featured ? "border-teal text-teal bg-teal/5" : "border-sand/40 text-gray-700 hover:border-teal hover:text-teal"
          )}
          title={p.is_featured ? "Премахни от Препоръчани" : "Добави към Препоръчани"}
        >
          {p.is_featured ? <Star className="w-4 h-4 filled" /> : <StarOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onEdit(p)}
          className="inline-flex items-center gap-2 rounded-xl border border-sand/40 px-3 py-2 text-gray-700 hover:border-teal hover:text-teal transition"
          title="Редактирай"
        >
          <Pencil className="w-4 h-4" />
          Редактирай
        </button>

        <button
          onClick={() => onDelete(p)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50 transition"
          title="Изтрий"
        >
          <Trash2 className="w-4 h-4" />
          Изтрий
        </button>
      </div>
    </div>
  );
};

/* ========= Page ========= */
export default function AdminBlog() {
  const nav = useNavigate();
  const { toasts, push } = useToasts();

  const [rows, setRows] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);
  const [sort, setSort] =
    useState<"date" | "title" | "featured">("date");
  const [refreshKey, setRefreshKey] = useState(0);

  const order = useMemo(() => {
    switch (sort) {
      case "title": return { col: "title", asc: true } as const;
      case "featured": return { col: "is_featured", asc: false } as const;
      default: return { col: "created_at", asc: false } as const;
    }
  }, [sort]);

  async function load() {
    setLoading(true);
    let query = supabase
      .from("blog_posts")
      .select("id,title,subtitle,slug,excerpt,image_url,category,is_published,is_featured,created_at,updated_at", { count: "exact" })
      .order(order.col, { ascending: order.asc })
      .limit(PAGE_SIZE);

    const s = dq.trim();
    if (s) {
      query = query.or([
        `title.ilike.%${s}%`,
        `subtitle.ilike.%${s}%`,
        `excerpt.ilike.%${s}%`,
        `category.ilike.%${s}%`,
      ].join(","));
    }

    const { data, error } = await query;
    setLoading(false);

    if (error) {
      console.error(error);
      push("Грешка при зареждане.", "error");
      return;
    }
    setRows((data || []) as BlogPost[]);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [dq, sort, refreshKey]);

  function onNew() { nav("/admin/blog/new"); }
  function onEdit(p: BlogPost) { nav(`/admin/blog/edit/${p.id}`); }

  async function onDelete(p: BlogPost) {
    const ok = window.confirm(`Сигурни ли сте, че искате да изтриете „${p.title}“?`);
    if (!ok) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) { push("Грешка при изтриване.", "error"); return; }
    setRows((prev) => prev.filter((x) => x.id !== p.id));
    push("Статията е изтрита.", "success");
  }

  async function onToggleFeatured(p: BlogPost) {
    const make = !p.is_featured;

    // оптимистично
    setRows((prev) => prev.map((x) => x.id === p.id ? { ...x, is_featured: make } : x));

    // налагаме лимит 3 през БД (RPC / тригер); ако нямаш RPC, директен update:
    const { error } = await supabase.rpc("toggle_blog_feature", {
      _post_id: p.id, _make_featured: make
    });
    if (error) {
      // rollback
      setRows((prev) => prev.map((x) => x.id === p.id ? { ...x, is_featured: !make } : x));
      if (String(error.message || "").includes("MAX_FEATURED")) {
        push("Могат да бъдат ‘Препоръчани’ най-много 3 статии.", "error");
      } else {
        push("Грешка при промяна на ‘Препоръчани’.", "error");
      }
      return;
    }
    push(make ? "Маркирано като ‘Препоръчани’." : "Премахнато от ‘Препоръчани’.", "success");
  }

  return (
    <AdminLayout>
      <div className="rounded-2xl bg-white border border-sand/30 shadow-md">
        {/* Header / toolbar */}
        <div className="p-5 border-b border-sand/30">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-xl font-semibold text-ink">Управление на Блогове</h1>

            <div className="flex flex-1 lg:max-w-xl order-2 lg:order-1">
              <div className="relative w-full">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Търси статии…"
                  className="w-full rounded-xl border border-sand/40 px-4 py-2.5 pr-10 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center gap-2 order-1 lg:order-2">
              {/* Segmented sort — Дата / Заглавие / Препоръчани */}
              <div className="inline-flex rounded-xl border border-sand/40 overflow-hidden">
                <button
                  className={cls("px-3 py-2 text-sm", sort === "date" ? "bg-teal text-white" : "hover:bg-sand/20")}
                  onClick={() => setSort("date")}
                >
                  Дата
                </button>
                <button
                  className={cls("px-3 py-2 text-sm border-l border-sand/40", sort === "title" ? "bg-teal text-white" : "hover:bg-sand/20")}
                  onClick={() => setSort("title")}
                >
                  Заглавие
                </button>
                <button
                  className={cls("px-3 py-2 text-sm border-l border-sand/40", sort === "featured" ? "bg-teal text-white" : "hover:bg-sand/20")}
                  onClick={() => setSort("featured")}
                >
                  Препоръчани
                </button>
              </div>

              <button
                onClick={() => setRefreshKey((x) => x + 1)}
                className="inline-flex items-center gap-2 rounded-xl border border-sand/40 px-3 py-2 text-gray-700 hover:border-teal hover:text-teal transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>

              <button
                onClick={onNew}
                className="inline-flex items-center gap-2 rounded-2xl bg-teal text-white px-4 py-2 shadow hover:bg-teal-dark"
              >
                <Plus className="w-4 h-4" />
                Нова статия
              </button>
            </div>
          </div>
        </div>

        {/* List header */}
        <div className="px-5 pt-4 text-sm text-gray-600">
          Всички статии ({rows.length})
        </div>

        {/* List */}
        <div className="px-5">
          <div className="mt-2 rounded-2xl border border-sand/30 overflow-hidden">
            {/* rows */}
            <div className="divide-y divide-sand/30">
              {loading && (
                <div className="p-6 text-gray-600">Зареждане…</div>
              )}

              {!loading && rows.length === 0 && (
                <div className="p-6 text-gray-600">Няма статии.</div>
              )}

              {rows.map((p) => (
                <RowItem
                  key={p.id}
                  p={p}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFeatured={onToggleFeatured}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToastHost toasts={toasts} />
    </AdminLayout>
  );
}
