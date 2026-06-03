import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import './BottomCard.css';

/* ── resolve image paths based on seeded vs custom ── */
function resolveImages(product) {
  if (product.seeded) {
    return {
      primary: `/bottom/${product.id}.jpeg`,
      hover:   `/human-bottom/${product.id}.jpeg`,
    };
  }
  return {
    primary: product.image      || '',
    hover:   product.imageHover || product.image || '',
  };
}

export default function BottomCard({ product, index, onSelect }) {
  const p = product ?? {};
  const { primary, hover } = resolveImages(p);

  const cardRef = useRef(null);
  const hoverTl = useRef(null);

  /* ── GSAP hover timeline ── */
  const handleEnter = () => {
    hoverTl.current?.kill();
    const wrap    = cardRef.current;
    const def     = wrap.querySelector('.bcard__img--default');
    const clip    = wrap.querySelector('.bcard__hover-clip');
    const hovered = wrap.querySelector('.bcard__img--hover');

    hoverTl.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    hoverTl.current
      .to(def,     { scale: 1.04, opacity: 0, duration: 0.9 }, 0)
      .fromTo(clip,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)',   duration: 0.9 }, 0)
      .fromTo(hovered, { y: 28 }, { y: 0, duration: 0.9 }, 0);
  };

  const handleLeave = () => {
    hoverTl.current?.kill();
    const wrap    = cardRef.current;
    const def     = wrap.querySelector('.bcard__img--default');
    const clip    = wrap.querySelector('.bcard__hover-clip');
    const hovered = wrap.querySelector('.bcard__img--hover');

    hoverTl.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    hoverTl.current
      .to(def,     { scale: 1, opacity: 1,              duration: 0.75 }, 0)
      .to(clip,    { clipPath: 'inset(100% 0 0 0)',      duration: 0.75 }, 0)
      .to(hovered, { y: 28,                              duration: 0.75 }, 0);
  };

  return (
    <motion.div
      className="bcard"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      onClick={() => onSelect?.(p)}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      <div
        ref={cardRef}
        className="bcard__wrap"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {primary ? (
          <img
            src={primary}
            alt={p.name || `pants ${p.id}`}
            className="bcard__img bcard__img--default"
            loading="lazy"
          />
        ) : (
          <div className="bcard__img bcard__img--placeholder" />
        )}

        <div className="bcard__hover-clip">
          {hover ? (
            <img
              src={hover}
              alt={p.name ? `${p.name} worn` : 'worn view'}
              className="bcard__img bcard__img--hover"
              loading="lazy"
            />
          ) : (
            primary && (
              <img
                src={primary}
                alt={p.name || 'product'}
                className="bcard__img bcard__img--hover"
                loading="lazy"
              />
            )
          )}
        </div>

        {p.status === 'sold_out' && (
          <div className="bcard__sold-out">Sold Out</div>
        )}
      </div>

      {p.name && (
        <div className="bcard__meta">
          <span className="bcard__name">{p.name}</span>
          <span className="bcard__tag">● APPAREL</span>
        </div>
      )}

      <div className="bcard__info">
        <span className="bcard__price">{p.price}</span>
        <button
          className="bcard__btn"
          aria-label="Add to bag"
          onClick={(e) => e.stopPropagation()}
        >+</button>
      </div>
    </motion.div>
  );
}