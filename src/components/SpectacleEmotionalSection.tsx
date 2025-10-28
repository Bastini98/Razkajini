// src/components/SpectacleEmotionalSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";

interface SpectacleEmotionalSectionProps {
  title?: string;
  contentHtml?: string; // безопасно идва от бекенда
  ctaLabel?: "Поръчай" | "Купи" | "Поръчай сега" | "Купи сега";
  onCtaClick?: () => void;
}

const SECTION_BG = "https://i.ibb.co/3yvr1Hbt/wallpaper.webp";

const SpectacleEmotionalSection: React.FC<SpectacleEmotionalSectionProps> = ({
  title = "Емоционалното пътешествие на спектакъла",
  contentHtml = "<p>Сцени, които учат на доброта и смелост, музика която обединява, герои, които дават пример. Един спектакъл, който оставя следа в сърцата.</p>",
  ctaLabel = "Поръчай сега",
  onCtaClick,
}) => {
  return (
    <section
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold text-ink">
              {title}
            </h2>
          </div>
        </motion.div>

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/85 backdrop-blur-[2px] rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/40"
        >
          <div
            className={[
              "prose prose-lg max-w-none text-center",
              "prose-headings:font-pudelinka prose-headings:font-bold prose-headings:text-ink",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* strip + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 rounded-2xl p-6 border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50"
          >
            <div className="text-center">
              <h3 className="text-xl font-pudelinka font-bold text-amber-800 mb-2">
                Всеки ден е нова сцена
              </h3>
              <p className="text-amber-700 leading-relaxed">
                Не изпускайте момента, в който децата откриват магията на театъра.
              </p>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCtaClick}
                  className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus font-semibold px-7 py-3 rounded-xl transition-colors duration-200 shadow-lg"
                >
                  {ctaLabel}
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

export default SpectacleEmotionalSection;
 