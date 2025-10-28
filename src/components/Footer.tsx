// src/components/Footer.tsx
import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const PAYMENT_ICONS = [
  { src: 'https://i.ibb.co/LdFDwVMp/stripe-1-copy.webp', alt: 'Лого на плащане 1' },
  { src: 'https://i.ibb.co/F4WFkP8f/mastercard.webp', alt: 'Символ за пари' },
  { src: 'https://i.ibb.co/7JtF9cy3/visa.webp', alt: 'Платежни символи' },
  { src: 'https://i.ibb.co/Y7M0q4k4/speedy.webp', alt: 'Stripe' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-4">
              <div className="bg-white rounded-3xl p-3 md:p-4 shadow-md shrink-0">
                <img
                  src="https://i.ibb.co/Z6Pfkkqj/lohonavbar.webp"
                  alt="Разкажи ни! - лого"
                  className="h-14 md:h-16 lg:h-20 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-white/80 leading-relaxed">
              Ние вярваме, че спомените са най-ценният подарък. Помагаме на семействата да
              записват и предават историите си.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-colus font-bold text-xl mb-4">Бързи връзки</h3>
            <ul className="space-y-2">
              <li><Link to="/books" className="text-white/85 hover:text-white transition-colors">Книги</Link></li>
              <li><Link to="/audio-prikazki" className="text-white/85 hover:text-white transition-colors">Аудио приказки</Link></li>
              <li><Link to="/rachno-izraboteni-kukli" className="text-white/85 hover:text-white transition-colors">Кукли</Link></li>
              <li><Link to="/kukleni-spektakli" className="text-white/85 hover:text-white transition-colors">Куклени спектакли</Link></li>
              <li><Link to="/koi-sme-nie" className="text-white/85 hover:text-white transition-colors">За нас</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-colus font-bold text-xl mb-4">Контакти</h3>
            <ul className="space-y-3 text-white/85">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-white" />
                <span>+359 887 445 101</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white" />
                <span>info@razkajini.bg</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-white mt-1" />
                <span>
                  ул. Витоша 15<br />София 1000, България
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="font-colus font-bold text-xl mb-4">Следвай ни</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" aria-label="Facebook" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>

            <p className="text-white/80 text-sm mb-3">Абонирай се за новини и специални оферти:</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-stretch rounded-lg overflow-hidden bg-white">
              <input
                type="email"
                placeholder="Твоят email"
                className="flex-1 px-3 py-2 text-ink placeholder:text-zinc-500 focus:outline-none"
                aria-label="Email за абонамент"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#3c9383] hover:bg-[#337b6f] text-white font-colus font-semibold transition-colors"
                aria-label="Изпрати"
              >
                →
              </button>
            </form>
          </div>
        </div>

        {/* Secure Payments */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-white/40">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
              <ShieldCheck className="h-7 w-7 text-[#3c9383]" />
              <h4 className="font-colus font-bold text-2xl text-ink text-center">
                Сигурно плащане
              </h4>
            </div>
            <p className="text-center text-ink/80 max-w-2xl mx-auto mb-8">
              Плащанията се обработват през утвърдени, сертифицирани доставчици. Вашите данни са
              защитени, а транзакциите — криптирани.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {PAYMENT_ICONS.map((icon) => (
                <div
                  key={icon.src}
                  className="h-14 sm:h-16 md:h-20 lg:h-24 flex items-center justify-center grayscale hover:grayscale-0 transition"
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/15 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-white/75 text-sm">
            © 2025 Разкажи ни · Семейство и Театър „Дани и Деси“<br className="md:hidden" />
            <span className="block md:inline"> Създадено с любов, за да пазим спомените живи.</span>
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <Link to="/terms" className="text-white/85 hover:text-white transition-colors">
              Условия за ползване
            </Link>
            <Link to="/privacy" className="text-white/85 hover:text-white transition-colors">
              Политика за поверителност
            </Link>
            <Link to="/faq" className="text-white/85 hover:text-white transition-colors">
              Често задавани въпроси
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
