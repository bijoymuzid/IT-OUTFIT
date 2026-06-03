import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ShopPage from './components/ShopPage';
import Footer from './components/Footer';
import AdminPage from './components/AdminPage';
import './App.css';

const THEMES = ['ivory', 'noir', 'sahara', 'slate', 'blush', 'forest'];

/* detect /bijoy in URL — works with hash or pathname */
function isAdminRoute() {
  return (
    window.location.pathname.startsWith('/bijoy') ||
    window.location.hash === '#/bijoy'
  );
}

export default function App() {
  const [loading,      setLoading]      = useState(true);
  const [themeIndex,   setThemeIndex]   = useState(0);
  const [currentPage,  setCurrentPage]  = useState(() =>
    isAdminRoute() ? 'admin' : 'home'
  );
  /* ── apply theme ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES[themeIndex]);
  }, [themeIndex]);

  /* ── Lenis smooth scroll (skip on admin) ── */
  useEffect(() => {
    if (currentPage === 'admin') return;
    let lenis;
    let rafId;
    async function initLenis() {
      const { default: Lenis } = await import('lenis');
      lenis = new Lenis({ duration: 1.2 });
      function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);
    }
    initLenis();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, [currentPage]);

  const selectTheme = (i) => setThemeIndex(i);
  const navigate    = (page) => setCurrentPage(page);

  /* ── admin: full-screen takeover, skip preloader ── */
  if (currentPage === 'admin') {
    return (
      <AdminPage
        onExit={() => {
          setCurrentPage('home');
          setLoading(false);
        }}
      />
    );
  }

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="app">
          <Navbar
            themeIndex={themeIndex}
            onThemeSelect={selectTheme}
            currentPage={currentPage}
            onNavigate={navigate}
          />
          {currentPage === 'home' ? (
            <HeroSection onNavigate={navigate} />
          ) : (
            <>
              <ShopPage />
              <Footer />
            </>
          )}
        </div>
      )}
    </>
  );
}