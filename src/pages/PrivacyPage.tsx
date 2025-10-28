// src/pages/PrivacyPage.tsx
import React from "react";
import { motion } from "framer-motion";
import { Shield, Inbox, Database, Clock, UserCheck, Cookie, Mail } from "lucide-react";

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
    <h1 className={`text-4xl lg:text-5xl font-pudelinka font-bold ${white ? "text-white" : "text-ink"}`}>{title}</h1>
    {sub && <p className={`mt-4 text-lg ${white ? "text-white/90" : "text-gray-700"}`}>{sub}</p>}
  </div>
);

const Card: React.FC<{ icon?: React.ReactNode; title: string; children: React.ReactNode; delay?: number }> = ({
  icon,
  title,
  children,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.45, delay }}
    className="bg-white rounded-3xl p-7 lg:p-8 shadow-xl border border-sand/30"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center shrink-0">
        {icon ?? <Shield className="h-6 w-6 text-teal" />}
      </div>
      <div>
        <h2 className="text-2xl font-pudelinka text-ink mb-2">{title}</h2>
        <div className="text-gray-700 leading-relaxed">{children}</div>
      </div>
    </div>
  </motion.div>
);

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper-texture">
      {/* HERO */}
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
            eyebrow="Лични данни и сигурност"
            title="Политика за поверителност"
            sub="Пазим историите — и данните — с еднаква грижа: внимателно, отговорно и с уважение."
            white
          />
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8">
          <Card title="Какви данни събираме" icon={<Database className="h-6 w-6 text-teal" />} delay={0.0}>
            <p>
              Когато направите поръчка или се свържете с нас, събираме само най-необходимата информация: име, имейл и
              телефонен номер. Тези данни са нужни единствено, за да обработим вашата поръчка и да се свържем с вас при
              нужда.
            </p>
          </Card>

          <Card title="Как използваме вашите данни" icon={<Inbox className="h-6 w-6 text-teal" />} delay={0.05}>
            <ul className="list-disc pl-5 space-y-1">
              <li>потвърждение и изпращане на поръчката;</li>
              <li>връзка с вас при въпроси или уточнения;</li>
              <li>подобряване на услугата и комуникацията ни с вас.</li>
            </ul>
            <p className="mt-3">
              Не споделяме, не продаваме и не предоставяме лични данни на трети лица, освен на куриерската фирма, която
              доставя вашата пратка.
            </p>
          </Card>

          <Card title="Съхранение и срокове" icon={<Clock className="h-6 w-6 text-teal" />} delay={0.1}>
            <p>
              Пазим вашите данни сигурно и за ограничен период — само докато е необходимо за изпълнение на поръчката или
              според изискванията на закона. След това те се изтриват безопасно.
            </p>
          </Card>

          <Card title="Вашите права" icon={<UserCheck className="h-6 w-6 text-teal" />} delay={0.15}>
            <p>Винаги можете да се свържете с нас, ако искате:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>да получите копие от вашите лични данни;</li>
              <li>да ги коригирате или изтриете;</li>
              <li>да оттеглите съгласието си за обработка.</li>
            </ul>
            <p className="mt-3">
              Пишете ни на{" "}
              <a href="mailto:info@razkajini.bg" className="underline decoration-teal underline-offset-2">
                info@razkajini.bg
              </a>{" "}
              или{" "}
              <a href="mailto:razkajini@gmail.com" className="underline decoration-teal underline-offset-2">
                razkajini@gmail.com
              </a>
              , и ние ще ви отговорим с грижа и уважение.
            </p>
          </Card>

          <Card title="Бисквитки (cookies)" icon={<Cookie className="h-6 w-6 text-teal" />} delay={0.2}>
            <p>
              Нашият сайт използва бисквитки само за да подобри работата си — например, за да запомни езиковите ви
              настройки или продуктите в количката. Не използваме бисквитки за реклама или проследяване на поведението
              Ви извън сайта.
            </p>
          </Card>

          <Card title="Контакт" icon={<Mail className="h-6 w-6 text-teal" />} delay={0.25}>
            <p>
              За въпроси относно поверителността:{" "}
              <a href="mailto:info@razkajini.bg" className="underline decoration-teal underline-offset-2">
                info@razkajini.bg
              </a>{" "}
              /{" "}
              <a href="mailto:razkajini@gmail.com" className="underline decoration-teal underline-offset-2">
                razkajini@gmail.com
              </a>
              .
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
