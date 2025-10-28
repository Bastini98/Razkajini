// src/pages/TermsPage.tsx
import React from "react";
import { motion } from "framer-motion";
import { FileText, Handshake, PackageCheck, CreditCard, Truck, RotateCcw, Shield, Sparkles } from "lucide-react";

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

const Card: React.FC<{ children: React.ReactNode; icon?: React.ReactNode; title: string; delay?: number }> = ({
  children,
  icon,
  title,
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
        {icon ?? <FileText className="h-6 w-6 text-teal" />}
      </div>
      <div>
        <h2 className="text-2xl font-pudelinka text-ink mb-2">{title}</h2>
        <div className="text-gray-700 leading-relaxed">{children}</div>
      </div>
    </div>
  </motion.div>
);

const TermsPage: React.FC = () => {
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
            eyebrow="Правила и информация"
            title="Условия за ползване"
            sub="Написани човешки, ясно и с грижа — когато използвате сайта или правите поръчка, приемате тези условия."
            white
          />
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8">
          <Card title="Кой стои зад „Разкажи ни“" icon={<Handshake className="h-6 w-6 text-teal" />} delay={0.0}>
            <p>
              „Разкажи ни“ е семейна инициатива на Театър „Дани и Деси“. Идеята е създадена от Деси Димова, която
              направи първите книги за своите родители — актрисата Таня Евтимова и кукления сценограф инж. Атанас
              Евтимов, за да запази техните спомени и истории за своите деца. Днес проектът живее, за да свързва
              поколения чрез думи, изкуство и любов.
            </p>
          </Card>

          <Card title="Какво предлагаме" icon={<Sparkles className="h-6 w-6 text-teal" />} delay={0.05}>
            <ul className="list-disc pl-5 space-y-1">
              <li>луксозните книги-дневници „Бабо, разкажи ни“ и „Дядо, разкажи ни“</li>
              <li>ръчно изработени кукли</li>
              <li>аудио приказки, написани и прочетени от актрисата Таня Евтимова</li>
              <li>куклени спектакли на Театър „Дани и Деси“ (видео формат)</li>
            </ul>
          </Card>

          <Card title="Поръчки и плащане" icon={<CreditCard className="h-6 w-6 text-teal" />} delay={0.1}>
            <div className="space-y-3">
              <p>
                След като направите поръчка, ще получите потвърждение по имейл. Можете да заплатите онлайн с дебитна или
                кредитна карта, или при доставка (наложен платеж).
              </p>
              <p>Всички цени са в български лева и в евро и включват ДДС, освен ако не е посочено друго.</p>
            </div>
          </Card>

          <Card title="Доставка" icon={<Truck className="h-6 w-6 text-teal" />} delay={0.15}>
            <p>
              Доставяме в цяла България и в чужбина чрез куриер. Срокът на доставка е обикновено от 1 до 3 работни дни в
              България и между 5–10 дни за чужбина.
            </p>
          </Card>

          <Card title="Връщане и отказ" icon={<RotateCcw className="h-6 w-6 text-teal" />} delay={0.2}>
            <p>
              Можете да върнете продукт в срок до 14 дни от получаването му, ако не е използван и е в оригиналната си
              опаковка. Разходите за връщане са за сметка на клиента, освен при дефект или грешен продукт.
            </p>
          </Card>

          <Card title="Поверителност (накратко)" icon={<Shield className="h-6 w-6 text-teal" />} delay={0.25}>
            <p>
              Пазим вашите лични данни с внимание и отговорност. Събираме само информация, необходима за доставка и
              комуникация — име, имейл и телефон. Не я споделяме с трети страни, освен с куриерската фирма за целите на
              изпращането.
            </p>
            <p className="mt-3">
              Пълната ни политика за поверителност можете да прочетете на отделната страница „Политика за поверителност“.
            </p>
          </Card>

          <Card title="Авторски права" icon={<PackageCheck className="h-6 w-6 text-teal" />} delay={0.3}>
            <p>
              Всички текстове, снимки, дизайни и аудио/видео материали в сайта са собственост на „Разкажи ни“ и Театър
              „Дани и Деси“. Не могат да бъдат копирани, използвани или разпространявани без изрично писмено съгласие.
            </p>
          </Card>

          <Card title="Промени" icon={<FileText className="h-6 w-6 text-teal" />} delay={0.35}>
            <p>
              От време на време можем да актуализираме тези Условия, за да ги направим по-ясни и точни. Новите версии ще
              бъдат публикувани на сайта.
            </p>
            <p className="mt-3">
              „Разкажи ни“ е повече от проект — това е покана да оставим следи от любов, смях и спомени за онези, които
              идват след нас.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
