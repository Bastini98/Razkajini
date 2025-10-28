import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-teal/5 to-sand-light/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-full mb-6">
            <HelpCircle className="h-8 w-8 text-teal" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-colus font-bold text-ink mb-6">
            Често задавани въпроси
          </h2>
          <p className="text-xl text-gray-600">
            Отговори на най-важните въпроси за нашите книги
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-sand/20 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-sand-light/10 transition-colors"
              >
                <h3 className="text-lg font-sans font-semibold text-ink pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-teal" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-700 leading-relaxed font-sans">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-teal/5 rounded-2xl p-8 border border-teal/20">
            <h3 className="text-2xl font-colus font-bold text-ink mb-4">
              Все още имате въпроси?
            </h3>
            <p className="text-gray-700 mb-6">
              Свържете се с нас и ще ви помогнем да намерите перфектната книга за вашето семейство.
            </p>
            <button className="inline-flex items-center bg-teal hover:bg-teal-dark text-white font-sans font-semibold px-6 py-3 rounded-xl transition-colors">
              Свържете се с нас
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection; 