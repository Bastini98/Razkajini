// src/components/FloatingSearch.tsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type ProductRow = {
  id: string;
  slug: string;
  title_bg: string;
  price: number | null;
  compare_at_price: number | null;
  images: any;
  category: string | null;
};

type FloatingSearchProps = {
  pathFor: (p: string) => string;
  hidden?: boolean;
};

const RATE = 1.95583;
const toEUR = (bgn: number) => (bgn / RATE).toFixed(2);
const fmtBGN = (v: number) => `${v.toFixed(2)} лв`;

function routeForProduct(p: ProductRow, pathFor: (p: string) => string): string {
  const cat = (p.category || "").toLowerCase().trim();

  if (cat.includes("book") || cat.includes("книг")) {
    return pathFor(`/books/${p.slug}`);
  }
  if (cat.includes("doll") || cat.includes("кукл") || cat.includes("pillow") || cat.includes("pilow") || cat.includes("възглавниц")) {
    return pathFor(`/rachno-izraboteni-kukli/${p.slug}`);
  }
  if (cat.includes("audio") || cat.includes("audio_story") || cat.includes("аудио")) {
    return pathFor(`/audio-prikazki/${p.slug}`);
  }
  if (p.slug?.includes("bundle")) {
    return pathFor(`/books/${p.slug}`);
  }
  return pathFor(`/products/${p.slug}`);
}

// Нормализираме категорията до един от: 'book' | 'bundle' | 'doll' | 'pillow' | 'audio_story' | 'other'
function normalizeType(p: ProductRow): "book" | "bundle" | "doll" | "pillow" | "audio_story" | "other" {
  const cat = (p.category || "").toLowerCase();
  const slug = (p.slug || "").toLowerCase();

  if (cat.includes("book") || cat.includes("книг")) return "book";
  if (slug.includes("bundle")) return "bundle";
  if (cat.includes("doll") || cat.includes("кукл")) return "doll";
  if (cat.includes("pillow") || cat.includes("pilow") || cat.includes("възглавниц")) return "pillow";
  if (cat.includes("audio") || cat.includes("audio_story") || cat.includes("аудио")) return "audio_story";
  return "other";
}

// Избираме "доминираща" група и връщаме целеви път + етикет
function decideListRouteAndLabel(
  results: ProductRow[],
  pathFor: (p: string) => string,
  q: string
): { href: string; label: string } {
  const counts = { book: 0, bundle: 0, doll: 0, pillow: 0, audio_story: 0, other: 0 };
  results.forEach((r) => counts[normalizeType(r)]++);

  const total = results.length || 1;
  const majority = (k: keyof typeof counts) => counts[k] / total >= 0.5; // 50%+

  if (majority("book") || majority("bundle") || counts.book + counts.bundle > counts.doll + counts.pillow && counts.book + counts.bundle >= counts.audio_story) {
    return { href: pathFor("/books"), label: "Виж всички резултати за книги" };
  }
  if (majority("doll") || majority("pillow") || counts.doll + counts.pillow > counts.book + counts.bundle && counts.doll + counts.pillow >= counts.audio_story) {
    return { href: pathFor("/rachno-izraboteni-kukli"), label: "Виж всички резултати за кукли" };
  }
  if (majority("audio_story") || counts.audio_story > counts.book + counts.bundle && counts.audio_story > counts.doll + counts.pillow) {
    return { href: pathFor("/audio-prikazki"), label: "Виж всички резултати за аудио приказки" };
  }

  // Смесени типове → към общата /search
  return { href: pathFor(`/search?q=${encodeURIComponent(q)}`), label: `Виж всички резултати за “${q}”` };
}

export default function FloatingSearch({ pathFor, hidden }: FloatingSearchProps) {
  const nav = useNavigate();
  const location = useLocation();

  // видимост при скрол
  const [visible, setVisible] = React.useState(true);
  const lastY = React.useRef<number>(typeof window !== "undefined" ? window.scrollY : 0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (Math.abs(dy) > 4) {
        setVisible(dy < 0 || y < 40);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // търсене
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<ProductRow[]>([]);
  const [open, setOpen] = React.useState(false);

  // дебаунс
  const debounceRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("search_products", { q, lim: 8 });
      setLoading(false);
      if (error) {
        console.error("search_products error:", error);
        setResults([]);
        setOpen(false);
        return;
      }
      setResults(Array.isArray(data) ? data : []);
      setOpen(true);
    }, 220);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (q.trim().length === 0) return;
    setOpen(false);
    nav(pathFor(`/search?q=${encodeURIComponent(q.trim())}`));
  };

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (hidden) return null;

  // решаваме маршрут и етикет за бутона (спрямо текущите резултати)
  const listBtn = decideListRouteAndLabel(results, pathFor, q);

  return (
    <motion.div
      className="absolute left-0 right-0 -bottom-12 pr-4 sm:pr-6 lg:pr-8 pointer-events-none"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: visible ? 0 : -10, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    >
      <form onSubmit={onSubmit} action={pathFor("/search")} className="relative flex justify-end pointer-events-auto">
        <div className="relative">
          <input
            type="search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Търсене"
            placeholder="Търси: бабо, дядо, комплект…"
            className="w-[22rem] xl:w-[26rem] rounded-full border border-sand/40 px-5 py-2.5 pr-12 text-base outline-none
                       focus:border-teal focus:ring-1 focus:ring-teal bg-white shadow-md"
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            autoComplete="off"
          />
          <SearchIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

          {/* Dropdown */}
          <AnimatePresence>
            {open && (results.length > 0 || loading) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 mt-2 w-[26rem] max-w-[88vw] bg-white border border-sand/30 shadow-2xl rounded-2xl overflow-hidden z-[60]"
              >
                {loading && (
                  <div className="px-4 py-3 text-sm text-gray-500">Търсене…</div>
                )}
                {!loading && results.length > 0 && (
                  <ul className="max-h-[58vh] overflow-auto">
                    {results.map((p) => {
                      const href = routeForProduct(p as ProductRow, pathFor);
                      let img = "";
                      try {
                        const imgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
                        if (Array.isArray(imgs) && imgs.length) img = imgs[0];
                      } catch {}
                      return (
                        <li key={p.id} className="border-b last:border-0 border-sand/20">
                          <Link
                            to={href}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-sand/10 transition"
                            onClick={() => setOpen(false)}
                          >
                            <div className="w-10 h-10 rounded-lg bg-sand/10 flex items-center justify-center overflow-hidden shrink-0">
                              {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">IMG</span>}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{p.title_bg}</div>
                              <div className="text-xs text-gray-500 truncate">
                                {typeof p.price === "number" ? `${fmtBGN(p.price)} • ${toEUR(p.price)}€` : ""}
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                    <li className="p-2">
                      <Link
                        to={listBtn.href}
                        className="block w-full text-center text-sm px-3 py-2 rounded-xl bg-teal/90 text-white hover:bg-teal transition"
                        onClick={() => setOpen(false)}
                      >
                        {listBtn.label}
                      </Link>
                    </li>
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  );
}
 