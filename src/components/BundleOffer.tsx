import React from "react";
import { motion } from "framer-motion";
import { Package, ArrowRight, Star } from "lucide-react";

type BundleProduct = {
  id: string;
  slug: string;
  title_bg: string;
  short_description_bg?: string | null;
  images?: string[] | null;
  price?: number | null;
  compare_at_price?: number | null;
  rating?: number | null;
};

interface BundleOfferProps {
  bundle?: BundleProduct | null;
  onAdd?: (bundle: BundleProduct) => void;
}

const RATE_BGN_PER_EUR = 1.95583;
const toEUR = (bgn?: number | null) =>
  typeof bgn === "number" ? (bgn / RATE_BGN_PER_EUR).toFixed(2) : null;

const BundleOffer: React.FC<BundleOfferProps> = ({ bundle, onAdd }) => {
  if (!bundle) return null;

  const firstImage =
    Array.isArray(bundle.images) && bundle.images.length > 0 ? bundle.images[0] : "";

  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl border border-sand/20 p-6 md:p-8"
        >
          {/* Image */}
          <div className="overflow-hidden rounded-2xl relative">
            {firstImage && (
              <img
                src={firstImage}
                alt={bundle.title_bg}
                className="w-full h-72 object-cover rounded-2xl"
                loading="lazy"
              />
            )}
            <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              Комплект
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(bundle.rating || 5)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-gray-500 ml-2 text-sm">
                ({bundle.rating?.toFixed(1) || "5.0"})
              </span>
            </div>

            <h3 className="text-3xl font-colus font-bold text-ink mb-2">
              {bundle.title_bg}
            </h3>

            {!!bundle.short_description_bg && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {bundle.short_description_bg}
              </p>
            )}

            <div className="flex items-center gap-3 mb-6">
              {typeof bundle.price === "number" && (
                <div className="text-2xl font-colus font-bold text-ink">
                  {bundle.price.toFixed(2)} лв.
                  <span className="ml-2 text-gray-500 text-base">
                    ({toEUR(bundle.price)} €)
                  </span>
                </div>
              )}
              {typeof bundle.compare_at_price === "number" && (
                <div className="text-gray-400 line-through text-lg">
                  {bundle.compare_at_price.toFixed(2)} лв.
                </div>
              )}
            </div>

            {/* CTA – винаги видим */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAdd?.(bundle)}
              aria-label="Добави комплекта в количката"
              className="inline-flex items-center justify-center bg-teal hover:bg-teal-dark text-white font-colus font-semibold px-6 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
            >
              Добави комплекта в количката
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BundleOffer;
