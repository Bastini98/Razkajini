import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookHeart } from 'lucide-react';

const EmotionBlocks: React.FC = () => {
  const cards = [
    {
      icon: Heart,
      title: 'Носталгия с усмивка',
      description: 'Въпросите пробуждат спомени, които дълго време са били скрити в сърцето.',
      gradient: 'from-pink-100 to-rose-50',
      iconColor: 'text-pink-600',
    },
    {
      icon: Users,
      title: 'Време заедно, далеч от екрани',
      description: 'Истински разговори, които свързват поколенията по начин, какъвто не може нито един екран.',
      gradient: 'from-teal/20 to-teal/5',
      iconColor: 'text-teal',
    },
    {
      icon: BookHeart,
      title: 'Истории, които се предават',
      description: 'Записаните спомени стават наследство, което децата и внуците ще съхраняват завинаги.',
      gradient: 'from-sand-light to-sand/20',
      iconColor: 'text-ink',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold text-ink mb-6">
            Защо тези книги са специални?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Повече от книга — те са мост между поколенията, съхраняващ най-ценните истории.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${card.gradient} border border-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="space-y-4">
                <div className={`inline-flex p-4 rounded-2xl bg-white/80 ${card.iconColor}`}>
                  <card.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-pudelinka font-bold text-ink">
                  {card.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full opacity-30" />
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/20 rounded-full opacity-40" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmotionBlocks;