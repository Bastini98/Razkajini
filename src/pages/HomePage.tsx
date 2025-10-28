// src/pages/HomePage.tsx
import React, { useEffect, useRef } from 'react';
import HeroBook from '../components/HeroBook';
import TestimonialCarousel from '../components/TestimonialCarousel';
import BabaDyadoSection from '../components/BabaDyadoSection';
import HowItWorks from '../components/HowItWorks';
import BestSellers from '../components/BestSellers';
import BlogSlide from '../components/BlogSlide';

type HomePageProps = {
  /** Подадено от App -> използва се за затваряне на LoadingScreen */
  onHeroReady?: () => void;
};

// Ключови hero assets, чието зареждане смятаме за "готов hero"
const HERO_ASSETS = [
  'https://i.ibb.co/yBXHx0yM/knigakorica.webp', // корицата за „отварящата се книга"
];

const HomePage: React.FC<HomePageProps> = ({ onHeroReady }) => {
  const signaledRef = useRef(false);

  // Сигнализирай точно веднъж
  const signalReadyOnce = () => {
    if (signaledRef.current) return;
    signaledRef.current = true;
    onHeroReady?.();
  };

  // Прелоуд на ключовия визуален asset за героя + защитен таймер
  useEffect(() => {
    let cancelled = false;
    const safety = window.setTimeout(signalReadyOnce, 1800); // fallback, ако мрежата е бавна

    const preloadAll = async () => {
      try {
        await Promise.all(
          HERO_ASSETS.map(
            src =>
              new Promise<void>(resolve => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve();
                img.onerror = () => resolve(); // да не блокира
              })
          )
        );
        if (!cancelled) signalReadyOnce();
      } catch {
        if (!cancelled) signalReadyOnce();
      }
    };

    preloadAll();

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroBook />

      {/* Продуктови блокове */}
      <BabaDyadoSection />

      {/* Отзиви */}
      <TestimonialCarousel />

      {/* Как работи */}
      <HowItWorks />

      <BestSellers />

      <BlogSlide/>
    </div>
  );
};

export default HomePage;
