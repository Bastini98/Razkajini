// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import PageTurnTransition from './components/PageTurnTransition';

import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import DollsPage from './pages/DollsPage';
import DollDetailPage from './pages/DollDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import TestSupabase from './pages/TestSupabase';
import ReviewsPage from './pages/ReviewsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import SpectaclesPage from "./pages/SpectaclesPage";
import SpectacleDetailPage from "./pages/SpectacleDetailPage";
import AudioListPage from "./pages/AudioListPage";
import AudioDetailPage from "./pages/AudioDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";

// NEW: legal/help pages
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminGuard from "./auth/AdminGuard";
import AdminBlogNew from "./pages/admin/AdminBlogNew";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";

// (опционални placeholder-и – може да ги махнеш, ако не ти трябват)
const PuppetsPage = () => (
  <div className="min-h-screen bg-paper-texture flex items-center justify-center">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-serif font-bold text-ink">Кукли</h1>
      <p className="text-xl text-gray-600">Играй историята у дома</p>
      <div className="text-6xl">🎭</div>
    </div>
  </div>
);
const PuppetShowsPage = () => (
  <div className="min-h-screen bg-paper-texture flex items-center justify-center">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-serif font-bold text-ink">Куклени спектакли</h1>
      <p className="text-xl text-gray-600">Изпрати запитване за спектакъл</p>
      <div className="text-6xl">🎪</div>
    </div>
  </div>
);
const CartPage = () => (
  <div className="min-h-screen bg-paper-texture flex items-center justify-center">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-serif font-bold text-ink">Количка</h1>
      <p className="text-xl text-gray-600">Преглед на поръчката</p>
      <div className="text-6xl">🛒</div>
    </div>
  </div>
);

function AppShell() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [loaderReady, setLoaderReady] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (location.pathname !== '/' && !loaderReady) {
      const t = setTimeout(() => setLoaderReady(true), 450);
      return () => clearTimeout(t);
    }
  }, [location.pathname, loaderReady]);

  useEffect(() => {
    if (!loaderReady) {
      const safety = setTimeout(() => setLoaderReady(true), 4000);
      return () => clearTimeout(safety);
    }
  }, [loaderReady]);

  return (
    <div className="App">
      <ScrollToTop />

      {showLoader && (
        <LoadingScreen
          isReady={loaderReady}
          onComplete={() => setShowLoader(false)}
          imageSrc="https://i.ibb.co/jvMFJc4f/knigakorica2.webp"
          hingeOnViewportLeft
          peelMs={2400}
          overshootMs={420}
          overshootPct={0.06}
          maxThetaDeg={160}
        />
      )}

      {/* Скриваме публичния Header на /admin */}
      {!isAdminRoute && <Header />}

      <ErrorBoundary>
        <main>
          <Routes>
            {/* Публични маршрути – през PageTurnTransition */}
            <Route path="/" element={<PageTurnTransition />}>
              <Route index element={<HomePage onHeroReady={() => setLoaderReady(true)} />} />

              {/* КНИГИ */}
              <Route path="books" element={<BooksPage />} />
              <Route path="books/:slug" element={<BookDetailPage />} />

              {/* КУКЛИ */}
              <Route path="rachno-izraboteni-kukli" element={<DollsPage />} />
              <Route path="rachno-izraboteni-kukli/:slug" element={<DollDetailPage />} />

              {/* ДРУГИ СТРАНИЦИ */}
              <Route path="puppets" element={<PuppetsPage />} />
              <Route path="shows" element={<PuppetShowsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="kak-raboti" element={<HowItWorksPage />} />
              <Route path="koi-sme-nie" element={<AboutPage />} />
              <Route path="kukleni-spektakli" element={<SpectaclesPage />} />
              <Route path="kukleni-spektakli/:slug" element={<SpectacleDetailPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="test-supabase" element={<TestSupabase />} />

              {/* АУДИО ПРИКАЗКИ */}
              <Route path="audio-prikazki" element={<AudioListPage />} />
              <Route path="audio-prikazki/:slug" element={<AudioDetailPage />} />

              {/* БЛОГ – реалните страници */}
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />

              {/* Количка (ако ползваш отделна страница) */}
              <Route path="cart" element={<CartPage />} />

              {/* NEW: Legal / Help */}
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="faq" element={<FAQPage />} />
            </Route>

            {/* ADMIN маршрути – извън публичния layout */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <AdminGuard>
                  <AdminBlog />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/blog/new"
              element={
                <AdminGuard>
                  <AdminBlogNew />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/blog/edit/:id"
              element={
                <AdminGuard>
                  <AdminBlogEdit />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminGuard>
                  <AdminOrders />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <AdminGuard>
                  <AdminInquiries />
                </AdminGuard>
              }
            />
          </Routes>
        </main>
      </ErrorBoundary>

      {/* Скриваме публичния Footer/CartDrawer на /admin */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CartDrawer />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppShell />
      </Router>
    </CartProvider>
  );
}
