import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Navbar.css';

const THEMES = ['ivory', 'noir', 'sahara', 'slate', 'blush', 'forest'];
const THEME_META = [
  { label: 'Ivory',  swatch: '#f4f1ec', dot: '#0d0d0d' },
  { label: 'Noir',   swatch: '#0c0c0c', dot: '#f0ece4' },
  { label: 'Sahara', swatch: '#e8d9c4', dot: '#2e1f0e' },
  { label: 'Slate',  swatch: '#e8ecf0', dot: '#1a2332' },
  { label: 'Blush',  swatch: '#f5ede8', dot: '#2d1a1a' },
  { label: 'Forest', swatch: '#e8ece4', dot: '#1a2418' },
];

export default function Navbar({ themeIndex, onThemeSelect, currentPage, onNavigate }) {
  const navRef   = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current.querySelectorAll('.nav__item'),
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  /* close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* close mobile menu when navigating */
  const handleNav = (page) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <nav ref={navRef} className={`navbar ${mobileOpen ? 'navbar--mobile-open' : ''}`}>
      {/* Brand — visible on mobile */}
      <a href="#" className="nav__brand" onClick={(e) => { e.preventDefault(); handleNav('home'); }}>IT OUTFIT</a>

      {/* Hamburger button — mobile only */}
      <button
        className={`nav__hamburger ${mobileOpen ? 'nav__hamburger--open' : ''}`}
        onClick={() => setMobileOpen(m => !m)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Desktop links + mobile overlay */}
      <div className={`nav__menu ${mobileOpen ? 'nav__menu--open' : ''}`}>
        <ul className="nav__links">
          <li className="nav__item">
            <a href="#" className={currentPage === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNav('home'); }}>Home</a>
          </li>
          <li className="nav__item">
            <a href="#" className={currentPage === 'shop' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNav('shop'); }}>Shop</a>
          </li>
          <li className="nav__item">
            <a href="#">Bag</a>
          </li>
        </ul>

        {/* Theme trigger */}
        <div className="theme-wrapper nav__item" ref={panelRef}>
          <button className={`theme-btn ${open ? 'theme-btn--open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Choose theme">
            <span className="theme-btn__plus" />
          </button>

          {/* Dropdown panel */}
          <div className={`theme-panel ${open ? 'theme-panel--open' : ''}`}>
            <p className="theme-panel__title">THEME</p>
            <div className="theme-swatches">
              {THEMES.map((t, i) => (
                <button
                  key={t}
                  className={`swatch ${i === themeIndex ? 'swatch--active' : ''}`}
                  style={{ background: THEME_META[i].swatch, border: `1.5px solid ${THEME_META[i].dot}` }}
                  onClick={() => { onThemeSelect(i); setOpen(false); }}
                  aria-label={THEME_META[i].label}
                >
                  <span className="swatch__inner" style={{ background: THEME_META[i].dot }} />
                  <span className="swatch__label" style={{ color: THEME_META[i].dot }}>{THEME_META[i].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}