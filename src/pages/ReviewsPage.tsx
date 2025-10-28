import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { testimonials } from '../lib/data';

const ReviewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light/30 to-white">
      {/* Hero Section — с dotted teal фон */}
      <section className="relative py-24 text-center overflow-hidden">
        {/* dotted background */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.15) 1.2px, transparent 1.2px)',
            backgroundSize: '18px 18px',
            backgroundColor: '#0f766e',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-white"
        >
          <h1 className="text-5xl lg:text-7xl font-pudelinka font-bold mb-6">
            Историите, които ни трогнаха
          </h1>
          <p className="text-xl text-white/90 leading-relaxed mb-10">
            Всеки отзив е истинска история, споделена от семейства, които вече
            преживяха магията на <span className="text-white font-semibold">„Разкажи ни!“</span>.
            Те не просто купиха книга — те запазиха част от душата си за следващите поколения.
          </p>
        </motion.div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-sand/30 shadow-lg rounded-3xl p-8 text-center flex flex-col items-center justify-between hover:shadow-2xl hover:border-teal/50 transition-all"
              >
                <Quote className="h-10 w-10 text-teal/30 mb-4" />
                <p className="text-lg text-gray-700 leading-relaxed mb-6 font-colus">
                  “{t.text}”
                </p>
                <div className="flex flex-col items-center">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-16 h-16 rounded-full border-4 border-sand mb-3 object-cover"
                  />
                  <h4 className="text-xl font-semibold text-ink font-pudelinka">{t.author}</h4>
                  <p className="text-gray-500 text-sm">Доволен клиент</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section — същия dotted teal фон */}
      <section className="relative py-24 text-center overflow-hidden">
        {/* dotted background */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.15) 1.2px, transparent 1.2px)',
            backgroundSize: '18px 18px',
            backgroundColor: '#0f766e',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto space-y-8 px-6 text-white"
        >
          <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold">
            Всяко семейство има своята история. <br /> Вашата готова ли е да бъде записана?
          </h2>
          <p className="text-xl text-white/90">
            Започнете сега и подарете най-ценния подарък — спомените, които остават.
          </p>

          {/* CTA button */}
          <a
            href="/books"
            aria-label="Избери своята книга"
            className="inline-block bg-white text-teal font-colus font-semibold px-10 py-4 rounded-2xl text-lg shadow-md transition-all duration-200 hover:bg-teal hover:text-white"
          >
            Избери своята книга
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default ReviewsPage;
