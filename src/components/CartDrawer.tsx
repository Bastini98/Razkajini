// src/components/CartDrawer.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer: React.FC = () => {
  const { state, closeCart, removeItem, updateQuantity } = useCart();

  // Безопасен геттер за снимка (image или images[0])
  const getItemImage = (item: any): string => {
    if (item?.image) return item.image;
    if (Array.isArray(item?.images) && item.images[0]) return item.images[0];
    return '';
  };

  // Гард за количество (минимум 1)
  const setQty = (id: string, next: number) => {
    const safe = Math.max(1, Number.isFinite(next) ? Math.floor(next) : 1);
    updateQuantity(id, safe);
  };

  // Тотал – ако по някаква причина state.total липсва, реизчисляваме
  const computedTotal =
    typeof state?.total === 'number'
      ? state.total
      : (state?.items ?? []).reduce(
          (sum: number, it: any) => sum + (Number(it?.price) || 0) * (Number(it?.quantity) || 0),
          0
        );

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Количка"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sand/20">
              <h2 className="text-2xl font-colus font-bold text-ink">Количка</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-sand/10 rounded-lg transition-colors"
                aria-label="Затвори количката"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {(state.items?.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-sand/20 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📚
                    </motion.div>
                  </div>
                  <h3 className="font-colus text-xl text-ink mb-2">Празна количка</h3>
                  <p className="text-gray-600 text-sm">Добавете продукти, за да продължите</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {state.items.map((item: any) => {
                    const img = getItemImage(item);
                    const qty = Number(item?.quantity) || 1;
                    const canDecrement = qty > 1;

                    return (
                      <motion.div
                        key={`${item.id}-${item.slug ?? ''}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex items-center space-x-4 p-4 bg-sand-light/20 rounded-xl"
                      >
                        <img
                          src={img}
                          alt={item?.titleBg ?? 'Продукт'}
                          className="w-16 h-16 object-cover rounded-lg"
                          loading="lazy"
                        />

                        <div className="flex-1 min-w-0">
                          {/* Заглавие */}
                          <h4 className="font-colus font-semibold text-ink text-lg sm:text-xl leading-snug truncate">
                            {item?.titleBg ?? 'Продукт'}
                          </h4>
                          <p className="text-teal font-semibold mt-0.5">
                            {(Number(item?.price) || 0).toFixed(2)} лв.
                          </p>

                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => canDecrement && setQty(item.id, qty - 1)}
                              className={`p-1.5 rounded transition ${
                                canDecrement
                                  ? 'hover:bg-white'
                                  : 'opacity-50 cursor-not-allowed'
                              }`}
                              aria-label="Намали количеството"
                              disabled={!canDecrement}
                              type="button"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="w-9 text-center text-sm font-medium select-none">
                              {qty}
                            </span>

                            <button
                              onClick={() => setQty(item.id, qty + 1)}
                              className="p-1.5 hover:bg-white rounded"
                              aria-label="Увеличи количеството"
                              type="button"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Премахни от количката"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}

                  {/* Promo Code */}
                  <div className="border-t border-sand/20 pt-4">
                    <input
                      type="text"
                      placeholder="Код за отстъпка"
                      className="w-full px-4 py-3 border border-sand/30 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {(state.items?.length ?? 0) > 0 && (
              <div className="border-t border-sand/20 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Общо:</span>
                  <span className="text-teal">{computedTotal.toFixed(2)} лв.</span>
                </div>

                {/* Главен CTA */}
                <button
                  className="w-full bg-teal hover:bg-teal-dark text-white font-colus font-semibold text-xl py-5 px-6 rounded-2xl transition-colors duration-200"
                  type="button"
                >
                  Поръчай сега
                </button>

                <p className="text-xs text-gray-600 text-center">
                  Сигурно плащане • Бърза доставка
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
