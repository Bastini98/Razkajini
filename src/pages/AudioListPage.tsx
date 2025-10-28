import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type Row = {
  id: string;
  slug: string;
  title_bg: string;
  price: number | null;
  compare_at_price: number | null;
  images: any;
  badges: any;
  rating: number | null;
};

const RATE = 1.95583;
const toEUR = (bgn: number) => (bgn / RATE).toFixed(2);
const fmtBGN = (v: number) => `${v.toFixed(2)} лв`;
const pctOff = (p?: number | null, c?: number | null) =>
  p && c && c > p ? Math.round(100 - (p / c) * 100) : 0;

function firstImage(v: any): string | undefined {
  try {
    const x = typeof v === "string" ? JSON.parse(v) : v;
    if (Array.isArray(x) && x.length) {
      const it = x[0];
      return typeof it === "string" ? it : it?.url;
    }
  } catch {}
  return undefined;
}

function toBadges(v: any): string[] {
  try {
    const x = typeof v === "string" ? JSON.parse(v) : v;
    if (Array.isArray(x)) {
      return x.map((b: any) => (typeof b === "string" ? b : b?.label)).filter(Boolean);
    }
  } catch {}
  return [];
}

const AudioListPage: React.FC = () => {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, title_bg, price, compare_at_price, images, badges, rating, category")
        .eq("category", "audio_story")
        .order("created_at", { ascending: false });
      if (!error && data) setRows(data as any);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Зареждане…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl md:text-5xl font-colus font-bold text-ink text-center mb-6">
          Аудио приказки
        </h1>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-10">
          Професионални записи, четени от <strong>Таня Евтимова</strong>. След покупка получавате
          имейл с <strong>линк за изтегляне на MP3</strong>. Идеални за вечерен ритуал и за път.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const img = firstImage(r.images) || "https://i.ibb.co/4Vh2kTg/placeholder-16x9.png";
            const price = typeof r.price === "number" ? r.price : 0;
            const compare = typeof r.compare_at_price === "number" ? r.compare_at_price : undefined;
            const off = pctOff(price, compare);
            const badges = toBadges(r.badges);
            return (
              <motion.article
                key={r.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-2xl overflow-hidden bg-white border border-sand/30 shadow"
              >
                <Link to={`/audio-prikazki/${r.slug}`} className="block">
                  <div className="relative">
                    <img src={img} alt={r.title_bg} className="w-full h-56 object-cover" />
                    {off > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-colus px-2 py-1 rounded-full flex items-center gap-1">
                        -{off}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-colus text-ink">{r.title_bg}</h3>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2 font-colus">
                      <span className="text-teal text-xl font-bold">{fmtBGN(price)}</span>
                      <span className="text-gray-600 text-sm">(€{toEUR(price)})</span>
                      {compare && compare > price && (
                        <span className="text-gray-500 text-sm line-through">{fmtBGN(compare)}</span>
                      )}
                    </div>
                    {badges.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {badges.map((b) => (
                          <span key={b} className="text-xs bg-teal text-white px-2 py-1 rounded-full">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AudioListPage;
   