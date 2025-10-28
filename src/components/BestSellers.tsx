// src/components/BestSellers.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type SlideProduct = {
  title: string;
  href: string;           // вътрешен (/...) или външен (https://...)
  image?: string;
  subtitle?: string;
  priceBGN: number;
  compareAtPriceBGN?: number;
};

type Slide = {
  id: 'handmade' | 'audio' | 'shows';
  heading: string;
  bg: string;
  products: SlideProduct[];
};

const RATE_BGN_PER_EUR = 1.95583;
const toEUR = (bgn: number) => (bgn / RATE_BGN_PER_EUR).toFixed(2);
const fmtBGN = (v: number) => `${v.toFixed(2)} лв`;
const discountPercent = (price: number, compare?: number) =>
  compare && compare > price ? Math.round((1 - price / compare) * 100) : 0;

const isInternal = (href: string) => href.startsWith('/');

// ---------- Helpers ----------
function firstImage(src: any): string | undefined {
  try {
    if (!src) return undefined;
    if (Array.isArray(src)) {
      const s = src[0];
      return typeof s === 'string' ? s : s?.url || undefined;
    }
    if (typeof src === 'string') {
      const maybe = JSON.parse(src);
      if (Array.isArray(maybe)) {
        const s = maybe[0];
        return typeof s === 'string' ? s : s?.url || undefined;
      }
      return undefined;
    }
    return src?.url || undefined;
  } catch {
    return undefined;
  }
}

// ⚙️ Статични слайдове (оставяме само handmade; audio и shows са динамични)
const STATIC_SLIDES: Omit<Slide, 'products'> & { products: SlideProduct[] }[] = [
  {
    id: 'handmade',
    heading: 'Ръчно изработени',
    bg: 'https://i.ibb.co/dzHPhT9/resized-16-9-1-copy.webp',
    products: [
      {
        title: 'Тигърче (кукла/играчка)',
        href: '/rachno-izraboteni-kukli/tigarche',
        subtitle: 'Ръчна изработка с любов',
        image: 'https://i.ibb.co/PsnZF4Ph/tigarche.png',
        priceBGN: 49.90,
        compareAtPriceBGN: 59.90,
      },
      {
        title: 'Сънчовци',
        href: '/rachno-izraboteni-kukli/sanchovtsi-1',
        subtitle: 'Меки приятели за сладки сънища',
        image: 'https://i.ibb.co/NgMPDn80/sunchovci.png',
        priceBGN: 39.90,
        compareAtPriceBGN: 49.90,
      },
      {
        title: 'Възглавница за кърмене',
        href: '/rachno-izraboteni-kukli/vazglavnitsa-za-karmene',
        subtitle: 'Комфорт за мама и бебе',
        image: 'https://i.ibb.co/1fh4yhsm/vazglavnica.png',
        priceBGN: 69.90,
        compareAtPriceBGN: 79.90,
      },
    ],
  },
];

// Карта за CTA „Виж всички“
const LISTING_BY_SLIDE: Record<Slide['id'], string> = {
  handmade: '/rachno-izraboteni-kukli',
  audio: '/audio-prikazki',
  shows: '/kukleni-spektakli',
};

const ProductCard: React.FC<{ p: SlideProduct }> = ({ p }) => {
  const pct = discountPercent(p.priceBGN, p.compareAtPriceBGN);
  const savings = p.compareAtPriceBGN ? p.compareAtPriceBGN - p.priceBGN : 0;

  const ViewBtn: React.FC = () =>
    isInternal(p.href) ? (
      <Link
        to={p.href}
        className="inline-flex items-center justify-center rounded-lg bg-[#3c9383] px-4 py-2 text-xs md:text-sm font-colus text-white transition hover:opacity-95"
      >
        Виж продукта <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    ) : (
      <a
        href={p.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-lg bg-[#3c9383] px-4 py-2 text-xs md:text-sm font-colus text-white transition hover:opacity-95"
      >
        Виж продукта <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    );

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-white/15 bg-white/85 backdrop-blur-xl shadow-md"
    >
      {pct > 0 && (
        <div className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-red-500 text-white px-2.5 py-1 text-xs font-colus font-bold shadow-md">
          -{pct}%
        </div>
      )}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-sand-light/40">
        {p.image ? (
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">✨</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg md:text-xl leading-snug font-colus text-ink">{p.title}</h3>
        {p.subtitle && <p className="mt-1 text-xs md:text-sm text-zinc-600">{p.subtitle}</p>}

        <div className="mt-3 font-colus">
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl text-teal font-bold">{fmtBGN(p.priceBGN)}</span>
            {p.compareAtPriceBGN && p.compareAtPriceBGN > p.priceBGN && (
              <span className="text-sm md:text-base text-zinc-500 line-through">
                {fmtBGN(p.compareAtPriceBGN)}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-sm md:text-base text-zinc-700">€{toEUR(p.priceBGN)}</span>
            {p.compareAtPriceBGN && p.compareAtPriceBGN > p.priceBGN && (
              <span className="text-xs md:text-sm text-green-700 inline-flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Спестяваш {fmtBGN(savings)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <ViewBtn />
        </div>
      </div>
    </motion.article>
  );
};

const BestSellers: React.FC = () => {
  const [idx, setIdx] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);
  const len = 3;

  // Държим динамично заредените спектакли
  const [showProducts, setShowProducts] = React.useState<SlideProduct[] | null>(null);
  // Държим динамично заредените АУДИО ПРИКАЗКИ (точно 3)
  const [audioProducts, setAudioProducts] = React.useState<SlideProduct[] | null>(null);

  // fetch „Куклени спектакли“ (top 3)
  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('slug, title_bg, price, compare_at_price, images, gallery_images, category, short_description_bg')
        .in('category', ['spectacle', 'show', 'puppet_show'])
        .order('created_at', { ascending: false })
        .limit(3);
      if (error || !data) return;

      const mapped: SlideProduct[] = data.map((row: any) => ({
        title: row.title_bg,
        href: `/kukleni-spektakli/${row.slug}`,
        image: firstImage(row.gallery_images) || firstImage(row.images),
        subtitle: 'Театрална магия на живо',
        priceBGN: typeof row.price === 'number' ? row.price : 0,
        compareAtPriceBGN:
          typeof row.compare_at_price === 'number' ? row.compare_at_price : undefined,
      }));
      setShowProducts(mapped);
    })();
  }, []);

  // fetch „Аудио приказки“ (top 3) — category = 'audio_story'
  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('slug, title_bg, price, compare_at_price, images, gallery_images, category, short_description_bg')
        .eq('category', 'audio_story')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error || !data) return;

      const mapped: SlideProduct[] = data.map((row: any) => ({
        title: row.title_bg,
        href: `/audio-prikazki/${row.slug}`,
        image: firstImage(row.gallery_images) || firstImage(row.images),
        subtitle: row.short_description_bg || 'Аудио приказка',
        priceBGN: typeof row.price === 'number' ? row.price : 0,
        compareAtPriceBGN:
          typeof row.compare_at_price === 'number' ? row.compare_at_price : undefined,
      }));
      setAudioProducts(mapped);
    })();
  }, []);

  const SLIDES: Slide[] = [
    ...STATIC_SLIDES,
    {
      id: 'audio',
      heading: 'Аудио приказки',
      bg: 'https://i.ibb.co/21ZkDrMm/audio.webp',
      products:
        (audioProducts && audioProducts.length > 0
          ? audioProducts
          : [
              {
                title: 'Колекция аудио приказки',
                href: '/audio-prikazki',
                subtitle: 'Любими мелодии за малки уши',
                image: 'https://i.ibb.co/21ZkDrMm/audio.webp',
                priceBGN: 12.90,
                compareAtPriceBGN: 16.90,
              },
            ]) as SlideProduct[],
    },
    {
      id: 'shows',
      heading: 'Куклени спектакли',
      bg: 'https://i.ibb.co/GQ5P25Kh/kuklen.webp',
      products:
        (showProducts && showProducts.length > 0
          ? showProducts
          : [
              {
                title: 'Куклени спектакли',
                href: '/kukleni-spektakli',
                subtitle: 'Театрална магия на живо',
                image: 'https://i.ibb.co/KxN4Zv1y/kuklenspektakal.png',
                priceBGN: 179.0,
                compareAtPriceBGN: 199.0,
              },
            ]) as SlideProduct[],
    },
  ];

  const go = (n: number) => setIdx((i) => (i + n + len) % len);
  const goTo = (n: number) => setIdx(((n % len) + len) % len);

  React.useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => go(1), 6000) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const current = SLIDES[idx];
  const listingHref = LISTING_BY_SLIDE[current.id];

  return (
<section className="relative z-0 overflow-hidden pt-16 md:pt-24 lg:pt-32">
      <div className="relative h-[92vh] min-h-[640px] max-h-[1100px]">
        <AnimatePresence mode="wait">
          {/* BG */}
          <div className="absolute top-0 left-1/2 h-full w-[100vw] -translate-x-1/2 overflow-hidden">
            <motion.img
              key={current.id}
              src={current.bg}
              alt={current.heading}
              className="h-full w-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.6, scale: 1.01 }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </AnimatePresence>

        {/* Заглавие */}
        <div className="absolute top-6 z-20 w-full flex flex-col items-center gap-3 px-4">
          <motion.h3
            key={`heading-${current.id}`}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="inline-block w-fit rounded-2xl bg-white/90 px-4 py-2 text-xl sm:text-2xl md:text-3xl font-colus font-bold text-ink shadow-lg"
          >
            {current.heading}
          </motion.h3>
        </div>

        {/* Карти */}
        <div className="relative z-20 mx-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            key={`cards-${current.id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className={[
              'grid justify-items-center gap-4 md:gap-5',
              current.products.length === 1
                ? 'grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            ].join(' ')}
          >
            {current.products.map((p) => (
              <ProductCard key={p.href} p={p} />
            ))}
          </motion.div>
        </div>

        {/* Навигация */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-between px-2 sm:px-4">
          <button
            onClick={() => go(-1)}
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow ring-1 ring-white/70 backdrop-blur transition hover:bg-white md:h-11 md:w-11"
            aria-label="Предишен слайд"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow ring-1 ring-white/70 backdrop-blur transition hover:bg-white md:h-11 md:w-11"
            aria-label="Следващ слайд"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Индикатори */}
        <div className="absolute bottom-28 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Към слайд ${i + 1}`}
              className={[
                'h-2 rounded-full transition-all',
                i === idx ? 'w-7 bg-white' : 'w-4 bg-white/60 hover:bg-white/85',
              ].join(' ')}
            />
          ))}
        </div>

        {/* CTA „Виж всички" */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4">
          <Link
            to={listingHref}
            className="inline-flex items-center rounded-2xl bg-[#3c9383] px-8 py-4 text-lg font-colus text-white shadow-lg transition hover:opacity-95"
          >
            Виж всички
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
