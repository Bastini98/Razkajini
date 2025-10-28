// src/components/ProductGallery.tsx
import React from 'react';
import { motion } from 'framer-motion'; // само за лек вход в грида; може да се махне
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

/* ---------------- Fullscreen viewer (портал) ---------------- */
function FullscreenViewer({
  images,
  index,
  setIndex,
  onClose,
  title,
}: {
  images: string[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
  title: string;
}) {
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);

  // осигуряваме root за портала
  React.useEffect(() => {
    let el = document.getElementById('lightbox-root') as HTMLElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'lightbox-root';
      document.body.appendChild(el);
    }
    setRootEl(el);
  }, []);

  // заключваме скрола
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // клавиатура
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((index + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, images.length, onClose, setIndex]);

  // swipe на мобилно
  const startX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.changedTouches[0]?.clientX ?? null; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = startX.current; if (s == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? s) - s;
    if (Math.abs(dx) > 50) setIndex(dx < 0 ? (index + 1) % images.length : (index - 1 + images.length) % images.length);
  };

  if (!rootEl) return null;

  return createPortal(
    <div
      className="fixed inset-0"
      style={{ zIndex: 2147483647 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Слой 1: фон – КЛИК ТУК ЗАТВАРЯ */}
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />

      {/* Слой 2: съдържание (под контролите) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <img
          src={images[index]}
          alt={`${title} - страница ${index + 1}`}
          className="max-w-[100vw] max-h-[100vh] object-contain select-none rounded"
          draggable={false}
        />

        {/* Тъмбове */}
        <div className="absolute left-0 right-0 bottom-4 mx-auto max-w-[92vw] overflow-x-auto flex gap-2 justify-center px-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-14 h-14 rounded-md overflow-hidden border transition-colors ${
                i === index ? 'border-white' : 'border-white/40 hover:border-white/70'
              }`}
              aria-label={`Към страница ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Слой 3: контроли – ВИНАГИ НАД ВСИЧКО */}
      <button
        type="button"
        onClick={onClose}
        className="absolute z-20 top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
        aria-label="Затвори"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
        className="absolute z-20 left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
        aria-label="Предишна снимка"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>

      <button
        type="button"
        onClick={() => setIndex((index + 1) % images.length)}
        className="absolute z-20 right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
        aria-label="Следваща снимка"
      >
        <ChevronRight className="h-7 w-7" />
      </button>
    </div>,
    rootEl
  );
}

/* ---------------- Основна галерия ---------------- */
const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [viewerIndex, setViewerIndex] = React.useState<number | null>(null);

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold text-ink mb-6">
              Разгледайте някои страници от книгата
            </h2>
            <p className="text-xl text-gray-600">
              Всеки въпрос е грижливо създаден, за да отключи най-дълбоките и най-ценни спомени на баба
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-[600px]">
            {images.map((image, index) => (
              <motion.button
                type="button"
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setViewerIndex(index)}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none
                  ${index === 0 ? 'col-span-2 row-span-2' : ''}
                  ${index === 3 ? 'col-span-2 lg:col-span-2 lg:row-span-1' : ''}
                `}
              >
                <img
                  src={image}
                  alt={`${title} - страница ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
              </motion.button>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              type="button"
              className="inline-flex items-center bg-teal hover:bg-teal-dark text-white font-sans font-semibold px-8 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
            >
              Поръчай книгата сега
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {viewerIndex !== null && (
        <FullscreenViewer
          images={images}
          index={viewerIndex}
          setIndex={(i) => setViewerIndex(i)}
          onClose={() => setViewerIndex(null)}
          title={title}
        />
      )}
    </>
  );
};

export default ProductGallery;
 