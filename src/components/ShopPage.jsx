import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import BottomCard from './BottomCard';
import ProductDetailPage from './ProductDetailPage';
import { useStore } from '../useStore';
import './ShopPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function ShopPage() {
  const [detail, setDetail] = useState(null);

  const openDetail  = useCallback((product, section) => setDetail({ product, section }), []);
  const closeDetail = useCallback(() => setDetail(null), []);

  if (detail) {
    return (
      <ProductDetailPage
        product={detail.product}
        section={detail.section}
        onBack={closeDetail}
      />
    );
  }

  return <ShopGrid openDetail={openDetail} />;
}

function ShopGrid({ openDetail }) {
  const { byCategory } = useStore();

  /* derive arrays fresh from store each render */
  const TOP    = byCategory('top');
  const BOTTOM = byCategory('bottom');

  /* collect any extra custom categories (not top/bottom) */
  const { cats, byCategory: getByCat } = useStore();
  const extraCats = cats.filter(c => c.id !== 'top' && c.id !== 'bottom');

  const titleRef  = useRef(null);
  const lineRef   = useRef(null);
  const cursorRef = useRef(null);
  const rafRef    = useRef(null);
  const posRef    = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  /* ── hero animation ── */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      gsap.set(titleRef.current, { y: 80, opacity: 0 });
      gsap.set(lineRef.current,  { scaleX: 0 });
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(lineRef.current,  { scaleX: 1,  duration: 1.0,  ease: 'power3.inOut', transformOrigin: 'left center' });
      tl.to(titleRef.current, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '-=0.15');
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── smooth lerp cursor ── */
  useEffect(() => {
    const LERP = 0.10;
    const loop = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * LERP;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * LERP;
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    const onMove = (e) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleEnter = useCallback(() => setCursorVisible(true),  []);
  const handleLeave = useCallback(() => setCursorVisible(false), []);

  useEffect(() => {
    const onEnter = (e) => { if (e.target.closest('.pcard__wrap, .bcard__wrap')) handleEnter(); };
    const onLeave = (e) => { if (e.target.closest('.pcard__wrap, .bcard__wrap')) handleLeave(); };
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout',  onLeave);
    return () => {
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout',  onLeave);
    };
  }, [handleEnter, handleLeave]);

  const fadeUp = (i) => ({
    initial:     { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0  },
    viewport:    { once: true, margin: '-40px' },
    transition:  { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 },
  });

  return (
    <main className="shop">

      {/* ── GLOBAL MOUSE-FOLLOW CURSOR ── */}
      <div
        ref={cursorRef}
        className={`shop__cursor ${cursorVisible ? 'shop__cursor--visible' : ''}`}
        aria-hidden="true"
      >
        <span>VIEW<br />MORE</span>
      </div>

      {/* ── HERO ── */}
      <header className="shop__hero">
        <div ref={lineRef} className="shop__hero-line" />
        <div ref={titleRef} className="shop__title-clip" style={{ opacity: 0 }}>
          <h1 className="shop__title-text">IT OUTFIT</h1>
          <div className="shop__hero-border" />
        </div>
      </header>

      {/* ══ TOP SECTION ══ */}
      {TOP.length > 0 && (
        <section className="shop__sec">
          <motion.span className="shop__label" {...fadeUp(0)}>Top</motion.span>

          <div className="grid4">
            {TOP.slice(0, 4).map((p, i) => (
              <ProductCard key={p.uid} product={p} index={i}
                onSelect={(prod) => openDetail(prod, 'top')} />
            ))}
          </div>

          {TOP.length > 4 && (
            <div className="top-row2">
              <div className="top-row2__left">
                {TOP[4] && <ProductCard product={TOP[4]} index={4} onSelect={(prod) => openDetail(prod, 'top')} />}
                {TOP[5] && <ProductCard product={TOP[5]} index={5} onSelect={(prod) => openDetail(prod, 'top')} />}
              </div>
              <div className="top-row2__hero">
                {TOP[6] && <ProductCard product={TOP[6]} index={6} onSelect={(prod) => openDetail(prod, 'top')} />}
              </div>
            </div>
          )}

          {TOP.length > 7 && (
            <div className="top-row3">
              {TOP[7] && <ProductCard product={TOP[7]} index={7} onSelect={(prod) => openDetail(prod, 'top')} />}
              {TOP[8] && <ProductCard product={TOP[8]} index={8} onSelect={(prod) => openDetail(prod, 'top')} />}
              {TOP[9] && <ProductCard product={TOP[9]} index={9} onSelect={(prod) => openDetail(prod, 'top')} />}
            </div>
          )}

          {/* overflow: any products beyond index 9 rendered in simple grid */}
          {TOP.length > 10 && (
            <div className="grid4" style={{ marginTop: '2rem' }}>
              {TOP.slice(10).map((p, i) => (
                <ProductCard key={p.uid} product={p} index={i}
                  onSelect={(prod) => openDetail(prod, 'top')} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── DIVIDER ── */}
      <motion.div
        className="shop__divider"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left center' }}
      />

      {/* ══ BOTTOM SECTION ══ */}
      {BOTTOM.length > 0 && (
        <section className="shop__sec">
          <motion.span className="shop__label" {...fadeUp(0)}>Bottom</motion.span>

          <div className="grid4">
            {BOTTOM.slice(0, 4).map((p, i) => (
              <BottomCard key={p.uid} product={p} index={i}
                onSelect={(prod) => openDetail(prod, 'bottom')} />
            ))}
          </div>

          {BOTTOM.length > 4 && (
            <div className="bottom-row2">
              <div className="bottom-col bottom-col--large">
                <BottomCard product={BOTTOM[4]} index={4} onSelect={(prod) => openDetail(prod, 'bottom')} />
              </div>
              <div className="bottom-col--gap" />
              <div className="bottom-col bottom-col--stack">
                {BOTTOM[5] && <BottomCard product={BOTTOM[5]} index={5} onSelect={(prod) => openDetail(prod, 'bottom')} />}
                {BOTTOM[6] && <BottomCard product={BOTTOM[6]} index={6} onSelect={(prod) => openDetail(prod, 'bottom')} />}
              </div>
            </div>
          )}

          {BOTTOM.length > 7 && (
            <div className="grid4" style={{ marginTop: '2rem' }}>
              {BOTTOM.slice(7).map((p, i) => (
                <BottomCard key={p.uid} product={p} index={i}
                  onSelect={(prod) => openDetail(prod, 'bottom')} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══ EXTRA CUSTOM CATEGORIES ══ */}
      {extraCats.map((cat, ci) => {
        const items = getByCat(cat.id);
        if (!items.length) return null;
        return (
          <section className="shop__sec" key={cat.id}>
            {ci === 0 && (
              <motion.div
                className="shop__divider"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left center', marginBottom: '3rem' }}
              />
            )}
            <motion.span className="shop__label" {...fadeUp(0)}>{cat.label}</motion.span>
            <div className="grid4">
              {items.map((p, i) => (
                <ProductCard key={p.uid} product={p} index={i}
                  onSelect={(prod) => openDetail(prod, cat.id)} />
              ))}
            </div>
          </section>
        );
      })}

    </main>
  );
}