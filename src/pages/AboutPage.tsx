import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const team = [
    {
      name: 'Мария Петрова',
      role: 'Основател и автор',
      image:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Журналист и майка, която разбра колко ценни са семейните истории.',
    },
    {
      name: 'Иван Димитров',
      role: 'Дизайнер на книги',
      image:
        'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Графичен дизайнер с 15 години опит в издателската индустрия.',
    },
    {
      name: 'Елена Стоянова',
      role: 'Семеен психолог',
      image:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Помага при създаването на въпросите, които отварят сърцата.',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Обич към семейството',
      description:
        'Вярваме, че семейните връзки са основата на щастливия живот.',
    },
    {
      icon: BookOpen,
      title: 'Сила на историите',
      description:
        'Всяка история има стойност и заслужава да бъде разказана.',
    },
    {
      icon: Users,
      title: 'Свързване на поколенията',
      description:
        'Мостът между дядовци, родители и деца е най-ценното.',
    },
    {
      icon: Target,
      title: 'Качество и грижа',
      description:
        'Всеки продукт създаваме с любов и внимание към детайла.',
    },
  ];

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sand-light to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-5xl lg:text-7xl font-pudelinka font-bold text-ink">
              За нас
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Ние сме екип от хора, които вярват в силата на семейните истории
              и искат да помогнат на българските семейства да ги запазят завинаги.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 shadow-lg border border-sand/20"
          >
            <h2 className="text-3xl font-pudelinka font-bold text-ink mb-8 text-center">
              Нашата история
            </h2>

            <div className="prose prose-lg prose-gray max-w-none space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Всичко започна с една проста болка. Мария загуби баба си, без да е
                записала историите, които толкова обичаше да слуша като дете.
                Разбра, че хиляди семейства преживяват същото — губят безценни спомени,
                защото никой не ги е попитал навреме.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                Така се роди идеята за „Разкажи ни!" — книги, които правят записването
                на спомени лесно, забавно и емоционално. Не просто празни страници,
                а грижливо подбрани въпроси, които отключват най-ценните истории.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                Днес сме помогнали на стотици български семейства да създадат свои
                книги от спомени. И всеки път, когато получаваме снимка на дядо,
                който плаче от радост, четейки въпросите, знаем, че правим нещо важно.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-sand-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold text-ink mb-6">
              Нашите ценности
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Принципите, които ни водят във всичко, което правим
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-teal rounded-2xl flex items-center justify-center mx-auto">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-pudelinka font-bold text-ink">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold text-ink mb-6">
              Нашият екип
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Запознай се с хората, които правят магията възможна
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center space-y-4"
              >
                <img
                  src={member.image}
                  alt={`Снимка на ${member.name}`}
                  className="w-48 h-48 mx-auto rounded-full object-cover shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-pudelinka font-bold text-ink">
                    {member.name}
                  </h3>
                  <p className="text-teal font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-teal to-teal-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 text-white"
          >
            <h2 className="text-4xl lg:text-5xl font-pudelinka font-bold">
              Готови ли сте да запишете вашите истории?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Започнете днес и създайте най-ценния подарък за вашето семейство.
            </p>

            {/* 👉 CTA да води към /books */}
            <Link to="/books" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-teal font-pudelinka font-bold px-12 py-4 rounded-2xl text-lg hover:bg-sand-light transition-colors"
              >
                Изберете книга
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
