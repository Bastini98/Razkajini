// src/pages/SpectacleDetailPage.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star,
  ShieldCheck, Music2, Palette
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

/* Компоненти */
import AddToCartSpectacle from "../components/AddToCartSpectacle";
import InsideSpectacleTestimonials from "../components/InsideSpectacleTestimonials";
import SpectacleEmotionalSection from "../components/SpectacleEmotionalSection";
import SpectacleWarmthSection from "../components/SpectacleWarmthSection";
import SpectacleFAQ from "../components/SpectacleFAQ";
import SpectacleCertificates from "../components/SpectacleCertificates";
import WhyBuySection from "../components/WhyBuySection";
import Lightbox from "../components/Lightbox";
import { useCart } from "../context/CartContext";

/* ---------- Types & helpers ---------- */
type DbTestimonial = { role?: string; quote?: string; author?: string; rating?: number };
type QA = { q: string; a: string };

type DbProduct = {
  id: string;
  slug: string;
  title_bg: string;
  short_description_bg: string | null;
  description_html_bg: string | null;
  images: any;
  gallery_images: any;
  badges: any;
  price: number | null;
  compare_at_price: number | null;
  rating: number | null;
  faq: QA[] | null;
  testimonials: DbTestimonial[] | null;
  mini_testimonial?: any | null;
  why_buy_title: string | null;
  why_buy_content: string | null;
  why_buy_image?: string | null;
  emotional_benefits_title: string | null;
  emotional_benefits_content: string | null;
  warmth_section_images?: any | null;
  category?: string | null;
};

const pctOff = (p?: number | null, c?: number | null) =>
  p && c && c > p ? Math.round(100 - (p / c) * 100) : 0;

function toUrlArray(v: any): string[] {
  try {
    const x = typeof v === "string" ? JSON.parse(v) : v;
    if (!x) return [];
    if (Array.isArray(x)) {
      return x.map((it: any) => (typeof it === "string" ? it : it?.url)).filter(Boolean);
    }
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
      return x.map((it: any) => (typeof it === "string" ? it : it?.label)).filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

/* ---------- Description formatter ---------- */
function formatDescriptionHtml(raw?: string | null) {
  if (!raw) return "";
  let s = raw;
  s = s.replace(
    /(^|[\s>])(Текст|Режисура|Музика|Сценография)\s*:/g,
    (_m, p1, label) => `${p1}<strong>${label}:</strong>`
  );
  if (/<\s*p[\s>]/i.test(s)) return s;
  const normalized = s.replace(/\r\n?/g, "\n");
  const parts = normalized.split(/\n{2,}|\n/).map(t => t.trim()).filter(Boolean);
  if (parts.length === 0) return s;
  return `<p>${parts.join("</p><p>")}</p>`;
}


/* ---------- Page ---------- */
const fallbackStory = `Образователен спектакъл за цветовете, приятелството и смелостта да бъдеш себе си.`;

const SpectacleDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [product, setProduct] = React.useState<DbProduct | null>(null);
  const [certs, setCerts] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  // 🛒 Cart integration
  const { addItem, openCart } = useCart();

  React.useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true); setError(null);
        const { data: prod, error: e1 } = await supabase
          .from("products")
          .select(`
            id, slug, title_bg, short_description_bg, description_html_bg,
            images, gallery_images, badges, price, compare_at_price, rating,
            faq, testimonials, mini_testimonial,
            why_buy_title, why_buy_content, why_buy_image,
            emotional_benefits_title, emotional_benefits_content,
            warmth_section_images, category
          `)
          .eq("slug", slug).single();
        if (e1) throw e1;
        setProduct(prod as unknown as DbProduct);

        const { data: certRows, error: e2 } = await supabase
          .from("product_certificates")
          .select("url, position")
          .eq("product_id", (prod as any).id)
          .order("position", { ascending: true });
        if (!e2) setCerts((certRows || []).map((r: any) => r?.url).filter(Boolean));
      } catch (err) {
        console.error(err);
        setError("Не успяхме да заредим спектакъла.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const images = React.useMemo(() => {
    const all = [...toUrlArray(product?.images), ...toUrlArray(product?.gallery_images)];
    return all.length > 0 ? all : ["https://i.ibb.co/4Vh2kTg/placeholder-16x9.png"];
  }, [product]);
  const badges = React.useMemo(() => toBadgeArray(product?.badges), [product]);

  // Прегледни изображения – ако има gallery_images използваме тях
  const galleryOnly = React.useMemo(() => toUrlArray(product?.gallery_images), [product]);
  const previewImages = galleryOnly.length > 0 ? galleryOnly : images;
  const activeSrc = previewImages[activeIdx] ?? images[0] ?? "";

  const warmthImages = React.useMemo(() => {
    const w = toUrlArray(product?.warmth_section_images);
    return w.length > 0 ? w : images;
  }, [product, images]);

  // ✅ Unified function to add product to cart
  const addOneToCart = React.useCallback(
    (p: DbProduct | null) => {
      if (!p) return;
      const imgs = [...toUrlArray(p.images), ...toUrlArray(p.gallery_images)];
      const item = {
        id: p.id,
        titleBg: p.title_bg,
        price: typeof p.price === "number" ? p.price : 0,
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
    return <div className="min-h-screen bg-paper-texture flex items-center justify-center"><p className="text-gray-600">Зареждаме…</p></div>;
  }
  if (error || !product) {
    return (
      <div className="min-h-screen bg-paper-texture">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-red-600 font-medium mb-6">{error || "Не е намерено."}</p>
          <Link to="/kukleni-spektakli" className="inline-flex items-center gap-2 text-teal hover:underline">
            <ArrowLeft className="w-4 h-4" /> Назад към спектаклите
          </Link>
        </div>
      </div>
    );
  }

  const price = typeof product.price === "number" ? product.price : 0;
  const compare = typeof product.compare_at_price === "number" ? product.compare_at_price : undefined;
  const off = pctOff(price, compare);
  const formattedDescription = formatDescriptionHtml(product.description_html_bg || fallbackStory);

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Back bar */}
      <div className="border-b border-sand/20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center">
          <Link to="/kukleni-spektakli" className="inline-flex items-center gap-2 text-teal hover:underline">
            <ArrowLeft className="w-4 h-4" /> Всички спектакли
          </Link>
        </div>
      </div>

      {/* HERO + BUY (с вертикални кръгли миниатюри) */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ЛЯВА КОЛОНА: Галерия със side thumbs + описание */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-4">
                  {/* Sticky кръгли миниатюри (desktop) */}
                  <div className="hidden md:block">
                    <div className="sticky top-8 flex md:flex-col gap-3 maxh-[600px] overflow-auto pr-1">
                      {previewImages.map((src, idx) => (
                        <button
                          key={`${src}-${idx}`}
                          onClick={() => setActiveIdx(idx)}
                          aria-label={`Преглед снимка ${idx + 1}`}
                          className={[
                            "h-16 w-16 rounded-full border-2 overflow-hidden bg-white transition",
                            idx === activeIdx
                              ? "border-emerald-500 ring-2 ring-emerald-300"
                              : "border-zinc-200 hover:border-zinc-300"
                          ].join(" ")}
                        >
                          <img
                            src={src}
                            alt={`Миниатюра ${idx + 1}`}
                            className="h-full w-full object-cover rounded-full"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Главно изображение */}
                  <div
                    className="relative overflow-hidden rounded-3xl border border-sand/30 bg-white cursor-zoom-in"
                    onClick={() => {
                      setLightboxIndex(activeIdx);
                      setLightboxOpen(true);
                    }}
                    title="Преглед на цял екран"
                  >
                    {activeSrc && (
                      <motion.img
                        key={activeSrc}
                        src={activeSrc}
                        alt={product.title_bg}
                        className="w-full h-[520px] md:h-[600px] object-contain"
                        initial={{ opacity: 0.6, scale: 0.995 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                    {off > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-colus font-semibold">
                        -{off}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Миниатюри – мобилни (хоризонтални кръгчета) */}
                <div className="md:hidden mt-4 -mx-1 px-1">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {previewImages.map((src, idx) => (
                      <button
                        key={`${src}-m-${idx}`}
                        onClick={() => setActiveIdx(idx)}
                        aria-label={`Преглед снимка ${idx + 1}`}
                        className={[
                          "h-16 w-16 shrink-0 rounded-full border-2 overflow-hidden bg-white transition",
                          idx === activeIdx
                            ? "border-emerald-500 ring-2 ring-emerald-300"
                            : "border-zinc-200 hover:border-zinc-300"
                        ].join(" ")}
                      >
                        <img
                          src={src}
                          alt={`Миниатюра ${idx + 1}`}
                          className="h-full w-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Рейтинг + бейджове */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating ?? 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
                <span className="text-sm text-gray-700 ml-1">{(product.rating ?? 5).toFixed(1)} / 5</span>
              </div>
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <span key={b} className="inline-flex items-center rounded-full bg-teal text-white px-2.5 py-1 text-xs">{b}</span>
                  ))}
                </div>
              )}
            </div>

            {/* За спектакъла */}
            <div className="bg-white rounded-3xl shadow-sm border border-sand/20 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-pudelinka font-bold text-ink mb-4">За спектакъла</h2>
              <div
                className="prose prose-lg max-w-none prose-p:leading-7 prose-headings:font-pudelinka"
                dangerouslySetInnerHTML={{ __html: formattedDescription }}
              />
              <div className="grid grid-cols-3 gap-3 text-xs text-gray-700 mt-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teал" />
                  Гаранция за качество
                </div>
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-teал" />
                  Оригинална музика
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-teал" />
                  Пъстър декор
                </div>
              </div>
            </div>
          </div>

          {/* ДЯСНА КОЛОНА: Инфо + AddToCart + снимка под него */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-pudelинка font-bold text-ink">{product.title_bg}</h1>
              {product.short_description_bg && <p className="text-lg text-gray-700">{product.short_description_bg}</p>}
            </div>

            <div id="order-anchor">
              <AddToCartSpectacle
                className=""
                product={{
                  id: product.id,
                  titleBg: product.title_bg,
                  price,
                  image: images[0],
                  slug: product.slug,
                  compareAtPrice: compare,
                  mini_testimonial: product.mini_testimonial || undefined,
                }}
                ctaText="Поръчай"
              />
            </div>

            {/* Картичка със снимка под AddToCart */}
            <div className="rounded-2xl overflow-hidden border border-sand/20 bg-white">
              <img
                src="https://olyipzxropjwphlwdjse.supabase.co/storage/v1/object/public/images/spektakul/467765776_10161710743948490_8418895761805267699_n.webp"
                alt="Кадър от спектакъл"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy */}
      {(product.why_buy_title || product.why_buy_content) && (
        <WhyBuySection
          data={{
            title: product.why_buy_title || "",
            content: product.why_buy_content || "",
            image: product.why_buy_image || images[0] || "",
          }}
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      {/* Testimonials – веднага след WhyBuy */}
      {Array.isArray(product.testimonials) && product.testimonials.length > 0 && (
        <InsideSpectacleTestimonials
          testimonials={product.testimonials}
          initialCount={3}
          step={3}
        />
      )}

      {/* Warmth – ползва warmth_section_images */}
      {warmthImages.length > 0 && (
        <SpectacleWarmthSection
          images={warmthImages.slice(0, 12)}
          title="Магията на сцената отблизо"
          subtitle="Кадри, които разказват за смях, изненада и аплодисменти."
          ctaLabel="Поръчай сега"
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      {/* Certificates */}
      {certs.length > 0 && (
        <SpectacleCertificates
          certificates={certs}
          ctaLabel="Поръчай сега"
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      {/* Emotional Benefits */}
      {(product.emotional_benefits_title || product.emotional_benefits_content) && (
        <SpectacleEmotionalSection
          title={product.emotional_benefits_title || "Емоционалното пътешествие на спектакъла"}
          contentHtml={
            product.emotional_benefits_content ||
            "<p>Сцени, които учат на доброта и смелост, музика която обединява, герои, които дават пример. Един спектакъл, който оставя следа в сърцата.</p>"
          }
          ctaLabel="Поръчай сега"
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      {/* FAQ */}
      {Array.isArray(product.faq) && product.faq.length > 0 && (
        <SpectacleFAQ items={product.faq} />
      )}

      {/* Back link */}
      <div className="pb-16 text-center">
        <Link to="/kukleni-spektakli" className="inline-flex items-center gap-2 text-teal hover:underline">
          <ArrowLeft className="w-4 h-4" /> Назад към спектаклите
        </Link>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={previewImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          showThumbnails={true}
        />
      )}
    </div>
  );
};

export default SpectacleDetailPage;
