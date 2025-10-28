// src/components/BabaDyadoSection.tsx
import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, X, Eye, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  priceBGN: number;
  href: string;               // вътрешен линк /books/:slug
  image: string;
  previewImages: string[];
  shortDescription?: string;
  features?: string[];
  icon?: React.ReactNode;
  isFeatured?: boolean;
};

const RATE_BGN_PER_EUR = 1.95583;
const toEUR = (bgn: number) => (bgn / RATE_BGN_PER_EUR).toFixed(2);

// ✅ фиксирани вътрешни линкове
const PRODUCTS: Product[] = [
  {
    id: "baba",
    title: "Бабо, разкажи ни!",
    subtitle: "Луксозна книга-дневник за семейни спомени",
    priceBGN: 58.7,
    href: "/books/baba",
    image:
      "https://razkajini.bg/storage/images/products/gallery/772f13b11852cce6ba377c6c9889b407.png",
    previewImages: [
      "https://i.ibb.co/JWzcRp93/babacoverpreview.webp",
      "https://i.ibb.co/5g8C5SrF/baba11.webp",
      "https://i.ibb.co/4wbMmY3Y/baba1.png",
      "https://i.ibb.co/mV7ZJ0xz/baba2.png",
      "https://i.ibb.co/4RcFVqkQ/baba3.png",
      "https://i.ibb.co/nNKJb8FB/baba4.png",
      "https://i.ibb.co/yc03WChc/baba5.png",
      "https://i.ibb.co/gLn84ZCP/baba6.png",
      "https://i.ibb.co/DH1q325G/baba7.png",
      "https://i.ibb.co/Pv1jrbJf/baba8.png",
    ],
    shortDescription:
      "„Бабо, разкажи ни любимата история!\" Луксозен дневник-наследство (128 стр., твърди корици, 300×235 мм) с въпроси, място за снимки и свободни страници, където баба записва най-ценните спомени. Подарък, който пази семейното дърво за поколения напред.",
  },
  {
    id: "bundle",
    title: "Бъндъл: Бабо + Дядо",
    subtitle: "Перфектният комплект за двамата",
    priceBGN: 105.6,
    href: "/books/bundle-baba-dyado", // ✅ вече вътрешен път
    image: "https://i.ibb.co/kLbR1bz/Screenshot-14-copy.png",
    previewImages: [
      "https://i.ibb.co/S4yHKrbx/bundle.webp",
      "https://i.ibb.co/zWvVhGgV/Generated-Image-September-30-2025-1-30-AM.webp",
      "https://i.ibb.co/cK2MbtHC/bundulche.webp",
      "https://i.ibb.co/MxRPSMJz/bundelcheto.webp",
    ],
    shortDescription:
      "Два дневника-наследство в комплект – подарък, който обединява цялото семейство.",
    icon: <Package className="w-5 h-5" />,
    isFeatured: true,
  },
  {
    id: "dyado",
    title: "Дядо, разкажи ни!",
    subtitle: "Луксозна книга-дневник за семейни спомени",
    priceBGN: 58.7,
    href: "/books/dyado", // ✅ добавен начален / 
    image:
      "https://razkajini.bg/storage/images/products/gallery/cf110ca7deb963d4b48592afba36a76d.png",
    previewImages: [
      "https://i.ibb.co/1YrzBLMm/dqdocoverpreview.webp",
      "https://i.ibb.co/rRzmtvnQ/dqdo11.webp",
      "https://i.ibb.co/twxWgZZp/dqdo1.png",
      "https://i.ibb.co/PvdK7SC0/dqdo2.png",
      "https://i.ibb.co/wF2FdhPY/dqdo3.png",
      "https://i.ibb.co/zV0TPTRL/dqdo4.png",
      "https://i.ibb.co/zV2J6p2h/dqdo5.png",
      "https://i.ibb.co/k2nS3gnv/dqdo6.png",
    ],
    shortDescription:
      "„Дядо, разкажи ни любимата история!\" Луксозен дневник-наследство (128 стр., твърди корици, 300×235 мм) с въпроси, място за снимки и свободни страници, където дядо записва най-ценните си спомени и мъдрост. Подарък, който пази семейното дърво за поколения напред.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.45, ease: "easeOut" },
  }),
};

// ---------- Modal Portal ----------
const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof document === "undefined") return null;
  const portalRoot =
    (document.getElementById("modal-root") as HTMLElement) ||
    (() => {
      const el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
      return el;
    })();
  return ReactDOM.createPortal(children, portalRoot);
};

const BabaDyadoSection: React.FC = () => {
  const { addItem } = useCart();

  const [quickView, setQuickView] = React.useState<Product | null>(null);
  const [slideIdx, setSlideIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);

  const lockScroll = (lock: boolean) => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = lock ? "hidden" : "";
  };

  const openQuickView = (p: Product) => {
    setQuickView(p);
    setSlideIdx(0);
    setQty(1);
    lockScroll(true);
  };
  const closeQuickView = () => {
    setQuickView(null);
    lockScroll(false);
  };

  const splitShortDescription = (s?: string): [string | null, string | null] => {
    if (!s) return [null, null];
    const idx = s.indexOf("!");
    if (idx === -1) return [null, s.trim()];
    const lead = s.slice(0, idx + 1).trim();
    const body = s.slice(idx + 1).trim();
    return [lead || null, body || null];
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!quickView) return;
      if (e.key === "Escape") closeQuickView();
      if (e.key === "ArrowLeft")
        setSlideIdx((i) =>
          (i - 1 + quickView.previewImages.length) % quickView.previewImages.length
        );
      if (e.key === "ArrowRight")
        setSlideIdx((i) => (i + 1) % quickView.previewImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickView]);

  const changeQty = (delta: number) =>
    setQty((q) => Math.max(1, Math.min(99, q + delta)));

  // ✅ добавяне в количката — същата структура като ProductCard
  const handleAddToCart = (p: Product, quantity = 1) => {
    const slug = p.href.startsWith("/books/") ? p.href.split("/").pop() : p.id;
    addItem({
      id: p.id,
      titleBg: p.title,
      price: p.priceBGN,
      image: p.image,
      slug: slug || p.id,
      quantity,
    });
  };

  const isInternal = (href: string) => href.startsWith("/");

  return (
    <section className="relative w-full py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-[#fffaf4] to-white" />
      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-[Pudelinka] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight tracking-tight">
            Подарък, който сближава поколенията
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1.25fr] items-start">
          {PRODUCTS.map((p, i) => {
            const isFeatured = p.isFeatured;
            const isSide = !isFeatured;

            return (
              <motion.article
                key={p.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className={[
                  "group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition",
                  isFeatured
                    ? "border-emerald-300 ring-2 ring-emerald-200 lg:z-10"
                    : "border-zinc-200",
                  isFeatured ? "" : "lg:translate-y-2 lg:scale-[1.05]",
                  "hover:shadow-lg",
                  isFeatured ? "lg:scale-[1.10]" : "",
                ].join(" ")}
              >
                {/* Бейдж */}
                {isFeatured && (
                  <div className="absolute right-3 top-3 z-30 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg ring-1 ring-emerald-300">
                    -10 % отстъпка
                  </div>
                )}

                {/* Око */}
                <button
                  type="button"
                  onClick={() => openQuickView(p)}
                  className={[
                    "absolute right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow ring-1 ring-zinc-200 backdrop-blur-sm transition hover:bg-white hover:ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500",
                    isFeatured ? "top-14" : "top-3",
                  ].join(" ")}
                  aria-label={`Бърз преглед: ${p.title}`}
                >
                  <Eye className="h-5 w-5" />
                </button>

                {/* Image */}
                <div
                  onClick={() => openQuickView(p)}
                  className="relative w-full overflow-hidden bg-[rgba(0,0,0,0.03)] cursor-zoom-in aspect-[16/10]"
                  role="button"
                  aria-label={`Отвори бърз преглед на ${p.title}`}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div
                  className={[
                    "flex flex-col gap-4",
                    isFeatured ? "p-8 bg-gradient-to-b from-emerald-50/40 to-white" : "p-7",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {/* Заглавие с Colus */}
                      <h3
                        className={
                          (isSide
                            ? "text-2xl sm:text-3xl leading-tight"
                            : "text-3xl sm:text-4xl leading-tight") + " font-colus"
                        }
                      >
                        {p.title}
                      </h3>

                      {p.subtitle && (
                        <p className={isSide ? "mt-1 text-sm text-zinc-600" : "mt-1 text-base text-zinc-600"}>
                          {p.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Цена – Colus */}
                    <div
                      className={[
                        "shrink-0 rounded-2xl px-4 py-3 text-right font-colus",
                        isFeatured ? "bg-emerald-50 text-emerald-800" : "bg-zinc-100 text-zinc-900",
                      ].join(" ")}
                    >
                      <div className="text-2xl sm:text-3xl leading-tight">
                        {p.priceBGN.toFixed(2)} лв
                      </div>
                      <div className="mt-1 text-base sm:text-lg">
                        (€{toEUR(p.priceBGN)})
                      </div>
                    </div>
                  </div>

                  {/* Бутони – Colus */}
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {isInternal(p.href) ? (
                      <Link
                        to={p.href}
                        className="inline-flex items-center justify-center rounded-xl bg-[#3c9383] px-5 py-2.5 text-sm font-colus text-white transition hover:opacity-95"
                      >
                        Виж продукта
                      </Link>
                    ) : (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-[#3c9383] px-5 py-2.5 text-sm font-colus text-white transition hover:opacity-95"
                      >
                        Виж продукта
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAddToCart(p, 1)}
                      className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-colus text-zinc-800 transition hover:bg-zinc-50"
                    >
                      Добави в количка
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-7 text-center text-xs text-zinc-500">
          * Книгите са луксозни дневници-наследство с твърди корици и 128 страници за историите на баба и дядо. (Курс: 1 EUR = 1.95583 лв.)
        </p>
      </div>

      {/* QUICK VIEW MODAL */}
      <AnimatePresence>
        {quickView && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-modal="true"
              role="dialog"
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeQuickView}
              />
              {/* Dialog */}
              <motion.div
                className="relative z-[10000] grid h-[90vh] w-full max-w-7xl xl:max-w-[90rem] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[1.55fr_1fr]"
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  type="button"
                  onClick={closeQuickView}
                  className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow ring-1 ring-zinc-200 transition hover:bg-white"
                  aria-label="Затвори"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Left */}
                <div className="relative grid h-full grid-cols-[80px_1fr] bg-zinc-50">
                  {/* Thumbs */}
                  <div className="hidden h-full overflow-y-auto overflow-x-hidden py-3 pr-2 pl-3 md:block">
                    <div className="flex h-fit flex-col items-center gap-3">
                      {quickView.previewImages.map((src, idx) => (
                        <button
                          key={src + idx}
                          type="button"
                          onClick={() => setSlideIdx(idx)}
                          className={[
                            "h-16 w-16 overflow-hidden rounded-full border-2 bg-white transition",
                            idx === slideIdx
                              ? "border-emerald-500 ring-2 ring-emerald-300"
                              : "border-zinc-200 hover:border-zinc-300",
                          ].join(" ")}
                          aria-label={`Миниатюра ${idx + 1}`}
                        >
                          <img
                            src={src}
                            alt={`Миниатюра ${idx + 1}`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main image */}
                  <div className="relative h-full">
                    <div className="relative h-full w-full overflow-hidden">
                      <motion.img
                        key={quickView.previewImages[slideIdx]}
                        src={quickView.previewImages[slideIdx]}
                        alt={`${quickView.title} – страница ${slideIdx + 1}`}
                        className="h-full w-full object-contain"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          const len = quickView.previewImages.length;
                          if (info.offset.x < -60) setSlideIdx((i) => (i + 1) % len);
                          if (info.offset.x > 60) setSlideIdx((i) => (i - 1 + len) % len);
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>

                    {/* Mobile thumbs */}
                    <div className="flex gap-3 overflow-x-auto p-4 md:hidden">
                      {quickView.previewImages.map((src, idx) => (
                        <button
                          key={src + idx}
                          type="button"
                          onClick={() => setSlideIdx(idx)}
                          className={[
                            "h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 bg-white transition",
                            idx === slideIdx
                              ? "border-emerald-500 ring-2 ring-emerald-300"
                              : "border-zinc-200 hover:border-zinc-300",
                          ].join(" ")}
                          aria-label={`Миниатюра ${idx + 1}`}
                        >
                          <img
                            src={src}
                            alt={`Миниатюра ${idx + 1}`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex h-full flex-col gap-6 p-8 overflow-auto">
                  <div>
                    {/* Заглавие – Colus */}
                    <h3 className="text-3xl sm:text-4xl leading-tight font-colus">
                      {quickView.title}
                    </h3>
                    {/* Цени – Colus */}
                    <div className="mt-3 font-colus">
                      <div className="text-2xl sm:text-3xl text-zinc-900">
                        {quickView.priceBGN.toFixed(2)} лв
                      </div>
                      <div className="mt-1 text-base sm:text-lg text-zinc-700">
                        (€{toEUR(quickView.priceBGN)})
                      </div>
                    </div>
                  </div>

                  {/* Описание */}
                  {(() => {
                    const [lead, body] = splitShortDescription(
                      quickView.shortDescription
                    );
                    return (
                      <div>
                        {lead && (
                          <p className="text-lg sm:text-xl font-semibold text-zinc-800">
                            {lead}
                          </p>
                        )}
                        {body && (
                          <p className="mt-2 text-base sm:text-lg leading-7 text-zinc-700">
                            {body}
                          </p>
                        )}
                        {!lead && !body && quickView.shortDescription && (
                          <p className="text-base sm:text-lg leading-7 text-zinc-700">
                            {quickView.shortDescription}
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* Количество + Добавяне */}
                  <div className="mt-2 flex items-stretch gap-4">
                    <div className="inline-flex items-center rounded-xl border border-zinc-300 bg-white">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="h-12 w-12 inline-flex items-center justify-center rounded-l-xl transition hover:bg-zinc-50"
                        aria-label="Намали количество"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value || "1", 10);
                          setQty(isNaN(v) ? 1 : Math.max(1, Math.min(99, v)));
                        }}
                        className="h-12 w-16 appearance-none border-x border-zinc-300 text-center text-lg outline-none"
                        aria-label="Количество"
                      />
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.min(99, q + 1))}
                        className="h-12 w-12 inline-flex items-center justify-center rounded-r-xl transition hover:bg-zinc-50"
                        aria-label="Увеличи количество"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Бутон – Colus */}
                    <button
                      type="button"
                      onClick={() => {
                        if (quickView) handleAddToCart(quickView, qty);
                      }}
                      className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#3c9383] px-6 text-base sm:text-lg font-colus text-white transition hover:opacity-95 h-12"
                    >
                      Добави в количка
                    </button>
                  </div>

                  {/* Бенефити */}
                  <div className="mt-auto grid grid-cols-2 gap-4 pt-4">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 p-4">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                        <Truck className="h-8 w-8 text-emerald-700" />
                      </div>
                      <div className="mt-2 text-sm font-medium text-zinc-800 text-center">
                        Бърза доставка
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 p-4">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                        <RotateCcw className="h-8 w-8 text-emerald-700" />
                      </div>
                      <div className="mt-2 text-sm font-medium text-zinc-800 text-center">
                        Лесно връщане
                      </div>
                    </div>
                  </div>

                  {/* CTA към пълния продукт – Colus */}
                  <div className="mt-4 flex justify-center">
                    {isInternal(quickView.href) ? (
                      <Link
                        to={quickView.href}
                        onClick={closeQuickView}
                        className="inline-flex items-center justify-center rounded-2xl border-2 border-zinc-300 px-8 py-4 text-lg sm:text-xl font-colus text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Виж пълният продукт
                      </Link>
                    ) : (
                      <a
                        href={quickView.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-2xl border-2 border-zinc-300 px-8 py-4 text-lg sm:text-xl font-colus text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Виж пълният продукт
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BabaDyadoSection;
