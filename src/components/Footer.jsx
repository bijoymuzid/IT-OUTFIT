import { useRef } from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

export default function Footer() {
  const fadeUp = (i) => ({
    initial:     { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0  },
    viewport:    { once: true, margin: '-40px' },
    transition:  { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  });

  return (
    <footer className="footer">

      {/* ── BIG TAGLINE ── */}
      <div className="footer__hero">
        <div className="footer__tagline-wrap">
          <motion.h2 className="footer__tagline footer__tagline--dark" {...fadeUp(0)}>
            DRESSED WITH INTENTION.
          </motion.h2>
          <motion.h2 className="footer__tagline footer__tagline--muted" {...fadeUp(1)}>
            WORN WITH CPNFIDENCE.
          </motion.h2>
        </div>

        <motion.div className="footer__badge" {...fadeUp(0)}>
          <span className="footer__badge-symbol">©</span>
          <span className="footer__badge-year">26</span>
        </motion.div>
      </div>

      {/* ── DESCRIPTION ── */}
      <motion.p className="footer__desc" {...fadeUp(2)}>
        IT Outfit is a carefully curated collection of everyday essentials<br />
        built for people who take dressing seriously. Simply designed. Always considered.
      </motion.p>

      {/* ── DIVIDER ── */}
      <motion.div
        className="footer__divider"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left center' }}
      />

      {/* ── BOTTOM ROW ── */}
      <div className="footer__bottom">

        {/* Brand */}
        <div className="footer__col">
          <span className="footer__col-brand">IT Outfit</span>
          <span className="footer__col-copy">All rights reserved © 2026</span>
        </div>

        {/* Address */}
        <div className="footer__col">
          <span>Dhaka, Bangladesh</span>
          <span>Studio 04</span>
          <span>it-outfit.com</span>
        </div>

        {/* Legal */}
        <div className="footer__col">
          <a href="#" className="footer__link">Privacy Policy</a>
          <a href="#" className="footer__link">Terms of Use</a>
        </div>

        {/* Social */}
        <div className="footer__col">
          <a href="#" className="footer__link">Instagram</a>
          <a href="#" className="footer__link">Facebook</a>
          <a href="#" className="footer__link">Pinterest</a>
          <a href="#" className="footer__link">Twitter (X)</a>
        </div>

        {/* Shop Categories */}
        <div className="footer__col">
          <span className="footer__shop-title">Shop</span>
          <div className="footer__shop-grid">
            <a href="#" className="footer__shop-link">Tops</a>
            <a href="#" className="footer__shop-link">Bottoms</a>
            <a href="#" className="footer__shop-link">Accessories</a>
            <a href="#" className="footer__shop-link">New Arrivals</a>
            <a href="#" className="footer__shop-link">Best Sellers</a>
            <a href="#" className="footer__shop-link">Sale</a>
          </div>
        </div>

        {/* Nav */}
        <div className="footer__col">
          <a href="#" className="footer__link">About</a>
          <a href="#" className="footer__link">Lookbook</a>
          <a href="#" className="footer__link">Careers</a>
        </div>

        {/* CTA */}
        <div className="footer__col">
          <a href="#" className="footer__cta">Let's talk →</a>
        </div>

      </div>
    </footer>
  );
}