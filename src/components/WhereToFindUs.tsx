import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Store, ArrowRight } from 'lucide-react';

export interface Bookstore {
  name: string;
  location: string;
}

interface WhereToFindUsProps {
  bookstores: Bookstore[];
  onCtaClick?: () => void; // по избор: добавя текущия продукт в количката
}

const WhereToFindUs: React.FC<WhereToFindUsProps> = ({ bookstores, onCtaClick }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-teal/5 to-sand-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-colus font-bold text-ink mb-6">
            Къде да ни намериш?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Нашите книги можете да намерите в най-добрите книжарници в цялата страна
          </p>
        </motion.div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookstores.map((bookstore, index) => (
            <motion.div
              key={`${bookstore.name}-${index}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sand/20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
                  <Store className="h-6 w-6 text-teal" />
                </div>
                <h3 className="font-colus font-bold text-ink text-lg">
                  {bookstore.name}
                </h3>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{bookstore.location}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-sand/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-colus font-bold text-ink mb-4">
              Доверие и качество
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Работим с най-уважаваните книжарници в България, за да гарантираме, че нашите книги
              достигат до вас в перфектно състояние. Всяка книга е внимателно опакована и проверена за качество.
            </p>

            <div className="text-center mt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCtaClick}
                aria-label="Добави текущия продукт в количката"
                className="inline-flex items-center bg-teal hover:bg-teal-dark text-white font-colus font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
              >
                Поръчай с доверие
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhereToFindUs;
