import React from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";

interface EmotionalBenefitSectionProps {
  data: {
    title: string;
    content: string; // HTML от БД
  };
  onCtaClick?: () => void; // 👈 добавя текущия продукт в количката
}

const SECTION_BG = "https://i.ibb.co/3yvr1Hbt/wallpaper.webp";

const EmotionalBenefitSectionDolls: React.FC<EmotionalBenefitSectionProps> = ({ data, onCtaClick }) => {
  if (!data?.title && !data?.content) return null;

  return (
    <section
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      {/* лек градиент за контраст */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header – бял заоблен фон */}
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
            {data?.title && (
              <h2 className="text-4xl lg:text-5xl font-colus font-bold text-ink">
                {data.title}
              </h2>
            )}
          </div>
        </motion.div>

        {/* White card с HTML контента от БД + куклен urgency strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/85 backdrop-blur-[2px] rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/40"
        >
          {data?.content && (
            <div
              className={[
                "prose prose-lg max-w-none text-center",
                "prose-headings:font-colus prose-headings:font-bold prose-headings:text-ink",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          )}

          {/* Куклен urgency strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 rounded-2xl p-6 border border-teal/20 bg-gradient-to-r from-teal/5 to-emerald-50"
          >
            <div className="text-center">
              <h3 className="text-xl font-colus font-bold text-ink mb-2">
                Малките ритуали правят големи спомени
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Една любима кукла носи спокойствие преди сън, сигурност през деня и усмивки навсякъде.
                Избери приятелче, което да остане в спомените.
              </p>

              <div className="mt-6">
                {onCtaClick ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCtaClick}
                    className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus font-semibold px-7 py-3 rounded-xl transition-colors duration-200 shadow-lg"
                  >
                    Избери любим приятел
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.button>
                ) : (
                  <motion.a
                    href="#add-to-cart"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus font-semibold px-7 py-3 rounded-xl transition-colors duration-200 shadow-lg"
                  >
                    Избери любим приятел
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmotionalBenefitSectionDolls;
