// src/pages/DollsPage.tsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabaseClient";

const DollsPage: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("category", ["doll", "pillow", "pilow"])
        .order("created_at", { ascending: false });

      if (error) setError("Не успяхме да заредим куклите.");
      else setItems(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-paper-texture">
      <section className="bg-gradient-to-br from-sand-light to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
            <h1 className="text-5xl lg:text-7xl font-pudelinka font-bold text-ink">Ръчно изработени кукли</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Нежни приятели за гушкане и сън. Авторски лица, естествени материи и хипоалергенен пълнеж.
            </p>
          </motion.div>
        </div>
      </section>

<section className="py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {loading && <p className="text-center text-gray-600">Зареждане...</p>}
    {error && <p className="text-center text-red-500">{error}</p>}

    {!loading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {items.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/70 border border-sand/30 rounded-3xl p-2 backdrop-blur-sm shadow-sm hover:shadow-lg transition"
          >
            <ProductCard
              to={`/rachno-izraboteni-kukli/${product.slug}`}
              product={{
                id: product.id,
                slug: product.slug,
                titleBg: product.title_bg,
                shortDescriptionBg: product.short_description_bg,
                price: Number(product.price) || 0,
                compareAtPrice: product.compare_at_price ?? null,
                rating: Number(product.rating) || 5,
                images: Array.isArray(product.images) ? product.images : [],
                badges: Array.isArray(product.badges) ? product.badges : [],
                onSale: Boolean(product.on_sale),
              }}
            />
          </motion.div>
        ))}
      </div>
    )}
  </div>
</section>
    </div>
  );
};

export default DollsPage;
