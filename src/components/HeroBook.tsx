import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';

const HeroBook: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image (full bleed) */}
      <img
        src="https://i.ibb.co/jkHBCqzW/Chat-GPT-Image-Sep-29-2025-12-39-33-PM-copy.webp"
        alt="Семейни спомени – баба и дядо и техните истории"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex min-h-[70svh] items-start"
        >
          <div className="max-w-2xl">
            {/* Bigger main heading with custom color */}
            <h1
              className="font-pudelinka font-light leading-tight tracking-[-0.02em]
                         text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#4f3d2e]"
            >
              Те ни разказват,<br className="hidden sm:block" />
              Заедно изживяваме
            </h1>

            {/* Smaller supporting text in black */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl/relaxed max-w-xl text-black">
              Подари на баба и дядо книга, в която да запишат историите си —
              спомените оживяват и остават завинаги.
            </p>

            {/* 5 stars + CTA */}
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-1" aria-label="Оценка 5 от 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-xs sm:text-sm text-neutral-800">5.0 • 120+ отзива</span>
              </div>

              <button type="button"
                
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3
                           text-sm sm:text-base font-medium bg-[#3c9383] text-white
                           hover:bg-[#347f71] transition cursor-default shadow-lg"
              >
                Виж книгите
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Trust indicators in dark gray */}
            <div className="mt-4 sm:mt-5 space-y-2 text-neutral-800">
              <div className="flex items-start gap-2 text-xs sm:text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Над 3 000 щастливи семейства запазиха историите си</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Архивно качество</span>
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>14 дни право на връщане — без въпроси</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBook;
 