// src/components/SpectacleWarmthSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Lightbox from "./Lightbox";

interface WarmthProps {
  images: string[];
  title?: string;
  subtitle?: string;
  ctaLabel?: "Поръчай сега" | "Купи сега" | "Поръчай" | "Купи";
  onCtaClick?: () => void; // по избор: добавя текущия продукт/билет в количката
}

const SECTION_BG = "https://i.ibb.co/3yvr1Hbt/wallpaper.webp";

const SpectacleWarmthSection: React.FC<WarmthProps> = ({
  images,
  title = "Магията на сцената отблизо",
  subtitle = "Кадри, които разказват за смях, изненада и аплодисменти.",
  ctaLabel = "Поръчай сега",
  onCtaClick,
}) => {
  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  if (list.length === 0) return null;

  return (
    <section
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      {/* subtle frame gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="mx-auto max-w-3xl bg-white/85 backdrop-blur-[2px] rounded-3xl shadow-2xl border border-white/40 px-8 sm:px-10 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full mb-5 shadow">
              <Heart className="h-7 w-7 text-pink-600" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold text-ink mb-2">
              {title}
            </h2>
            {!!subtitle && <p className="text-lg text-gray-700">{subtitle}</p>}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {list.slice(0, 8).map((src, i) => (
            <motion.button
              key={src + i}
              type="button"
              onClick={() => {
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className={[
                "group relative overflow-hidden rounded-3xl border border-sand/30 bg-white shadow-lg",
                i === 0 ? "col-span-2 row-span-2 h-[360px]" : "h-40",
                i === 3 ? "lg:col-span-2" : "",
              ].join(" ")}
              aria-label={`Отвори изображение ${i + 1}`}
            >
              <img
                src={src}
                alt={`Сцена от спектакъл ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.button>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCtaClick}
            className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus px-8 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
            aria-label={ctaLabel}
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={list}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          showThumbnails={true}
        />
      )}
    </section>
  );
};

export default SpectacleWarmthSection;
 