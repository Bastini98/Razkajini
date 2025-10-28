// src/components/SpectacleFAQ.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type SpectacleQA = { q: string; a: string };

type Props = {
  items?: SpectacleQA[];
  title?: string;
  className?: string;
  initiallyOpen?: number[]; // индекси, които да са отворени по подразбиране
};

const SpectacleFAQ: React.FC<Props> = ({
  items = [],
  title = "Често задавани въпроси",
  className = "",
  initiallyOpen = [],
}) => {
  const [open, setOpen] = React.useState<Record<number, boolean>>(() => {
    const acc: Record<number, boolean> = {};
    initiallyOpen.forEach((i) => (acc[i] = true));
    return acc;
  });

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl md:text-3xl font-pudelinka font-bold text-ink text-center mb-6">
          {title}
        </h3>

        <div className="space-y-3">
          {items.map((f, i) => {
            const isOpen = !!open[i];
            return (
              <div key={i} className="rounded-2xl border border-sand/30 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen((s) => ({ ...s, [i]: !isOpen }))}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-ink">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-4 text-gray-700"
                    >
                      <p className="leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpectacleFAQ;
 