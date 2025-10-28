import React from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";

interface WarmthSectionPillowProps {
  images: string[];
  onCtaClick?: () => void; // 👈 по избор: добавя текущия продукт
}

const SECTION_BG = "https://i.ibb.co/3yvr1Hbt/wallpaper.webp";

const WarmthSectionPillow: React.FC<WarmthSectionPillowProps> = ({ images, onCtaClick }) => {
  return (
    <section
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="mx-auto max-w-3xl bg-white/85 backdrop-blur-[2px] rounded-3xl shadow-2xl border border-white/40 px-8 sm:px-10 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-colus font-bold text-ink mb-4">
              Повече близост, по-малко умора
            </h2>
            <p className="text-lg text-gray-700">
              Възглавницата за кърмене пази гърба на мама, държи бебето в точната височина
              и превръща всяко кърмене в спокоен, уютен ритуал.
            </p>
          </div>
        </motion.div>

        {/* Creative grid from DB images */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-[500px] mb-12">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`
                relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300
                ${index === 0 ? "col-span-2 row-span-2" : ""}
                ${index === 1 ? "lg:col-span-1 lg:row-span-1" : ""}
                ${index === 2 ? "lg:col-span-1 lg:row-span-1" : ""}
                ${index === 3 ? "col-span-2 lg:col-span-2 lg:row-span-1" : ""}
              `}
            >
              <img
                src={image}
                alt={`Възглавница за кърмене — момент ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Emotional content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/85 backdrop-blur-[2px] rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/40 text-center"
        >
          <p className="font-colus text-2xl text-gray-800 mb-6 leading-relaxed">
            Когато позата е правилна, бебето суче спокойно, а тялото на мама си почива.
            Повече нежност, по-малко болка — точно така трябва да изглеждат първите месеци.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            Мекият, хипоалергенен пълнеж поддържа стабилност и форма, а памучната материя е
            нежна към кожата. Идеална за нощни кърмения и за дългите гушкания през деня.
          </p>

          {onCtaClick ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCtaClick}
              className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus px-8 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
            >
              Поръчай комфорт сега
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          ) : (
            <motion.a
              href="#add-to-cart"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus px-8 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
            >
              Поръчай комфорт сега
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default WarmthSectionPillow;
 