import React from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Минимален интерфейс – не зависи от lib/data
export interface ProductCardData {
  id: string;
  slug: string;
  titleBg: string;
  shortDescriptionBg?: string | null;
  price: number;
  compareAtPrice?: number | null;
  rating?: number;
  images?: string[];
  badges?: string[];
  onSale?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  showQuickAdd?: boolean;
  /** До кой URL да води картата. Ако липсва – /books/:slug */
  to?: string;
}

const formatBGN = (v: number) => `${v.toFixed(2)} лв.`;

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickAdd = true, to }) => {
  const { addItem } = useCart();

  const productUrl = to ?? `/books/${product.slug}`;
  const rating = typeof product.rating === "number" ? product.rating : 5;

  const handleQuickAdd = () => {
    addItem({
      id: product.id,
      titleBg: product.titleBg,
      price: product.price,
      image: product.images?.[0],
      slug: product.slug,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sand/20"
    >
      {product.onSale && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          -15%
        </div>
      )}

      {Array.isArray(product.badges) && product.badges.length > 0 && (
        <div className="absolute top-4 left-4 z-10 space-y-1">
          {product.badges.slice(0, 2).map((badge) => (
            <div key={badge} className="bg-teal text-white px-2 py-1 rounded-full text-xs font-medium">
              {badge}
            </div>
          ))}
        </div>
      )}

      {/* Цялата медия и заглавие водят към productUrl */}
      <Link to={productUrl} className="block relative overflow-hidden">
        <img
          src={product.images?.[0] || ""}
          alt={product.titleBg}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Link to={productUrl}>
            <h3 className="text-xl font-colus font-bold text-ink group-hover:text-teal transition-colors line-clamp-2">
              {product.titleBg}
            </h3>
          </Link>

          {product.shortDescriptionBg && (
            <p className="text-gray-600 text-sm line-clamp-2">{product.shortDescriptionBg}</p>
          )}

          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({rating})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <span className="text-2xl font-bold text-teал">{formatBGN(product.price)}</span>
            {typeof product.compareAtPrice === "number" && (
              <span className="text-lg text-gray-500 line-through">{formatBGN(product.compareAtPrice)}</span>
            )}
          </div>

          {typeof product.compareAtPrice === "number" && (
            <div className="text-sm text-green-600 font-semibold">
              Спестяваш {formatBGN(product.compareAtPrice - product.price)}
            </div>
          )}
        </div>

        {showQuickAdd && (
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleQuickAdd}
              className="w-full bg-teal hover:bg-teal-dark text-white font-sans font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Бърза поръчка</span>
            </motion.button>

            <p className="text-xs text-gray-600 text-center">Сигурно плащане • Бърза доставка</p>
          </div>
        )}
      </div> 
    </motion.div>
  );
};

export default ProductCard;
 