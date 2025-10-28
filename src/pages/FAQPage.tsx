// src/pages/FAQPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  BookOpen,
  Heart,
  Images,
  CreditCard,
  Truck,
  Globe,
  RotateCcw,
  Mail,
  Phone,
} from "lucide-react";

type FAQ = {
  q: string;
  a: React.ReactNode;
  icon?: React.ReactNode;
};

const SectionTitle: React.FC<{ eyebrow?: string; title: string; sub?: string; white?: boolean }> = ({
  eyebrow,
  title,
  sub,
  white,
}) => (
  <div className="text-center max-w-4xl mx-auto px-6">
    {eyebrow && (
      <p className={`uppercase tracking-[0.2em] mb-3 text-sm ${white ? "text-white/70" : "text-teal"}`}>
        {eyebrow}
      </p>
    )}
    <h1 className={`text-4xl lg:text-5xl font-pudelinka font-bold ${white ? "text-white" : "text-ink"}`}>
      {title}
    </h1>
    {sub && <p className={`mt-4 text-lg ${white ? "text-white/90" : "text-gray-700"}`}>{sub}</p>}
  </div>
);

const faqs: FAQ[] = [
  {
    q: "Какво представляват книгите „Разкажи ни“?",
    icon: <BookOpen className="h-5 w-5 text-teal" />,
    a: (
      <p className="text-gray-700 leading-relaxed">
        Нашите книги-дневници са истинска съкровищница на семейната памет, мост между старото и новото поколение.
        Те са красиво оформени, луксозни издания, в които да съхраните спомени, истории, снимки, талисмани.
        Насочващите въпроси са там, за да не пропуснете важните детайли. Дневниците са плод на най-чистата и истинска любов,
        тази между дете и родител. Вдъхновена от силно емоционални моменти в живота си, Деси измайсторява първообраза на
        дневниците като подарък за родителите си – актрисата Таня Евтимова и кукления сценограф инж. Атанас Евтимов.
        Така се „ражда“ идеята родителите да разкажат житейските си истории, предавайки ги на бъдещите поколения.
      </p>
    ),
  },
  {
    q: "За кого са подходящи?",
    icon: <Heart className="h-5 w-5 text-teal" />,
    a: (
      <p className="text-gray-700 leading-relaxed">
        Книгите „Бабо, разкажи ни!“ и „Дядо, разкажи ни!“ са идеалният подарък за сближаване. Те не са просто вещ.
        Дневниците олицетворяват родова памет, връзка, любов, грижа. Подходящи са за баби, дядовци и родители – за всички,
        които искат да споделят преживяванията и емоциите си с любимите хора.
      </p>
    ),
  },
  {
    q: "Какво още мога да открия на сайта?",
    icon: <Images className="h-5 w-5 text-teal" />,
    a: (
      <p className="text-gray-700 leading-relaxed">
        Всичко в „Разкажи ни“ е създадено с много любов от едно артистично семейство. Освен книгите-дневници, на сайта те очакват:
        <br />– Ръчно изработени кукли
        <br />– Аудио приказки, написани и прочетени от актрисата Таня Евтимова
        <br />– Видео записи на куклени спектакли на Театър „Дани и Деси“.
      </p>
    ),
  },
  {
    q: "Как да направя поръчка?",
    icon: <CreditCard className="h-5 w-5 text-teal" />,
    a: (
      <p className="text-gray-700 leading-relaxed">
        Изберете желания продукт, натиснете „Поръчай“ и попълнете вашите данни за доставка. След това ще получите
        потвърждение по имейл или телефон.
      </p>
    ),
  },
  {
    q: "Как мога да платя?",
    icon: <CreditCard className="h-5 w-5 text-teal" />,
    a: (
      <div className="text-gray-700 leading-relaxed">
        Предлагаме два удобни начина:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Онлайн плащане с карта</li>
          <li>Плащане при доставка (наложен платеж)</li>
        </ul>
      </div>
    ),
  },
  {
    q: "Колко време отнема доставката?",
    icon: <Truck className="h-5 w-5 text-teal" />,
    a: (
      <p className="text-gray-700 leading-relaxed">
        В повечето случаи — до 1 работен ден в България. За чужбина — между 5 и 10 работни дни, в зависимост от дестинацията.
      </p>
    ),
  },
  {
    q: "Изпращате ли в чужбина?",
    icon: <Globe className="h-5 w-5 text-teal" />,
    a: (
      <p className="text-gray-700 leading-relaxed">
        Да, разбира се! Изпращаме пратки по цял свят. Цената за доставка се изчислява автоматично при поръчката.
      </p>
    ),
  },
  {
    q: "Мога ли да върна продукт?",
    icon: <RotateCcw className="h-5 w-5 text-teal" />,
    a: (
      <p className="text-gray-700 leading-relaxed">
        Да, имате право да върнете продукт в рамките на 14 дни след получаването му, ако не е използван и е в оригиналната си опаковка.
      </p>
    ),
  },
  {
    q: "Как да се свържа с вас?",
    icon: <Mail className="h-5 w-5 text-teal" />,
    a: (
      <div className="text-gray-700 leading-relaxed">
        Можете да ни пишете чрез формата за контакт на сайта или директно на имейл{" "}
        <a href="mailto:info@razkajini.bg" className="underline decoration-teal underline-offset-2">
          info@razkajini.bg
        </a>{" "}
        или{" "}
        <a href="mailto:razkajini@gmail.com" className="underline decoration-teal underline-offset-2">
          razkajini@gmail.com
        </a>
        . Ще се радваме да ви отговорим лично.
        <div className="mt-3 flex items-center gap-3 text-ink/80">
          <Phone className="h-4 w-4" /> <span>+359 887 445 101</span>
        </div>
      </div>
    ),
  },
];

const FAQItem: React.FC<{ item: FAQ; index: number }> = ({ item, index }) => {
  const [open, setOpen] = useState(index < 2); // първите 2 отворени по дизайн
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="bg-white rounded-3xl border border-sand/30 shadow-xl overflow-hidden"
    >
      <button
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-sand-light/20 transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="w-10 h-10 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
          {item.icon ?? <HelpCircle className="h-5 w-5 text-teal" />}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-pudelinka text-ink">{item.q}</h3>
          <motion.div
            initial={false}
            animate={{ height: open ? "auto" : 0, marginTop: open ? 8 : 0, opacity: open ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="pr-2">{item.a}</div>
          </motion.div>
        </div>
      </button>
    </motion.div>
  );
};

const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper-texture">
      {/* HERO (teal dotted) */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1.2px, transparent 1.2px)",
            backgroundSize: "18px 18px",
            backgroundColor: "#0f766e",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <SectionTitle
            eyebrow="Помощ и отговори"
            title="Често задавани въпроси"
            sub="Ако не откриеш нужната информация, пиши ни — ще се радваме да помогнем."
            white
          />
        </div>
      </section>

      {/* FAQ grid */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-5">
          {faqs.map((item, idx) => (
            <FAQItem key={idx} item={item} index={idx} />
          ))}
        </div>
      </section>

      {/* Small contact reminder */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-lg text-gray-700">
            Не намираш отговор? Пиши ни на{" "}
            <a href="mailto:info@razkajini.bg" className="underline decoration-teal underline-offset-2">
              info@razkajini.bg
            </a>{" "}
            — обикновено отговаряме бързо.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
