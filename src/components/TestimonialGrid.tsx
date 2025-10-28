import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronDown } from 'lucide-react';

interface Testimonial {
  id: string;
  text: string;
  author: string;
  avatar: string;
}

interface TestimonialGridProps {
  testimonials: Testimonial[];
}

const TestimonialGrid: React.FC<TestimonialGridProps> = ({ testimonials }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-colus font-bold text-ink mb-6">
            Какво казват нашите клиенти?
          </h2>
          <p className="text-xl text-gray-600">
            Над 3000 семейства вече записаха своите най-ценни спомени
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-sand-light/20 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sand/20"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial text */}
              <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-sand"
                />
                <div>
                  <cite className="font-colus text-ink not-italic">
                    {testimonial.author}
                  </cite>
                  <p className="text-sm text-gray-600">Доволен клиент</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more button */}
        {!showAll && testimonials.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center bg-teal hover:bg-teal-dark text-white font-colus px-8 py-4 rounded-2xl text-lg transition-colors duration-200 shadow-lg"
            >
              Виж още отзиви
              <ChevronDown className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        )}

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-colus text-teal mb-2">3000+</div>
            <p className="text-gray-600">Щастливи семейства</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-colus text-teal mb-2">4.9/5</div>
            <p className="text-gray-600">Средна оценка</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-colus text-teal mb-2">98%</div>
            <p className="text-gray-600">Препоръчват на приятели</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialGrid; 