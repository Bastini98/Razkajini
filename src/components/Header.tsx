// src/components/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import FloatingSearch from './FloatingSearch';

const LOGO_URL = "https://i.ibb.co/S70rh1nm/lohonavbar.webp";
const RATE_BGN_PER_EUR = 1.95583; // 1 EUR = 1.95583 BGN

// Пътища към книги (смени при нужда)
const PATH_BOOK_BABA   = "/books/baba";
const PATH_BOOK_DYADO  = "/books/dyado";
const PATH_BOOK_BUNDLE = "/books/bundle-baba-dyado";
const PATH_ALL_BOOKS   = "/books";

const Header: React.FC = () => {
  const location = useLocation();
  const { state, openCart } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isShopOpen, setIsShopOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const isEN = location.pathname.startsWith('/en');

  // Helper за локализирани пътища
  const pathFor = React.useCallback(
    (p: string) => (isEN ? `/en${p === '/' ? '' : p}` : p),
    [isEN]
  );

  // Скриваме търсачката на детайлни страници:
  // /books/:slug, /rachno-izraboteni-kukli/:slug, /kukleni-spektakli/:slug, /audio-prikazki/:slug
  const isProductDetailPage = React.useMemo(
    () => /^\/(?:en\/)?(books|rachno-izraboteni-kukli|kukleni-spektakli|audio-prikazki)\/[^\/]+(?:\/|$)/i.test(location.pathname),
    [location.pathname]
  );

  React.useEffect(() => { setIsShopOpen(false); }, [location.pathname]);

  const { totalBGN, totalEUR, totalQty } = React.useMemo(() => {
    const items = Array.isArray(state?.items) ? state.items : [];
    const totalBGNRaw = items.reduce((sum: number, item: any) => {
      const price =
        typeof item?.priceBGN === 'number'
          ? item.priceBGN
          : (typeof item?.price === 'number' ? item.price : 0);
      const qty = typeof item?.quantity === 'number' ? item.quantity : 0;
      return sum + price * qty;
    }, 0);
    const totalEURRaw = totalBGNRaw > 0 ? totalBGNRaw / RATE_BGN_PER_EUR : 0;
    const qtySum = items.reduce((s: number, it: any) => s + (typeof it?.quantity === 'number' ? it.quantity : 0), 0);
    return { totalBGN: totalBGNRaw, totalEUR: totalEURRaw, totalQty: qtySum };
  }, [state?.items]);

  const fmtBGN = (n: number) => `${n.toFixed(2)}ЛВ`;
  const fmtEUR = (n: number) => `${n.toFixed(2)}€`;

  return (
    <>
      <header className="sticky top-0 z-50 font-colus">
        <div className="relative bg-white/95 backdrop-blur-sm border-b border-sand/20">
          {/* Зелената форма е премахната */}

          {/* Тънка инфолента */}
          <div className="hidden lg:flex items-center justify-between h-10 px-4 sm:px-6 lg:px-8 text-sm text-gray-700 border-b border-sand/20">
            <div className="flex items-center gap-5">
              <span className="whitespace-nowrap">Над 95% позитивни отзиви</span>
              <span className="hidden xl:inline">Обработваме поръчките веднага</span>
              <span className="hidden xl:inline">SSL криптирана защита</span>
            </div>
            <a href="tel:+359887445101" className="font-medium hover:text-teal transition-colors">
              Поръчай по телефон: +359 887 445 101
            </a>
          </div>

          <nav className="relative w-full px-4 sm:px-6 lg:px-8">
            {/* Mobile */}
            <div className="flex items-center h-20 gap-3 lg:hidden">
              <Link to={isEN ? '/en' : '/'} aria-label={isEN ? 'Home' : 'Начало'} className="flex items-center">
                <img src={LOGO_URL} alt="Разкажи ни!" className="h-14 w-auto" />
              </Link>

              <div className="ml-auto flex items-center gap-2">
                <button onClick={openCart} className="relative p-2 text-gray-700 hover:text-teal transition-colors" aria-label="Количка">
                  <ShoppingBag className="h-6 w-6" />
                  {totalQty > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-teal text-white text-xs rounded-full flex items-center justify-center">
                      {totalQty}
                    </motion.span>
                  )}
                </button>

                <button
                  className="p-2 text-gray-700 hover:text-teal transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? 'Затвори меню' : 'Отвори меню'}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-20">
              {/* Left: Logo */}
              <div className="justify-self-start">
                <Link to={isEN ? '/en' : '/'} aria-label={isEN ? 'Home' : 'Начало'} className="flex items-center">
                  <img src={LOGO_URL} alt="Разкажи ни!" className="h-16 w-auto" loading="eager" decoding="async" />
                </Link>
              </div>

              {/* Center nav */}
              <div className="justify-self-center nav-colus">
                <div className="flex items-center gap-6 whitespace-nowrap">
                  <div
                    className="relative"
                    onMouseEnter={() => setIsShopOpen(true)}
                    onMouseLeave={() => setIsShopOpen(false)}
                  >
                    <button
                      className={`relative text-lg xl:text-xl tracking-wide px-2 py-1 transition-colors cursor-default
${isShopOpen || isActive('/books') || isActive('/rachno-izraboteni-kukli') || isActive('/audio') || isActive('/kukleni-spektakli')
                          ? 'text-teal' : 'text-gray-800 hover:text-teal'}`}
                      aria-haspopup="true"
                      aria-expanded={isShopOpen}
                    >
                      МАГАЗИН
                      {isShopOpen && (
                        <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal rounded-full" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isShopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-2 w-[820px] xl:w-[920px] max-w-[calc(100vw-3rem)]
                                     bg-white shadow-2xl rounded-2xl border border-sand/20 p-5 z-50"
                          onMouseEnter={() => setIsShopOpen(true)}
                          onMouseLeave={() => setIsShopOpen(false)}
                        >
                          <div className="grid grid-cols-3 gap-6">
                            {/* Книги */}
                            <div>
                              <p className="text-[11px] font-colus font-semibold text-gray-500 uppercase tracking-wider mb-2">Книги</p>
                              <ul className="space-y-1.5">
                                <li>
                                  <Link to={pathFor(PATH_BOOK_BABA)} className="block hover:text-teal" onClick={() => setIsShopOpen(false)}>
                                    Бабо, разкажи ни! <span className="text-gray-500">— виж вътре</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link to={pathFor(PATH_BOOK_DYADO)} className="block hover:text-teal" onClick={() => setIsShopOpen(false)}>
                                    Дядо, разкажи ни! <span className="text-gray-500">— виж вътре</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link to={pathFor(PATH_BOOK_BUNDLE)} className="block hover:text-teal" onClick={() => setIsShopOpen(false)}>
                                    Комплекти / Промо −10%
                                  </Link>
                                </li>
                                <li>
                                  <Link to={pathFor(PATH_ALL_BOOKS)} className="block text-sm text-gray-600 hover:text-teal" onClick={() => setIsShopOpen(false)}>
                                    Всички книги
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            {/* Кукли & Сцена */}
                            <div>
                              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Кукли & Сцена</p>
                              <ul className="space-y-1.5">
                                <li>
                                  <Link to={pathFor("/rachno-izraboteni-kukli")} className="block hover:text-teal" onClick={() => setIsShopOpen(false)}>
                                    Ръчно изработени кукли
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={pathFor("/kukleni-spektakli")}
                                    className="block hover:text-teal"
                                    onClick={() => setIsShopOpen(false)}
                                  >
                                    Куклени спектакли
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            {/* Аудио приказки */}
                            <div>
                              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Аудио приказки</p>
                              <ul className="space-y-1.5">
                                <li>
                                  <Link
                                    to={pathFor("/audio-prikazki")}
                                    className="block hover:text-teal transition-colors duration-200"
                                    onClick={() => setIsShopOpen(false)}
                                  >
                                    Слушай у дома
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to={pathFor("/kak-raboti")}
                    className={`relative text-lg xl:text-xl tracking-wide px-2 py-1 transition-colors ${
                      location.pathname.startsWith(pathFor("/kak-raboti")) ? 'text-teal' : 'text-gray-800 hover:text-teal'
                    }`}
                    onClick={() => setIsShopOpen(false)}
                  >
                    КАК РАБОТИ?
                    {location.pathname.startsWith(pathFor("/kak-rabоти")) && (
                      <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal rounded-full" />
                    )}
                  </Link>

                  <Link
                    to={pathFor("/reviews")}
                    className={`relative text-lg xl:text-xl tracking-wide px-2 py-1 transition-colors ${
                      location.pathname.startsWith(pathFor("/reviews")) ? 'text-teal' : 'text-gray-800 hover:text-teal'
                    }`}
                    onClick={() => setIsShopOpen(false)}
                  >
                    ОТЗИВИ
                  </Link>

                  {/* ЗА НАС → /koi-sme-nie */}
                  <Link
                    to={pathFor("/koi-sme-nie")}
                    className={`relative text-lg xl:text-xl tracking-wide px-2 py-1 transition-colors ${
                      location.pathname.startsWith(pathFor("/koi-sme-nie")) ? 'text-teal' : 'text-gray-800 hover:text-teal'
                    }`}
                    onClick={() => setIsShopOpen(false)}
                  >
                    ЗА НАС
                  </Link>

                  {/* БЛОГ → линк към /blog */}
                  <Link
                    to={pathFor("/blog")}
                    className={`relative text-lg xl:text-xl tracking-wide px-2 py-1 transition-colors ${
                      isActive(pathFor("/blog")) ? 'text-teal' : 'text-gray-800 hover:text-teal'
                    }`}
                    onClick={() => setIsShopOpen(false)}
                    aria-current={isActive(pathFor("/blog")) ? 'page' : undefined}
                  >
                    БЛОГ
                    {isActive(pathFor("/blog")) && (
                      <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal rounded-full" />
                    )}
                  </Link>

                  <Link
                    to={pathFor("/contact")}
                    className={`relative text-lg xl:text-xl tracking-wide px-2 py-1 transition-colors
                      ${isActive(pathFor("/contact")) ? 'text-teal' : 'text-gray-800 hover:text-teal'}`}
                    onClick={() => setIsShopOpen(false)}
                  >
                    КОНТАКТ
                    {isActive(pathFor("/contact")) && (
                      <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal rounded-full" />
                    )}
                  </Link>
                </div>
              </div>

              {/* Right */}
              <div className="justify-self-end flex items-center gap-3">
                {/* Премахнат бутон за Вход/Регистрация */}

                <div className="hidden lg:flex flex-col items-end leading-tight">
                  <span className="text-sm font-semibold text-gray-800">{fmtBGN(totalBGN)}</span>
                  <span className="text-xs text-gray-500">{fmtEUR(totalEUR)}</span>
                </div>

                <button onClick={openCart} className="relative p-2 text-gray-700 hover:text-teal transition-colors" aria-label="Количка">
                  <ShoppingBag className="h-6 w-6" />
                  {totalQty > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-teal text-white text-xs rounded-full flex items-center justify-center">
                      {totalQty}
                    </motion.span>
                  )}
                </button>
              </div>
            </div>
          </nav>

          {/* Floating search */}
          <div
            className={`${isProductDetailPage ? 'hidden' : 'hidden lg:block'} absolute left-0 right-0 -bottom-12 pr-4 sm:pr-6 lg:pr-8 pointer-events-none`}
          >
            <FloatingSearch pathFor={pathFor} hidden={isProductDetailPage} />
          </div>
        </div>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-white">
              <div className="pt-4 px-4 pb-24 overflow-y-auto">
                <form action={pathFor("/search")} className="mb-4">
                  <div className="relative">
                    <input
                      type="search"
                      name="q"
                      aria-label="Търсене"
                      placeholder="Търси: бабо, дядо, комплект…"
                      className="w-full rounded-full border border-sand/40 px-4 py-3 pr-10 text-base outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </form>

                <nav className="space-y-2">
                  <p className="px-2 text-xs tracking-wider text-gray-500 uppercase">Магазин</p>
                  <span className="block px-2 py-3 text-lg font-semibold cursor-default">Книги</span>
                  <Link to={pathFor(PATH_BOOK_BUNDLE)} className="block px-2 py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Комплекти / Промо
                  </Link>
                  <Link
                    to={pathFor("/rachno-izraboteni-kukli")}
                    className="block px-2 py-3 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Ръчно изработени кукли
                  </Link>
                  <Link
                    to={pathFor("/kukleni-spektakli")}
                    className="block px-2 py-3 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Куклени спектакли
                  </Link>
                  <Link
                    to={pathFor("/audio-prikazki")}
                    className="block px-2 py-3 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Аудио приказки
                  </Link>

                  <p className="mt-4 px-2 text-xs tracking-wider text-gray-500 uppercase">Открий</p>
                  <Link to={pathFor("/kak-raboti")} className="block px-2 py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Как работи?
                  </Link>
                  <Link to={pathFor("/reviews")} className="block px-2 py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Отзиви
                  </Link>
                  <Link to={pathFor("/koi-sme-nie")} className="block px-2 py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    За нас
                  </Link>
                  <Link to={pathFor("/blog")} className="block px-2 py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Блог
                  </Link>
                  <Link to={pathFor("/contact")} className="block px-2 py-3 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Контакт
                  </Link>
                </nav>
              </div>

              <div className="fixed bottom-0 inset-x-0 bg-white border-t border-sand/20 px-4 py-3 flex items-center justify-between">
                <button onClick={() => { setIsMobileMenuOpen(false); openCart(); }}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-sand/40">
                  <ShoppingBag className="w-5 h-5" />
                  Количка
                  {totalQty > 0 && (<span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-2 rounded-full bg-teal text-white text-xs">{totalQty}</span>)}
                </button>
                <button type="button" className="inline-flex items-center rounded-full bg-teal text-white px-6 py-3 font-semibold cursor-default">
                  Поръчай
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
