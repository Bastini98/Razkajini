import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Sparkles, Camera, ArrowRight, Star, Baby, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import InteractiveImage from '../components/InteractiveImage';
import Lightbox from '../components/Lightbox';

const IMAGES = {
  heroWarm: 'https://olyipzxropjwphlwdjse.supabase.co/storage/v1/object/public/images/books/warm%20dqdo%204.webp',

  // inside pages – Baba
  baba1: 'https://i.ibb.co/4wbMmY3Y/baba1.png',
  baba4: 'https://i.ibb.co/nNKJb8FB/baba4.png',

  // inside pages – Dyado
  dqdo1: 'https://i.ibb.co/twxWgZZp/dqdo1.png',
  dqdo2: 'https://i.ibb.co/PvdK7SC0/dqdo2.png',

  // dolls
  dollsWarm: 'https://olyipzxropjwphlwdjse.supabase.co/storage/v1/object/public/images/images%20dolls/warm%20kukli1.webp',
  dollsWhy: 'https://olyipzxropjwphlwdjse.supabase.co/storage/v1/object/public/images/images%20dolls/why%20kukli11.webp',
};

const SectionTitle: React.FC<{ eyebrow?: string; title: string; sub?: string; white?: boolean }> = ({ eyebrow, title, sub, white }) => (
  <div className="text-center max-w-4xl mx-auto px-6">
    {eyebrow && <p className={`uppercase tracking-[0.2em] mb-3 text-sm ${white ? 'text-white/70' : 'text-teal'}`}>{eyebrow}</p>}
    <h2 className={`text-4xl lg:text-5xl font-pudelinka font-bold ${white ? 'text-white' : 'text-ink'}`}>{title}</h2>
    {sub && <p className={`mt-4 text-lg ${white ? 'text-white/90' : 'text-gray-700'}`}>{sub}</p>}
  </div>
);

const HowItWorksPage: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const heroFloatingImages = [IMAGES.baba1, IMAGES.dqdo1];
  const insideBooksImages = [IMAGES.baba1, IMAGES.baba4, IMAGES.dqdo1, IMAGES.dqdo2];
  const dollsImages = [IMAGES.dollsWarm, IMAGES.dollsWhy];

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* HERO — teal dotted background, floating images left/right */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1.2px, transparent 1.2px)',
            backgroundSize: '18px 18px',
            backgroundColor: '#0f766e', // teal-dark
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-white"
            >
              <p className="uppercase tracking-[0.25em] text-white/80 mb-3 text-sm">Как работи</p>
              <h1 className="text-5xl lg:text-7xl font-pudelinka font-bold leading-tight mb-6">
                Запишете живота им. <br /> За да остане завинаги.
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                Нашите книги водят баба и дядо през внимателно подбрани въпроси, които
                отключват спомени, смях и мълчаливи сълзи. Има място за снимки, писма и
                дребни съкровища. Резултатът е семейно издание, което ще чете всяко следващо поколение.
              </p>

              {/* Mid-page CTAs (1) */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center bg-white text-teal font-colus font-semibold px-7 py-3 rounded-2xl text-lg shadow-md transition hover:bg-teal hover:text-white"
                >
                  Виж книгите <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/rachno-izraboteni-kukli"
                  className="inline-flex items-center justify-center border border-white/40 text-white font-colus px-7 py-3 rounded-2xl text-lg transition hover:bg-white/10"
                >
                  Кукли за разказване
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={IMAGES.heroWarm}
                alt="Семейни спомени в книга"
                className="w-full rounded-3xl shadow-2xl border border-white/20"
              />
              {/* floating pictures */}
              <InteractiveImage
                src={IMAGES.baba1}
                alt="Вътрешна страница - баба"
                className="hidden md:block absolute -left-10 -bottom-8 w-40 rotate-[-6deg] rounded-2xl shadow-2xl border border-white/40 bg-white"
                onClick={() => openLightbox(heroFloatingImages, 0)}
              />
              <InteractiveImage
                src={IMAGES.dqdo1}
                alt="Вътрешна страница - дядо"
                className="hidden md:block absolute -right-10 -top-8 w-40 rotate-[6deg] rounded-2xl shadow-2xl border border-white/40 bg-white"
                onClick={() => openLightbox(heroFloatingImages, 1)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* STEPS — как работи в 4 ясни стъпки */}
      <section className="py-20">
        <SectionTitle
          eyebrow="Процес"
          title="Как работи — лесно и естествено"
          sub="Книгата води разговора. Вие само добавяте време, обич и малко любопитство."
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid md:grid-cols-2 gap-8">
          {/* Step 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 shadow-xl border border-sand/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h3 className="text-2xl font-pudelinka text-ink mb-2">1) Изберете изданието</h3>
                <p className="text-gray-700">„Бабо, разкажи ни!“ и „Дядо, разкажи ни!“ имат различни въпроси и тон.
                  Всяка книга е замислена да отключва най-важните истории за конкретната роля в семейството.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 shadow-xl border border-sand/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h3 className="text-2xl font-pudelinka text-ink mb-2">2) Започнете разговорите</h3>
                <p className="text-gray-700">Вътре има внимателно подбрани въпроси — от първите спомени и
                  детството, до любовта, работата и уроците от живота. Достатъчни са 15–20 минути на сесия.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 shadow-xl border border-sand/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <Camera className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h3 className="text-2xl font-pudelinka text-ink mb-2">3) Добавете снимки и спомени</h3>
                <p className="text-gray-700">Книгите имат специални места за фотографии, рисунки и писма. Малките
                  детайли превръщат страниците в семейно съкровище.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 shadow-xl border border-sand/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h3 className="text-2xl font-pudelinka text-ink mb-2">4) Историите остават завинаги</h3>
                <p className="text-gray-700">Готовата книга се предава нататък. Тя става мост между поколенията —
                  децата и внуците ще „чуват“ гласа им дори след години.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SIDE BY SIDE — вътре в книгите (галерия) + CTA (2) */}
      <section className="py-20 bg-sand-light/20 relative">
        <SectionTitle
          eyebrow="Вътре в книгите"
          title="Въпросите, които връщат времето назад"
          sub="Извадки от страниците — отделни за баба и за дядо. С място за писане, снимки и спомени."
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-2 gap-8 items-center">
          {/* left gallery */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InteractiveImage
                src={IMAGES.baba1}
                alt="Баба — вътрешна страница"
                className="rounded-2xl shadow-xl bg-white border border-sand/30"
                onClick={() => openLightbox(insideBooksImages, 0)}
              />
              <InteractiveImage
                src={IMAGES.baba4}
                alt="Баба — вътрешна страница 2"
                className="rounded-2xl shadow-xl bg-white border border-sand/30"
                onClick={() => openLightbox(insideBooksImages, 1)}
              />
              <InteractiveImage
                src={IMAGES.dqdo1}
                alt="Дядо — вътрешна страница"
                className="rounded-2xl shadow-xl bg-white border border-sand/30"
                onClick={() => openLightbox(insideBooksImages, 2)}
              />
              <InteractiveImage
                src={IMAGES.dqdo2}
                alt="Дядо — вътрешна страница 2"
                className="rounded-2xl shadow-xl bg-white border border-sand/30"
                onClick={() => openLightbox(insideBooksImages, 3)}
              />
            </div>
          </div>

          {/* right copy + CTA */}
          <div className="lg:pl-8">
            <h3 className="text-3xl font-pudelinka text-ink mb-4">Не просто въпроси — покани за разговор</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Записването на спомени може да е деликатно. Затова въпросите са меко формулирани и
              естествено подредени, за да водят разговора без напрежение. Страниците дават място
              за личния глас, а снимките превръщат книгата в жив албум.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3"><Star className="mt-1 h-5 w-5 text-teal" /> Внимателна подредба на темите — детство, любов, работа, уроци.</li>
              <li className="flex items-start gap-3"><Images className="mt-1 h-5 w-5 text-teal" /> Място за снимки, рисунки и писма.</li>
              <li className="flex items-start gap-3"><Baby className="mt-1 h-5 w-5 text-teal" /> Децата могат да задават въпросите — и да записват отговорите.</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/books"
                className="inline-flex items-center justify-center bg-teal text-white font-colus font-semibold px-7 py-3 rounded-2xl text-lg shadow-md transition hover:bg-teal-dark"
              >
                Изберете книга <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/books/bundle-baba-dyado"
                className="inline-flex items-center justify-center border border-teal/40 text-teal font-colus px-7 py-3 rounded-2xl text-lg transition hover:border-teal"
              >
                Вземете комплект -10%
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DOLLS — ръчно изработени кукли за игра и за стена */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: 'radial-gradient(rgba(20,115,105,0.12) 1.2px, transparent 1.2px)',
            backgroundSize: '18px 18px',
            backgroundColor: '#f4fbf9',
          }}
        />
        <div className="relative z-10 py-20">
          <SectionTitle
            eyebrow="Ръчно изработени"
            title="Кукли, които разказват"
            sub="Създадени на ръка — за игра, за декор и за споделяне на истории. Стават за стена и за детски театър у дома."
          />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-2 gap-8 items-center">
            <div className="grid grid-cols-2 gap-4">
              <InteractiveImage
                src={IMAGES.dollsWarm}
                alt="Кукли — топлина"
                className="rounded-2xl shadow-xl bg-white border border-sand/30"
                onClick={() => openLightbox(dollsImages, 0)}
              />
              <InteractiveImage
                src={IMAGES.dollsWhy}
                alt="Кукли — изработка"
                className="rounded-2xl shadow-xl bg-white border border-sand/30"
                onClick={() => openLightbox(dollsImages, 1)}
              />
            </div>
            <div className="lg:pl-8">
              <h3 className="text-3xl font-pudelinka text-ink mb-4">Защо куклите?</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Те правят разказването видимо и близко до децата. С тях спомените оживяват —
                и стават сцена, игра и декор. Куклите са изработени внимателно и изглеждат прекрасно и на стена.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/rachno-izraboteni-kukli"
                  className="inline-flex items-center justify-center bg-white text-teal font-colus font-semibold px-7 py-3 rounded-2xl text-lg shadow-md transition hover:bg-teal hover:text-white border border-teal/20"
                >
                  Виж куклите
                </Link>
                <Link
                  to="/kukleni-spektalki"
                  className="inline-flex items-center justify-center border border-teал/40 text-teal font-colus px-7 py-3 rounded-2xl text-lg transition hover:border-teal"
                >
                  Куклени спектакли
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMALL REMINDER (без CTA долу) */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xl text-gray-700">
            Понякога е нужен само един въпрос, за да се отвори цял живот. Позволете на книгата да го зададе.
          </p>
        </div>
      </section>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default HowItWorksPage;
