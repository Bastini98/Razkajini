import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  showThumbnails?: boolean;
}

function useLockBodyScroll(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {a
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex,
  onClose,
  showThumbnails = true,
}) => {
  const [index, setIndex] = React.useState(initialIndex);
  const [rootEl, setRootEl] = React.useState<HTMLElement | null>(null);

  useLockBodyScroll(true);

  React.useEffect(() => {
    let el = document.getElementById("lightbox-root") as HTMLElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = "lightbox-root";
      document.body.appendChild(el);
    }
    setRootEl(el);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  const startX = React.useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.changedTouches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = startX.current;
    if (s == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? s) - s;
    if (Math.abs(dx) > 50) {
      setIndex(dx < 0 ? (index + 1) % images.length : (index - 1 + images.length) % images.length);
    }
  };

  if (!rootEl) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0"
        style={{ zIndex: 2147483647 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

        <div className="absolute inset-0 z-10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white inline-flex items-center gap-2 z-30"
              aria-label="Затвори"
            >
              <X className="w-6 h-6" /> Затвори
            </button>
            <div className="text-white/70 text-sm z-30">
              {index + 1} / {images.length}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 relative">
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={`Изображение ${index + 1}`}
              className="max-w-[92vw] max-h-[80vh] object-contain rounded-xl shadow-2xl select-none"
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              draggable={false}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-20"
                  aria-label="Предишна снимка"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={() => setIndex((i) => (i + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-20"
                  aria-label="Следваща снимка"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {showThumbnails && images.length > 1 && (
            <div className="pb-6 px-4">
              <div className="max-w-[92vw] mx-auto overflow-x-auto flex gap-2 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      i === index
                        ? "border-white ring-2 ring-white/50"
                        : "border-white/40 hover:border-white/70"
                    }`}
                    aria-label={`Към снимка ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    rootEl
  );
};

export default Lightbox;
