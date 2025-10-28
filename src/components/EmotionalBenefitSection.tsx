import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

interface EmotionalBenefitSectionProps {
  data: {
    title: string;
    content: string; // HTML
  };
  onCtaClick?: () => void; // 👈 добавено: извиква се при клик
}

const SECTION_BG = 'https://i.ibb.co/3yvr1Hbt/wallpaper.webp';

const EmotionalBenefitSection: React.FC<EmotionalBenefitSectionProps> = ({ data, onCtaClick }) => {
  return (
    <section
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      {/* лек градиент за контраст */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header в бял заоблен фон за четимост */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="mx-auto max-w-3xl bg-white/85 backdrop-blur-[2px] rounded-3xl shadow-2xl border border-white/40 px-8 sm:px-10 py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-colus font-bold text-ink">
              {data.title}
            </h2>
          </div>
        </motion.div>

        {/* White card with embedded amber strip (ONE CTA here) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/85 backdrop-blur-[2px] rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/40"
        >
          <div
            className={[
              'prose prose-lg max-w-none text-center',
              'prose-headings:font-colus prose-headings:font-bold prose-headings:text-ink',
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: data.content }}
          />

          {/* Embedded urgency strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 rounded-2xl p-6 border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50"
          >
            <div className="text-center">
              <h3 className="text-xl font-colus font-bold text-amber-800 mb-2">
                Всеки ден, който минава...
              </h3>
              <p className="text-amber-700 leading-relaxed">
                ...е ден, в който губим безценни истории. Не чакайте утре — започнете да записвате спомените днес, докато баба все още може да ги сподели.
              </p>

              <div className="mt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCtaClick} // 👈 добавено
                  className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus font-semibold px-7 py-3 rounded-xl transition-colors duration-200 shadow-lg"
                >
                  Подари незабравим спомен сега
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmotionalBenefitSection;
