// src/pages/BookDetailPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Shield, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import AddToCart from "../components/AddToCart";
import WhyBuySection from "../components/WhyBuySection";
import WhereToFindUs from "../components/WhereToFindUs";
import BundleOffer from "../components/BundleOffer";
import EmotionalBenefitSection from "../components/EmotionalBenefitSection";
import FAQSection from "../components/FAQSection";
import InsideBooksTestimonials from "../components/InsideBooksTestimonials";
import WarmthSection from "../components/WarmthSection";
import { bookstores } from "../lib/data";
import { useCart } from "../context/CartContext";

const HERO_BY_SLUG: Record<"baba" | "dyado", string> = {
  baba: "https://olyipzxropjwphlwdjse.supabase.co/storage/v1/object/public/images/heroes/baba.svg",
  dyado: "https://olyipzxropjwphlwdjse.supabase.co/storage/v1/object/public/images/heroes/dyado.svg",
};

const BookDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeIdx, setActiveIdx] = React.useState(0);

  // ✅ реалният бъндъл от база
  const [bundleProduct, setBundleProduct] = React.useState<any>(null);

  // 🛒 достъп до количката
  const { addItem, addToCart } = (useCart() as any) ?? {};

  // ✅ ЕДИННА функция за добавяне на продукт към количката
  const addOneToCart = React.useCallback(
    (p: any) => {
      if (!p) return;
      const imgs: string[] = Array.isArray(p.images) ? p.images : [];
      const item = {
        id: p.id,
        titleBg: p.title_bg,
        price: p.price,
        image: imgs[0] || "",
        slug: p.slug,
        compareAtPrice: p.compare_at_price,
        stock: p.stock,
        mini_testimonial: p.mini_testimonial,
      };

      if (typeof addItem === "function") addItem(item, 1);
      else if (typeof addToCart === "function") addToCart(item, 1);
      else {
        window.dispatchEvent(
          new CustomEvent("cart:add", { detail: { ...item, quantity: 1 } })
        );
      }
    },
    [addItem, addToCart]
  );

  const handleAddCurrentProductToCart = React.useCallback(() => {
    addOneToCart(product);
  }, [product, addOneToCart]);

  const handleAddBundleToCart = React.useCallback(() => {
    addOneToCart(bundleProduct);
  }, [bundleProduct, addOneToCart]);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data, error }, { data: bundleData }] = await Promise.all([
        supabase.from("products").select("*").eq("slug", slug).single(),
        supabase.from("products").select("*").eq("slug", "bundle-baba-dyado").single(),
      ]);
      if (!error && data) {
        setProduct(data);
        setActiveIdx(0);
      }
      setBundleProduct(bundleData || null);
      setLoading(false);
    })();
  }, [slug]);

  // 🧩 Определи кой герой да се покаже вляво според слъга
  const heroLeftSrc = React.useMemo(() => {
    const s = (product?.slug || slug || "").toString().toLowerCase();
    if (s.includes("baba")) return HERO_BY_SLUG.baba;
    if (s.includes("dyado")) return HERO_BY_SLUG.dyado;
    return null;
  }, [product?.slug, slug]);

  // 🧩 Bundle ли е? (по slug или category)
  const isBundle = React.useMemo(() => {
    const s = (product?.slug || "").toString().toLowerCase();
    const c = (product?.category || "").toString().toLowerCase();
    return s.includes("bundle") || c.includes("bundle");
  }, [product?.slug, product?.category]);

  // 👉 Ако е bundle, показваме и дядо отдясно с абсолютно същия размер
  const heroRightSrc = isBundle ? HERO_BY_SLUG.dyado : null;

  // 👇 Поява на героите след зареждане
  const [showHeroes, setShowHeroes] = React.useState(false);
  React.useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setShowHeroes(true), 500); // малко по-дълго забавяне
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Зареждане...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-colus font-bold text-ink mb-4">Книгата не е намерена</h1>
          <p className="text-gray-600">Извинете, тази книга не съществува или е била премахната.</p>
        </div>
      </div>
    );
  }

  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const galleryImages: string[] = Array.isArray(product.gallery_images) ? product.gallery_images : [];
  const previewImages: string[] = galleryImages.length > 0 ? galleryImages : images;
  const activeSrc: string = previewImages[activeIdx] ?? images[0] ?? "";

  const whyBuySection =
    product.why_buy_title || product.why_buy_image || product.why_buy_content
      ? {
          title: product.why_buy_title || "",
          image: product.why_buy_image || "",
          content: product.why_buy_content || "",
        }
      : null;

  const emotionalBenefits =
    product.emotional_benefits_title || product.emotional_benefits_content
      ? {
          title: product.emotional_benefits_title || "",
          content: product.emotional_benefits_content || "",
        }
      : null;

  const faq: { question: string; answer: string }[] = Array.isArray(product.faq) ? product.faq : [];
  const testimonials = Array.isArray(product.testimonials) ? product.testimonials : [];
  const warmthSectionImages: string[] = Array.isArray(product.warmth_section_images)
    ? product.warmth_section_images
    : [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === Лява колона (галерия) === */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              {/* Този wrapper е relative, за да позиционираме героите спрямо него */}
              <div className="relative overflow-visible">
                {/* 👇 Ляв герой (баба/дядо според продукта) */}
                {showHeroes && heroLeftSrc && (
                  <motion.img
                    src={heroLeftSrc}
                    alt=""
                    aria-hidden="true"
                    className="
                      hidden lg:block
                      pointer-events-none select-none
                      absolute top-[20%] -translate-y-1/2
                      -left-[26rem] xl:-left-[30rem]
                      w-[28rem] xl:w-[32rem]
                      h-auto
                      drop-shadow-2xl
                      z-20
                    "
                    initial={{ opacity: 0, scale: 0.9, x: -40, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                  />
                )}

                {/* 👉 Десен герой (само при bundle): Дядо — огледално позициониран, същия размер */}
                {showHeroes && heroRightSrc && (
                  <motion.img
                    src={heroRightSrc}
                    alt=""
                    aria-hidden="true"
                    className="
                      hidden lg:block
                      pointer-events-none select-none
                      absolute top-[20%] -translate-y-1/2
-right-[50rem] xl:-right-[56rem]
                      w-[28rem] xl:w-[32rem]
                      h-auto
                      drop-shadow-2xl
                      z-20
                    "
                    initial={{ opacity: 0, scale: 0.9, x: 40, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-4">
                  <div className="hidden md:block">
                    <div className="sticky top-8 flex md:flex-col gap-3 max-h-[600px] overflow-auto pr-1">
                      {previewImages.map((src, idx) => (
                        <button
                          key={`${src}-${idx}`}
                          onClick={() => setActiveIdx(idx)}
                          aria-label={`Преглед страница ${idx + 1}`}
                          className={[
                            "h-16 w-16 rounded-full border-2 overflow-hidden bg-white transition",
                            idx === activeIdx
                              ? "border-emerald-500 ring-2 ring-emerald-300"
                              : "border-zinc-200 hover:border-zinc-300",
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

                  <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
                    {activeSrc && (
                      <motion.img
                        key={activeSrc}
                        src={activeSrc}
                        alt={product.title_bg}
                        className="w-full h-[600px] object-cover"
                        initial={{ opacity: 0.6, scale: 0.995 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                    {product.on_sale && (
                      <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full font-colus font-semibold">
                        -15%
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:hidden mt-4 -mx-1 px-1">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {previewImages.map((src, idx) => (
                      <button
                        key={`${src}-m-${idx}`}
                        onClick={() => setActiveIdx(idx)}
                        aria-label={`Преглед страница ${idx + 1}`}
                        className={[
                          "h-16 w-16 shrink-0 rounded-full border-2 overflow-hidden bg-white transition",
                          idx === activeIdx
                            ? "border-emerald-500 ring-2 ring-emerald-300"
                            : "border-zinc-200 hover:border-zinc-300",
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    ({product.rating || "5.0"}) • 120+ отзива
                  </span>
                </div>
                {Array.isArray(product.badges) &&
                  product.badges.map((badge: string) => (
                    <span
                      key={badge}
                      className="bg-теал text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
              </div>

              <h1 className="text-4xl lg:text-6xl font-colus font-bold текст-ink mb-4">
                {product.title_bg}
              </h1>

              {!!product.short_description_bg && (
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  {product.short_description_bg}
                </p>
              )}

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: product.description_html_bg || "",
                }}
              />
            </motion.div>
          </div>

          {/* === Дясна колона (Add to Cart) === */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <AddToCart
              product={{
                id: product.id,
                titleBg: product.title_bg,
                price: product.price,
                images: images,
                slug: product.slug,
                compareAtPrice: product.compare_at_price,
                stock: product.stock,
                mini_testimonial: product.mini_testimonial,
              }}
            />
          </motion.div>
        </div>
      </div>

      {whyBuySection && (
        <WhyBuySection
          data={whyBuySection}
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      {testimonials.length > 0 && <InsideBooksTestimonials testimonials={testimonials} />}

      {/* Guarantee Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-green-200"
          >
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-3xl font-colus font-bold text-green-800 mb-4">
                  100% гаранция за удовлетвореност
                </h3>
                <p className="text-lg text-green-700 leading-relaxed mb-6">
                  Ако в рамките на 14 дни не усетите как тази книга променя отношенията ви с близките,
                  просто ни я върнете и ще получите пълен възврат на парите. Без въпроси, без условия.
                </p>
                <p className="text-green-600 font-semibold mb-8">
                  Защото вярваме, че всяка страница ще ви сближи още повече.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddCurrentProductToCart}
                  aria-label="Добави в количката"
                  className="inline-flex items-center justify-center bg-teal text-white font-colus font-semibold px-10 py-5 rounded-2xl text-lg transition-all duration-200 shadow-md hover:bg-teal-dark focus:outline-none focus:ring-4 focus:ring-teal/30"
                >
                  Поръчайте без риск
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {warmthSectionImages.length > 0 && (
        <WarmthSection
          images={warmthSectionImages}
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      <WhereToFindUs
        bookstores={bookstores}
        onCtaClick={handleAddCurrentProductToCart}
      />

      {/* Бъндъл – реалният продукт от базата */}
      <BundleOffer bundle={bundleProduct} onAdd={handleAddBundleToCart} />

      {emotionalBenefits && (
        <EmotionalBenefitSection
          data={emotionalBenefits}
          onCtaClick={handleAddCurrentProductToCart}
        />
      )}

      {faq.length > 0 && <FAQSection faqs={faq} />}
    </div>
  );
};

export default BookDetailPage;
