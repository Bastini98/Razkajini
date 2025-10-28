// src/components/SpectacleCertificates.tsx
import React from "react";
import { motion } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";
import Lightbox from "./Lightbox";

type Props = {
  certificates?: string[];              // масив от URL-и
  title?: string;
  subtitle?: string;
  ctaLabel?: "Поръчай сега" | "Купи сега" | "Поръчай" | "Купи";
  onCtaClick?: () => void;
  className?: string;
};


const SpectacleCertificates: React.FC<Props> = ({
  certificates = [],
  title = "Сертификати и признания",
  subtitle = "Отличията потвърждават професионалното изпълнение и образователната стойност на спектакъла.",
  ctaLabel = "Поръчай сега",
  onCtaClick,
  className = "",
}) => {
  const list = Array.isArray(certificates) ? certificates.filter(Boolean) : [];
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  if (list.length === 0) return null;

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl md:text-3xl font-pudelinka font-bold text-ink mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            {subtitle}
          </p>
        )}

        {/* Центрирана редица (flex) */}
        <div className="flex flex-wrap justify-center gap-6">
          {list.map((src, i) => (
            <motion.button
              key={src + i}
              type="button"
              onClick={() => {
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-[260px] h-[180px] rounded-2xl overflow-hidden border border-sand/30 bg-white p-3 shadow-sm hover:shadow-md transition cursor-zoom-in"
              title="Преглед на цял екран"
            >
              <img
                src={src}
                alt={`certificate-${i + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>

        {/* Ред с иконка/описание */}
        <div className="flex items-center justify-center gap-2 text-teal mt-5">
          <Award className="w-5 h-5" />
          <span className="text-sm">Участия и номинации в детски и куклено-театрални форуми.</span>
        </div>

        {/* CTA под сертификатите */}
        <div className="mt-8">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCtaClick}
            className="inline-flex items-center bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus font-semibold px-8 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
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

export default SpectacleCertificates;
 