// src/pages/DollDetailPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Shield, ArrowRight, Sparkles, Ruler, Leaf, Feather, Home as HomeIcon } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import AddToCart from "../components/AddToCart";
import WhyBuySection from "../components/WhyBuySection";
import FAQSection from "../components/FAQSection";
import InsideBooksTestimonials from "../components/InsideBooksTestimonials";
import WarmthSectionUnified from "../components/WarmthSectionUnified";
import EmotionalBenefitSectionUnified from "../components/EmotionalBenefitSectionUnified";
import { useCart } from "../context/CartContext";

export default function DollDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [showAllTestimonials, setShowAllTestimonials] = React.useState(false);

  // 🛒 Cart integration - ALWAYS call hooks before any conditional returns
  const { addItem, openCart } = useCart();

  // ✅ Define all callbacks BEFORE any conditional returns to follow Rules of Hooks
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
      };
      addItem(item);
      openCart();
    },
    [addItem, openCart]
  );

  const handleAddCurrentProductToCart = React.useCallback(() => {
    addOneToCart(product);
  }, [product, addOneToCart]);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
        if (error) throw error;
        if (isMounted) {
          setProduct(data);
          setActiveIdx(0);
          setShowAllTestimonials(false);
        }
      } catch (e) {
        console.error("Failed to load product:", e);
        if (isMounted) setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [slug]);

  // NOW it's safe to do conditional returns - all hooks have been called
  if (loading) return (<div className="min-h-screen flex items-center justify-center"><p className="text-gray-600">Зареждане...</p></div>);
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-colus font-bold text-ink mb-4">Продуктът не е намерен</h1>
        <p className="text-gray-600">Извинете, този продукт не съществува или е премахнат.</p>
      </div>
    </div>
  );

  // ДАННИ
  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const galleryImages: string[] = Array.isArray(product.gallery_images) ? product.gallery_images : [];
  const previewImages: string[] = galleryImages.length > 0 ? galleryImages : images;
  const activeSrc: string = previewImages?.[activeIdx] ?? images?.[0] ?? "";

  const whyBuySection = (product.why_buy_title || product.why_buy_image || product.why_buy_content)
    ? { title: product.why_buy_title || "", image: product.why_buy_image || "", content: product.why_buy_content || "" }
    : null;

  const emotionalBenefits = (product.emotional_benefits_title || product.emotional_benefits_content)
    ? { title: product.emotional_benefits_title || "", content: product.emotional_benefits_content || "" }
    : null;

  const faq: { question: string; answer: string }[] = Array.isArray(product.faq) ? product.faq : [];
  const testimonialsAll: Array<{ author?: string; quote?: string; rating?: number }> = Array.isArray(product.testimonials) ? product.testimonials : [];
  const warmthSectionImages: string[] = Array.isArray(product.warmth_section_images) ? product.warmth_section_images : [];

  const category = String(product.category || "").toLowerCase();
  const isPillow = category === "pillow" || category === "pilow";

  const baseSpecs = product && typeof product.doll_specs === "object" && product.doll_specs !== null ? product.doll_specs : {};
  const pillowSpecs = product && typeof product.pillow_specs === "object" && product.pillow_specs !== null ? product.pillow_specs : null;
  const specs: any = isPillow && pillowSpecs ? pillowSpecs : baseSpecs;

  const testimonialsToShow = showAllTestimonials ? testimonialsAll : testimonialsAll.slice(0, 5);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Галерия */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-4">
                  <div className="hidden md:block">
                    <div className="sticky top-8 flex md:flex-col gap-3 max-h-[600px] overflow-auto pr-1">
                      {previewImages.map((src, idx) => (
                        <button
                          key={`${src}-${idx}`} onClick={() => setActiveIdx(idx)} aria-label={`Преглед ${idx + 1}`}
                          className={[
                            "h-16 w-16 rounded-full border-2 overflow-hidden bg-white transition",
                            idx === activeIdx ? "border-emerald-500 ring-2 ring-emerald-300" : "border-zinc-200 hover:border-zinc-300",
                          ].join(" ")}
                        >
                          <img src={src} alt={`Миниатюра ${idx + 1}`} className="h-full w-full object-cover rounded-full" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    {activeSrc && (
                      <motion.img key={activeSrc} src={activeSrc} alt={product.title_bg}
                        className="w-full h-[600px] object-cover"
                        initial={{ opacity: 0.6, scale: 0.995 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} />
                    )}
                    {product.on_sale && (
                      <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full font-colus font-semibold">-ПРОМО</div>
                    )}
                  </div>
                </div>

                {/* Мобилни тъмбнейли */}
                <div className="md:hidden mt-4 -mx-1 px-1">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {previewImages.map((src, idx) => (
                      <button
                        key={`${src}-m-${idx}`} onClick={() => setActiveIdx(idx)} aria-label={`Преглед ${idx + 1}`}
                        className={[
                          "h-16 w-16 shrink-0 rounded-full border-2 overflow-hidden bg-white transition",
                          idx === activeIdx ? "border-emerald-500 ring-2 ring-emerald-300" : "border-zinc-200 hover:border-zinc-300",
                        ].join(" ")}
                      >
                        <img src={src} alt={`Миниатюра ${idx + 1}`} className="h-full w-full object-cover rounded-full" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Текст и баджове */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  ))}
                  <span className="text-gray-600 ml-2">({product.rating || "5.0"})</span>
                </div>

                {Array.isArray(product.badges) && product.badges.map((b: string) => (
                  <span key={b} className="bg-teal text-white px-3 py-1 rounded-full text-sm font-medium">{b}</span>
                ))}

                {Boolean(product.is_wall_hanging) && (
                  <span className="inline-flex items-center gap-1 bg-white border border-sand/40 px-3 py-1 rounded-full text-sm text-ink">
                    <HomeIcon className="h-4 w-4" /> За стена
                  </span>
                )}
                {Boolean(product.made_to_order) && (
                  <span className="inline-flex items-center gap-1 bg-white border border-teal/30 px-3 py-1 rounded-full text-sm text-ink">
                    <Sparkles className="h-4 w-4" />
                    Изработва се по поръчка
                    {typeof product.production_time_days === "number" ? ` (${product.production_time_days} дни)` : ""}
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-6xl font-colus font-bold text-ink mb-4">{product.title_bg}</h1>

              {!!product.short_description_bg && (
                <p className="text-xl text-gray-700 leading-relaxed mb-6">{product.short_description_bg}</p>
              )}

              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: product.description_html_bg || "" }} />
            </motion.div>

            {/* Спецификации */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur border border-sand/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Ruler className="h-6 w-6 text-teal" />
                  <h3 className="text-xl font-colus text-ink">{isPillow ? "Ергономия и съдържание" : "Размери и съдържание"}</h3>
                </div>
                <ul className="text-gray-700 space-y-2">
                  {specs?.dimensions && <li>• Размери: {specs.dimensions}</li>}
                  {specs?.set && <li>• Комплект: {specs.set}</li>}
                  {specs?.contents && <li>• Съдържание: {specs.contents}</li>}
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur border border-sand/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Leaf className="h-6 w-6 text-teал" />
                  <h3 className="text-xl font-colus text-ink">{isPillow ? "Материи и грижа" : "Материали и поддръжка"}</h3>
                </div>
                <ul className="text-gray-700 space-y-2">
                  {specs?.materials && <li>• Материали: {specs.materials}</li>}
                  {specs?.care && <li>• Поддръжка: {specs.care}</li>}
                  {specs?.placement && <li>• Поставяне: {specs.placement}</li>}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Add to cart */}
          <motion.div id="add-to-cart" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
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
            <div className="bg-white rounded-2xl p-6 shadow border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-colus font-bold text-green-800 mb-2">100% гаранция за удовлетвореност</h3>
                  <p className="text-green-700">Ако не усетите уют и усмивки още с първото гушване — върнете в 14 дни.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Защо да купиш */}
      {whyBuySection && <WhyBuySection data={whyBuySection} onCtaClick={handleAddCurrentProductToCart} />}

      {/* Отзиви с „Виж още“ */}
      {testimonialsAll.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <InsideBooksTestimonials testimonials={testimonialsToShow} />
            {testimonialsAll.length > 5 && !showAllTestimonials && (
              <div className="mt-6 flex justify-center">
               
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-green-200">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Feather className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-3xl font-colus font-bold text-green-800 mb-4">Уют за съня и прегръдка за деня</h3>
                <p className="text-lg text-green-700 leading-relaxed mb-6">
                  Авторска мекота, естествени материи и нежни изражения — защото най-ценен е спокойният детски сън и щастливата игра.
                </p>
                <motion.a href="#add-to-cart" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center bg-teal text-white font-colus font-semibold px-10 py-5 rounded-2xl text-lg transition-all duration-200 shadow-md hover:bg-teal-dark focus:outline-none focus:ring-4 focus:ring-teal/30">
                  Поръчайте сега
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warmth section - unified component handles pillow vs doll internally */}
      <WarmthSectionUnified
        images={warmthSectionImages}
        isPillow={isPillow}
        onCtaClick={handleAddCurrentProductToCart}
      />

      {/* Emotional benefits section - unified component handles pillow vs doll internally */}
      <EmotionalBenefitSectionUnified
        data={emotionalBenefits}
        isPillow={isPillow}
        onCtaClick={handleAddCurrentProductToCart}
      />

      {Array.isArray(faq) && faq.length > 0 && <FAQSection faqs={faq} />}
    </div>
  );
}
