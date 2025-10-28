import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface Props {
  data: {
    title: string;
    content: string; // HTML
  };
}

const SECTION_BG = 'https://i.ibb.co/3yvr1Hbt/wallpaper.webp';

const EmotionalBenefitSectionAudio: React.FC<Props> = ({ data }) => {
  return (
    <section
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </motion.div>
      </div>
    </section>
  );
};

export default EmotionalBenefitSectionAudio;
