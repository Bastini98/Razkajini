// src/components/InsideSpectacleTestimonials.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronDown, ChevronUp } from "lucide-react";

export type SpectacleTestimonial = {
  role?: string;
  quote?: string;
  author?: string;
  rating?: number;
};

type Props = {
  testimonials?: SpectacleTestimonial[];
  initialCount?: number; // по default 3
  step?: number;         // по default 3
  title?: string;
  subtitle?: string;
  className?: string;
};

const clampStars = (v?: number) =>
  Math.max(0, Math.min(5, Math.round(v ?? 5)));

const cleanQuotes = (s?: string) =>
  s ? s.replace(/^["“]|["”]$/g, "") : "";

const InsideSpectacleTestimonials: React.FC<Props> = ({
  testimonials,
  initialCount = 3,
  step = 3,
  title = "Какво споделят родителите",
  subtitle = "Истински отзиви от семейства, които са гледали спектакъла.",
  className = "",
}) => {
  const list = Array.isArray(testimonials) ? testimonials : [];
  const [visible, setVisible] = React.useState(initialCount);

  const shown = list.slice(0, visible);
  const canShowMore = visible < list.length;
  const canShowLess = visible > initialCount;

  if (list.length === 0) return null;

  return (
    <section className={`py-12 bg-sand-light/20 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl md:text-3xl font-pudelinka font-bold text-ink text-center">
          {title}
        </h3>
        {subtitle && (
          <p className="text-center text-gray-700 max-w-2xl mx-auto mt-2">
            {subtitle}
          </p>
        )}

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <AnimatePresence initial={false}>
            {shown.map((t, i) => {
              const stars = clampStars(t.rating);
              const text = cleanQuotes(t.quote);
              const author = t.author || "Анонимен";
              const role = t.role || "Родител";

              return (
                <motion.blockquote
                  key={`${author}-${i}-${stars}-${text.slice(0, 12)}`}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl border border-sand/20 p-6 relative shadow-sm"
                >
                  <Quote className="w-6 h-6 text-teal absolute -top-3 -left-3" />

                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          idx < stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {text && (
                    <p className="text-gray-700 leading-relaxed">“{text}”</p>
                  )}

                  <footer className="mt-4 text-sm">
                    <div className="font-medium text-gray-900">{author}</div>
                    <div className="text-gray-500">{role}</div>
                  </footer>
                </motion.blockquote>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 flex justify-center">
          {canShowMore ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVisible((v) => Math.min(v + step, list.length))}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3c9383] px-8 py-3 text-white font-colus text-lg transition hover:opacity-95 shadow-md"
            >
              Покажи още
              <ChevronDown className="h-5 w-5" />
            </motion.button>
          ) : canShowLess ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVisible(initialCount)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3c9383] px-8 py-3 text-white font-colus text-lg transition hover:opacity-95 shadow-md"
            >
              Покажи по-малко
              <ChevronUp className="h-5 w-5" />
            </motion.button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default InsideSpectacleTestimonials;
