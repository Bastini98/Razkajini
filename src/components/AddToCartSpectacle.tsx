// src/components/AddToCartSpectacle.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Heart, Share2, CheckCircle,
  Truck, RotateCcw, Award, Star
} from "lucide-react";
import { useCart } from "../context/CartContext";

type MiniTestimonialData = {
  stars?: number;
  quote?: string;
  author?: string;
  label?: string;
};

type ProductLike = {
  id: string;
  titleBg: string;
  price: number;
  image?: string;
  slug: string;
  compareAtPrice?: number | null;
  mini_testimonial?: MiniTestimonialData | null;
};

interface AddToCartSpectacleProps {
  product: ProductLike;
  className?: string;
  /** По дизайн всички CTA трябва да са "Поръчай" или "Купи" */
  ctaText?: "Поръчай" | "Купи";
}

const EUR_RATE = 1.95583;
const formatBGN = (v: number) => `${v.toFixed(2)} лв.`;
const formatEUR = (v: number) => `${(v / EUR_RATE).toFixed(2)} €`;

const AddToCartSpectacle: React.FC<AddToCartSpectacleProps> = ({
  product,
  className,
  ctaText = "Поръчай",
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // добавяме винаги 1 брой
    addItem({
      id: product.id,
      titleBg: product.titleBg,
      price: product.price,
      image: product.image,
      slug: product.slug,
    });
  };

  const hasCompare =
    typeof product.compareAtPrice === "number" &&
    (product.compareAtPrice as number) > product.price;
  const savingsBGN = hasCompare ? (product.compareAtPrice as number) - product.price : 0;

  const mini = product.mini_testimonial || null;
  const miniStars = Math.max(0, Math.min(5, Math.round(mini?.stars ?? 5)));
  const miniQuote = mini?.quote ? mini.quote.replace(/^["“]|["”]$/g, "") : "";

  return (
    <div className={`bg-white rounded-2xl border border-sand/30 p-6 shadow-lg space-y-6 ${className || ""}`}>
      {/* Цена */}
      <div className="space-y-2">
        <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
          <span className="text-3xl md:text-4xl font-colus font-bold text-ink">{formatBGN(product.price)}</span>
          <span className="text-base md:text-lg font-colus text-teal/80">({formatEUR(product.price)})</span>
          {hasCompare && (
            <>
              <span className="text-lg md:text-xl font-colus text-gray-500 line-through">
                {formatBGN(product.compareAtPrice as number)}
              </span>
              <span className="text-sm md:text-base font-colus text-gray-500 line-through">
                ({formatEUR(product.compareAtPrice as number)})
              </span>
            </>
          )}
        </div>
        {hasCompare && (
          <div className="text-green-600 font-colus font-semibold">
            Спестяваш {formatBGN(savingsBGN)} ({formatEUR(savingsBGN)})
          </div>
        )}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToCart}
        className="w-full bg-teal hover:bg-teal-dark text-white font-colus font-semibold text-lg md:text-xl py-5 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-3"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>{ctaText}</span>
      </motion.button>

      {/* ▶️ Точно под CTA: Дигитална доставка */}
      <div className="bg-sand-light/30 rounded-xl p-4">
        <p className="text-sm text-gray-700">
          <CheckCircle className="inline h-4 w-4 mr-1 text-teal" />
          <strong>Дигитална доставка:</strong> след поръчка ще получите имейл с линк за изтегляне на спектакъла.
        </p>
      </div>

      {/* Mini testimonial (без снимка) */}
      {mini && (
        <div className="bg-gradient-to-br from-sand-light/30 to-white rounded-2xl p-6 border border-sand/20">
          <div className="flex items-center space-x-1 mb-3 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < miniStars ? "fill-yellow-400" : ""}`} />
            ))}
          </div>
          {miniQuote && <blockquote className="text-gray-700 italic mb-3">“{miniQuote}”</blockquote>}
          <div className="text-sm">
            <div className="font-semibold text-ink">{mini.author || "Анонимен"}</div>
            <div className="text-xs text-gray-500">{mini.label || "Клиент"}</div>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 text-center">✓ Сигурно плащане • ✓ Бърза доставка</p>

      {/* Полезни политики */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-xl border border-sand/20">
          <Truck className="h-6 w-6 text-teal mx-auto mb-2" />
          <p className="text-xs text-gray-600">Бърза доставка</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border border-sand/20">
          <RotateCcw className="h-6 w-6 text-teal mx-auto mb-2" />
          <p className="text-xs text-gray-600">14 дни връщане</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border border-sand/20">
          <Award className="h-6 w-6 text-teal mx-auto mb-2" />
          <p className="text-xs text-gray-600">Гарантирано качество</p>
        </div>
      </div>

      {/* Действия */}
      <div className="flex space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-sand rounded-xl hover:bg-sand/10 transition-colors font-colus">
          <Heart className="h-4 w-4" />
          <span className="text-sm">Запази</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-sand rounded-xl hover:bg-sand/10 transition-colors font-colus">
          <Share2 className="h-4 w-4" />
          <span className="text-sm">Сподели</span>
        </button>
      </div>
    </div>
  );
};

export default AddToCartSpectacle;
