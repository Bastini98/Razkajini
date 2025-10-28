import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabaseClient";

const BooksPage: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("category", ["book", "bundle"])
        .order("created_at", { ascending: false });

      if (error) {
        setError("Не успяхме да заредим продуктите.");
      } else {
        setItems(data || []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-paper-texture">
      <section className="bg-gradient-to-br from-sand-light to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl lg:text-7xl font-pudelinka font-bold text-ink">
              Книги за спомени
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Избери перфектната книга, или вземи комплекта за баба и дядо на специална цена
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
                >
                  <Link to={`/books/${product.slug}`}>
                    <ProductCard
                      product={{
                        ...product,
                        slug: product.slug,
                        titleBg: product.title_bg,
                        shortDescriptionBg: product.short_description_bg,
                        descriptionHtmlBg: product.description_html_bg,
                        onSale: product.on_sale,
                        compareAtPrice: product.compare_at_price
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20"
          >
            <h2 className="text-3xl font-pudelinka font-bold text-ink mb-8 text-center">
              За кого са книгите?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-pudelinka font-bold text-teал">Разкажи ни, бабо</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Специално за бабите и техните истории</li>
                  <li>✓ Въпроси за домакинството и семейния живот</li>
                  <li>✓ Места за семейни рецепти и традиции</li>
                  <li>✓ Романтични спомени и житейски мъдрости</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-пudelinka font-bold text-teал">Разкажи ни, дядо</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Фокус върху приключенията и работата</li>
                  <li>✓ Въпроси за войничество и мъжественост</li>
                  <li>✓ Истории за първата работа и кариерата</li>
                  <li>✓ Съвети за живота и отговорностите</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BooksPage;
