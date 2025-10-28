import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../lib/data';

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-sand-light/30 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Заглавието остава с текущия шрифт */}
          <h2 className="text-4xl lg:text-5xl font-pudelinka font-regular text-ink mb-4">
            Какво казват семействата?
          </h2>
          <p className="text-xl text-gray-600">
            Истории от хора, които вече откриха магията на записаните спомени.
          </p>
        </motion.div>

        <div className="relative">
          {/* Main testimonial */}
          <div className="relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-center space-y-8 font-colus"  // ⬅️ Colus само за самите тестемониали
              >
                <div className="relative">
                  <Quote className="h-12 w-12 text-teal/20 mx-auto mb-6" />
                  <blockquote className="text-2xl lg:text-3xl text-ink leading-relaxed max-w-3xl mx-auto">
                    "{testimonials[currentIndex].text}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].author}
                    className="w-16 h-16 rounded-full object-cover border-4 border-sand"
                  />
                  <div className="text-left">
                    <cite className="text-lg font-semibold text-teal not-italic">
                      {testimonials[currentIndex].author}
                    </cite>
                    <p className="text-gray-600">Доволен клиент</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-sand-light rounded-full shadow-lg transition-colors"
            aria-label="Предишен отзив"
          >
            <ChevronLeft className="h-6 w-6 text-teal" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-sand-light rounded-full shadow-lg transition-colors"
            aria-label="Следващ отзив"
          >
            <ChevronRight className="h-6 w-6 text-teал" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-teal' : 'bg-gray-300'
                }`}
                aria-label={`Отзив ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
