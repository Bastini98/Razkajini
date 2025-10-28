import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface WhyBuySectionProps {
  data: {
    image: string;
    title: string;
    content: string; // HTML
  };
  onCtaClick?: () => void; // 👈 при клик добавяме текущия продукт в количката
}

const SECTION_BG = 'https://i.ibb.co/3yvr1Hbt/wallpaper.webp';

const WhyBuySection: React.FC<WhyBuySectionProps> = ({ data, onCtaClick }) => {
  return (
    <section
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      {/* лек тъмен градиент по ръбовете за контраст */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/15 to-transparent" />
          </motion.div>

          {/* Content card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 bg-white/85 backdrop-blur-[2px] rounded-3xl shadow-xl border border-white/40 p-6 sm:p-8"
          >
            <h2 className="text-4xl lg:text-5xl font-colus font-bold text-ink">
              {data.title}
            </h2>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCtaClick}
              className="inline-flex items-center bg-teal hover:bg-teal-dark text-white font-colus font-semibold px-8 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
              aria-label="Добави текущия продукт в количката"
            >
              Поръчай сега
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyBuySection;
