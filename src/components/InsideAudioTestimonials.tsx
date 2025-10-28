import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp, Quote } from "lucide-react";

export type Testimonial = {
  stars?: number;
  quote?: any;
  author?: any;
  label?: any;
};

type Props = {
  testimonials?: Testimonial[];
  initialCount?: number;
  step?: number;
  title?: string;
  subtitle?: string;
  ctaLabelMore?: string;
  ctaLabelLess?: string;
  className?: string;
};

const clampStars = (v?: number) =>
  Math.max(0, Math.min(5, Math.round(Number(v ?? 5))));

const cleanQuote = (s: any) => String(s ?? "").replace(/^["“]|["”]$/g, "");

const InsideAudioTestimonials: React.FC<Props> = ({
  testimonials,
  initialCount = 3,
  step = 3,
  title = "Какво казват слушателите",
  subtitle = "Истински отзиви от семейства, които превърнаха аудио-приказките в любим ритуал.",
  ctaLabelMore = "Покажи още",
  ctaLabelLess = "Покажи по-малко",
  className = "",
}) => {
  const list = Array.isArray(testimonials) ? testimonials : [];
  const [visible, setVisible] = React.useState(initialCount);

  if (list.length === 0) return null;

  const shown = list.slice(0, visible);
  const canShowMore = visible < list.length;
  const canShowLess = visible > initialCount;

  return (
    <section className={`py-16 bg-gradient-to-b from-white to-sand-light/30 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-colus font-bold text-ink mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
        <AnimatePresence initial={false}>
          {shown.map((t, idx) => {
            const stars = clampStars(t.stars);
            const quote = cleanQuote(t.quote);
            const author = String(t.author ?? "Анонимен");
            const label = String(t.label ?? "Слушател");
            return (
              <motion.blockquote
                key={`${author}-${idx}-${quote.substring(0, 10)}`}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-sand/20 bg-white p-6 shadow-sm hover:shadow-md transition relative"
              >
                <Quote className="w-6 h-6 text-teal absolute -top-3 -left-3" />

                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                {quote && (
                  <p className="text-gray-800 italic mb-4 text-sm leading-relaxed">
                    “{quote}”
                  </p>
                )}

                <footer className="text-xs">
                  <div className="font-medium text-gray-900">{author}</div>
                  <div className="text-gray-500">{label}</div>
                </footer>
              </motion.blockquote>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex justify-center">
        {canShowMore ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setVisible((v) => Math.min(v + step, list.length))}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3c9383] px-8 py-3 text-white font-colus text-lg transition hover:opacity-95 shadow-md"
          >
            {ctaLabelMore}
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
            {ctaLabelLess}
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        ) : null}
      </div>
    </section>
  );
};

export default InsideAudioTestimonials;
