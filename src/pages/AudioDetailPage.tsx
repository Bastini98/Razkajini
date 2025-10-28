import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Music2, Headphones, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

import AddToCartAudio from "../components/AddToCartAudio";
import WhyBuySection from "../components/WhyBuySection";
import InsideAudioTestimonials from "../components/InsideAudioTestimonials";
import EmotionalBenefitSectionAudio from "../components/EmotionalBenefitSectionAudio"; // ✅ правилният компонент за аудио
import WhereToFindUs from "../components/WhereToFindUs"; // ✅ новата секция
import { useCart } from "../context/CartContext";

type QA = { q?: string; a?: string; question?: string; answer?: string };
type DbTestimonial = { stars?: number; quote?: string; author?: string; label?: string };

type DbProduct = {
  id: string;
  slug: string;
  title_bg: string;
  short_description_bg: string | null;
  description_html_bg: string | null;
  images: any;
  gallery_images: any;
  badges: any;
  price: any;
  compare_at_price: any;
  rating: any;
  faq: QA[] | null;
  testimonials: DbTestimonial[] | null;
  mini_testimonial?: any | null;
  why_buy_title: string | null;
  why_buy_content: string | null;
  emotional_benefits_title: string | null;
  emotional_benefits_content: string | null;
  narrator?: string | null;
  audio_preview_url?: string | null;
  audio_file_url?: string | null;
  category?: string | null;
};

function toUrlArray(v: any): string[] {
  try {
    const x = typeof v === "string" ? JSON.parse(v) : v;
    if (!x) return [];
    if (Array.isArray(x)) {
      return x
        .map((it: any) => {
          if (typeof it === "string") return it;
          if (it && typeof it.url === "string") return it.url;
          return null;
        })
        .filter((u: any): u is string => !!u);
    }
    if (x && typeof x.url === "string") return [x.url];
    return [];
  } catch {
    return [];
  }
}

function toBadgeArray(v: any): string[] {
  try {
    const x = typeof v === "string" ? JSON.parse(v) : v;
    if (!x) return [];
    if (Array.isArray(x)) {
      return x
        .map((it: any) => {
          if (typeof it === "string") return it;
          if (it && typeof it.label === "string") return it.label;
          return null;
        })
        .filter((t: any): t is string => !!t);
    }
    return [];
  } catch {
    return [];
  }
}

const pctOff = (p?: number | null, c?: number | null) =>
  p && c && c > p ? Math.round(100 - (p / c) * 100) : 0;

const AudioDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [product, setProduct] = React.useState<DbProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [faqOpen, setFaqOpen] = React.useState<Record<number, boolean>>({});

  // 🛒 Cart integration
  const { addItem, openCart } = useCart();

  React.useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: e1 } = await supabase
          .from("products")
          .select(`
            id, slug, title_bg, short_description_bg, description_html_bg,
            images, gallery_images, badges, price, compare_at_price, rating,
            faq, testimonials, mini_testimonial,
            why_buy_title, why_buy_content, emotional_benefits_title, emotional_benefits_content,
            narrator, audio_preview_url, audio_file_url, category
          `)
          .eq("slug", slug)
          .eq("category", "audio_story")
          .limit(1)
          .maybeSingle();

        if (e1) throw e1;
        if (!data) {
          setError("Не намерихме приказката.");
          setLoading(false);
          return;
        }
        setProduct(data as unknown as DbProduct);
      } catch (err) {
        console.error("AudioDetail fetch error:", err);
        setError("Не намерихме приказката.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const images = React.useMemo(() => {
    if (!product) return ["https://i.ibb.co/4Vh2kTg/placeholder-16x9.png"];
    const all = [...toUrlArray(product.images), ...toUrlArray(product.gallery_images)];
    return all.length > 0 ? all : ["https://i.ibb.co/4Vh2kTg/placeholder-16x9.png"];
  }, [product]);

  const badges = React.useMemo(() => (product ? toBadgeArray(product.badges) : []), [product]);

  // ✅ Unified function to add product to cart
  const addOneToCart = React.useCallback(
    (p: DbProduct | null) => {
      if (!p) return;
      const imgs = toUrlArray(p.images);
      const item = {
        id: p.id,
        titleBg: p.title_bg,
        price: Number(p.price) || 0,
        image: imgs[0] || "",
        slug: p.slug,
      };
      addItem(item);
      openCart();
    },
    [addItem, openCart]
  );

  const handleAddCurrentProductToCart = React.useCallback(() => {
    addOneToCart(product);
  }, [product, addOneToCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Зареждаме…</p>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-red-600 font-medium mb-6">{error || "Не е намерено."}</p>
          <Link to="/audio-prikazki" className="inline-flex items-center gap-2 text-teal hover:underline">
            <ArrowLeft className="w-4 h-4" /> Назад към аудио приказките
          </Link>
        </div>
      </div>
    );
  }

  // числа от текст → number
  const price = Number(product.price) || 0;
  const compare = Number(product.compare_at_price) || undefined;
  const rating = Number(product.rating) || 5;
  const off = pctOff(price, compare);

  const faq: { q: string; a: string }[] = Array.isArray(product.faq)
    ? product.faq
        .map((f) => ({
          q: String(f.q ?? f.question ?? "").trim(),
          a: String(f.a ?? f.answer ?? "").trim(),
        }))
        .filter((f) => f.q || f.a)
    : [];

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Back bar */}
      <div className="border-b border-sand/20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center">
          <Link to="/audio-prikazki" className="inline-flex items-center gap-2 text-teal hover:underline">
            <ArrowLeft className="w-4 h-4" /> Всички аудио приказки
          </Link>
        </div>
      </div>

      {/* HERO + BUY */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Лява колона */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative overflow-hidden rounded-3xl border border-sand/30 bg-white">
                <img src={images[0]} alt={product.title_bg} className="w-full h-[520px] object-cover" />
                {off > 0 && (
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-red-500 text-white px-3 py-1 text-xs font-bold shadow">
                    -{off}%
                  </div>
                )}
              </div>
            </motion.div>

            <div className="bg-white rounded-3xl shadow-sm border border-sand/20 p-6 md:p-8">
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">({rating.toFixed(1)})</span>
                </div>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {badges.map((b) => (
                      <span key={b} className="bg-teal text-white px-3 py-1 rounded-full text-sm font-medium">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-colus font-bold text-ink mb-3">{product.title_bg}</h1>
              {!!product.short_description_bg && (
                <p className="text-lg text-gray-700 leading-relaxed mb-6">{product.short_description_bg}</p>
              )}

              {/* Демо плейър */}
              {product.audio_preview_url ? (
                <div className="rounded-2xl border border-sand/30 p-4 bg-sand-light/20">
                  <div className="flex items-center gap-2 text-ink mb-2">
                    <Headphones className="w-5 h-5 text-teal" />
                    <span className="font-semibold">Чуй откъс</span>
                  </div>
                  <audio controls src={product.audio_preview_url} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <div className="rounded-2xl border border-sand/30 p-4 bg-sand-light/20 text-gray-700">
                  <span className="font-semibold">Откъс</span>: Скоро добавяме демо аудио.
                </div>
              )}

              {/* Описание */}
              {product.description_html_bg && (
                <div
                  className="prose prose-lg max-w-none mt-6 prose-headings:font-colus prose-p:leading-7"
                  dangerouslySetInnerHTML={{ __html: product.description_html_bg }}
                />
              )}

              {/* Наратор */}
              <div className="mt-6 text-sm text-gray-700 flex items-center gap-2">
                <Music2 className="w-4 h-4 text-teal" />
                <span>
                  Чете: <strong>{product.narrator || "Таня Евтимова"}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Дясна колона */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <AddToCartAudio
              product={{
                id: product.id,
                titleBg: product.title_bg,
                price,
                image: images[0],
                slug: product.slug,
                compareAtPrice: compare,
                stock: null,
                mini_testimonial: product.mini_testimonial || undefined,
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Why buy */}
      {product.why_buy_title && product.why_buy_content && (
        <WhyBuySection
          data={{ image: images[0], title: product.why_buy_title, content: product.why_buy_content }}
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      {/* Testimonials */}
      {Array.isArray(product.testimonials) && product.testimonials.length > 0 && (
        <InsideAudioTestimonials testimonials={product.testimonials as any} />
      )}

      {/* Emotional benefits — версията за аудио */}
      {product.emotional_benefits_title && product.emotional_benefits_content && (
        <EmotionalBenefitSectionAudio
          data={{ title: product.emotional_benefits_title, content: product.emotional_benefits_content }}
        />
      )}

      {/* Текст за физическите книги */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-800">
            Освен аудио-приказки, предлагаме и <strong>физически книги за баба и дядо</strong>.
            Можеш да ги откриеш в избраните книжарници по-долу или да ги
            поръчаш онлайн директно от нашия сайт — виж всички заглавия{" "}
            <Link to="/books" className="text-teal hover:underline font-semibold">тук</Link>.
          </p>
        </div>
      </section>

      {/* Къде да ни намериш? */}
      <WhereToFindUs
        bookstores={[
           { name: 'Orange Center', location: 'София' },
  { name: 'Ciela', location: 'Национално покритие' },
  { name: 'Helikon', location: 'София, Пловдив' },
  { name: 'Книгомания', location: 'Варна, Бургас' },
  { name: 'Penguins', location: 'София' },
  { name: 'Аполония', location: 'Пловдив' },
  { name: 'Книжарница Хермес', location: 'Стара Загора' },
  { name: 'Сиела Норма', location: 'Русе' }
        ]}
        onCtaClick={handleAddCurrentProductToCart}
      />

      {/* FAQ */}
      {Array.isArray(faq) && faq.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl md:text-3xl font-colus font-bold text-ink text-center mb-6">
              Често задавани въпроси
            </h3>
            <div className="space-y-3">
              {faq.map((f, i) => {
                const open = !!faqOpen[i];
                return (
                  <div key={`${i}-${(f.q || "").slice(0, 30)}`} className="rounded-2xl border border-sand/30 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFaqOpen((s) => ({ ...s, [i]: !open }))}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-semibold text-ink">{f.q || "Въпрос"}</span>
                      <ChevronDown className={`w-5 h-5 transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-5 pb-4 text-gray-700"
                        >
                          <p className="leading-relaxed">{f.a || "—"}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="pb-16 text-center">
        <Link to="/audio-prikazki" className="inline-flex items-center gap-2 text-teal hover:underline">
          <ArrowLeft className="w-4 h-4" /> Назад към аудио приказките
        </Link>
      </div>
    </div>
  );
};

export default AudioDetailPage;
