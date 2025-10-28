import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Tag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type DbProduct = {
  id: string;
  slug: string;
  title_bg: string;
  short_description_bg: string | null;
  images: string[] | null;
  badges: string[] | null;
  price: number | null;
  compare_at_price: number | null;
  rating: number | null;
  on_sale: boolean | null;
  category: string | null;
};

const RATE_BGN_PER_EUR = 1.95583;
const toEUR = (bgn: number) => (bgn / RATE_BGN_PER_EUR).toFixed(2);
const fmtBGN = (v: number) => `${v.toFixed(2)} лв`;
const pctOff = (price?: number | null, compare?: number | null) =>
  price && compare && compare > price ? Math.round(100 - (price / compare) * 100) : 0;

const SpectaclesPage: React.FC = () => {
  const [items, setItems] = React.useState<DbProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, slug, title_bg, short_description_bg, images, badges, price, compare_at_price, rating, on_sale, category"
          )
          .eq("category", "spectacle")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setItems((data || []) as unknown as DbProduct[]);
      } catch (e: any) {
        setError("Не успяхме да заредим спектаклите. Моля, опитайте отново.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-sand-light/60 via-white/70 to-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-pudelinka font-bold text-ink">
              Куклени спектакли
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Вълшебни истории, които учат на доброта, цветове и приятелство. Подходящи за деца и
              семейства — с музика, кукли и много емоции.
            </p>

            <div className="flex items-center justify-center gap-3 text-sm md:text-base text-teal">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Награждавани постановки
              </span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Образователно съдържание
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* List */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-sand/30 bg-white/70 backdrop-blur-sm"
                >
                  <div className="aspect-[4/3] bg-sand-light/40 rounded-t-2xl" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-sand-light/60 rounded w-2/3" />
                    <div className="h-4 bg-sand-light/60 rounded w-4/5" />
                    <div className="h-8 bg-sand-light/60 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 font-medium py-8">{error}</p>
          )}

          {!loading && !error && (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {items.map((p, idx) => {
                  const image = Array.isArray(p.images) ? p.images[0] : undefined;
                  const price = typeof p.price === "number" ? p.price : 0;
                  const compare = typeof p.compare_at_price === "number" ? p.compare_at_price : undefined;
                  const off = pctOff(price, compare);

                  return (
                    <motion.article
                      key={p.id}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.45, delay: idx * 0.04 }}
                      className="group relative overflow-hidden rounded-2xl border border-sand/30 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition"
                    >
                      {off > 0 && (
                        <div className="absolute z-10 top-4 left-4 inline-flex items-center gap-1 rounded-full bg-red-500 text-white px-2.5 py-1 text-xs font-semibold shadow">
                          <Tag className="w-3.5 h-3.5" />
                          -{off}%
                        </div>
                      )}

                      <Link to={`/kukleni-spektakli/${p.slug}`} className="block">
                        <div className="relative overflow-hidden aspect-[4/3] bg-sand-light/40">
                          {image ? (
                            <img
                              src={image}
                              alt={p.title_bg}
                              className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              🎭
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>

                      <div className="p-6 space-y-4">
                        {/* Badges */}
                        {Array.isArray(p.badges) && p.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {p.badges.slice(0, 3).map((b) => (
                              <span
                                key={b}
                                className="inline-flex items-center rounded-full bg-teal text-white px-2.5 py-1 text-xs"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="space-y-2">
                          <Link to={`/kukleni-spektakli/${p.slug}`}>
                            <h3 className="text-xl font-colus font-bold text-ink group-hover:text-teal transition-colors">
                              {p.title_bg}
                            </h3>
                          </Link>
                          {p.short_description_bg && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {p.short_description_bg}
                            </p>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.round(p.rating ?? 5)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({(p.rating ?? 5).toFixed(1)})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end justify-between">
                          <div className="space-x-2">
                            <span className="text-2xl font-bold text-teal">
                              {fmtBGN(price)}
                            </span>
                            {compare && compare > price && (
                              <span className="text-lg text-gray-500 line-through">
                                {fmtBGN(compare)}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            €{toEUR(price)}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-2">
                          <Link
                            to={`/kukleni-spektakli/${p.slug}`}
                            className="inline-flex items-center justify-center rounded-xl bg-[#3c9383] text-white font-colus px-4 py-2 text-sm hover:opacity-95 transition"
                          >
                            Виж спектакъла
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>

              {items.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-600 py-16"
                >
                  Скоро тук ще добавим нови спектакли.
                </motion.p>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-teal to-teal-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-pudelinka font-bold"
          >
            Искате да поканите спектакъла във вашето училище/градина?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-6"
          >
            <Link
              to="/contact"
              className="inline-flex items-center rounded-2xl bg-white text-teal px-8 py-3 font-semibold hover:bg-sand-light transition-colors"
            >
              Изпрати запитване
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SpectaclesPage;
