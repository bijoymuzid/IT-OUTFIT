import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './ProductDetailPage.css';

/* ── per-product descriptions ── */
const DESCRIPTIONS = {
  'Wool Blazer':         'Single-button, unlined. A wool hopsack that drapes like a second skin. The kind of blazer that turns a plain white shirt into a statement.',
  'Linen Shirt':         'Washed linen in a relaxed silhouette. Wears best un-tucked, sleeves rolled to the forearm. No ironing required — the crease is the point.',
  'Oxford Button-Up':    'Two-ply Oxford cloth. Button-down collar that lies flat without pins. The shirt that invented the word "understated".',
  'Pinstripe Overshirt': 'Tailored overshirt in Italian pinstripe. Wear it open over a tee or buttoned as a light jacket. Twelve months of use.',
  'Denim Pullover':      'Structured denim jersey — not a sweatshirt, not a shirt. Something in between that needs no category to belong.',
  'Poplin Shirt':        'Featherlight poplin. The collar keeps its shape. The fabric breathes. One of those pieces you forget you\'re wearing until someone notices it.',
  'Slate Overshirt':     'Heavy-weight brushed cotton in a slate that shifts between grey and blue depending on the light. Four chest pockets. Zero hardware.',
  'Cotton Chore Coat':   'A working coat re-imagined for a man who no longer needs to. Unlined, raw-edge seams, substantial weight. Smells like history.',
  'Classic White Blouse':'Every wardrobe has a white shirt. This is the one that makes the others redundant. Cut slightly long, slightly boxy, completely correct.',
  'Tan Short Sleeve':    'Ripstop cotton in an earthy tan. Cut with a generous shoulder and tapered hem. The shirt for when the weather turns and you refuse to care.',
};

const FALLBACK_DESC =
  'Crafted with intention. A piece that speaks without announcing itself — quiet luxury for those who understand the weight of restraint.';

/* ── resolve gallery images ── */
function resolveImages(product, section) {
  /* custom product with explicit images */
  if (!product.seeded) {
    const imgs = [];
    if (product.image)      imgs.push(product.image);
    if (product.imageHover) imgs.push(product.imageHover);
    /* if neither exists fall back to seeded-style paths (uid may still be numeric-based) */
    if (!imgs.length && product.id) {
      const f  = section === 'bottom' ? 'bottom'       : 'top';
      const hf = section === 'bottom' ? 'human-bottom' : 'human-top';
      imgs.push(`/${f}/${product.id}.jpeg`, `/${hf}/${product.id}.jpeg`);
    }
    return imgs.length ? imgs : ['/placeholder.jpeg'];
  }

  /* seeded product — always use path-based images */
  const folder  = section === 'bottom' ? 'bottom'       : 'top';
  const hfolder = section === 'bottom' ? 'human-bottom' : 'human-top';
  return [
    `/${folder}/${product.id}.jpeg`,
    `/${hfolder}/${product.id}.jpeg`,
  ];
}

/* ── derive available sizes ── */
function resolveSizes(product) {
  if (product.sizes && product.sizes.length) return product.sizes;
  return ['XS', 'S', 'M', 'L', 'XL'];
}

export default function ProductDetailPage({ product, onBack, section }) {
  const [qty, setQty]         = useState(1);
  const [activeImg, setActive] = useState(0);

  const containerRef = useRef(null);
  const infoRef      = useRef(null);
  const backRef      = useRef(null);
  const imgRefs      = useRef([]);

  const images = resolveImages(product, section);
  const sizes  = resolveSizes(product);

  /* ── entrance animation ── */
  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline({ delay: 0.05 });
    tl.fromTo(backRef.current,
      { opacity: 0, x: -14 },
      { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' }
    )
    .fromTo(infoRef.current.querySelectorAll('.pdp__animate'),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1 },
      '-=0.2'
    );

    imgRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.12 }
      );
    });
  }, []);

  /* ── track which image is in view ── */
  useEffect(() => {
    const observers = imgRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(i); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const scrollTo = (i) => {
    imgRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const desc = product.description || DESCRIPTIONS[product.name] || FALLBACK_DESC;

  /* derive a display category label */
  const catLabel = section
    ? section.charAt(0).toUpperCase() + section.slice(1)
    : product.category || '—';

  /* SKU: use numeric id if available, otherwise last 6 chars of uid */
  const sku = product.id
    ? `IT-${String(product.id).padStart(3, '0')}`
    : `IT-${(product.uid || 'CUSTOM').slice(-6).toUpperCase()}`;

  return (
    <div ref={containerRef} className="pdp">

      {/* ── LEFT: scrollable gallery ── */}
      <div className="pdp__gallery">
        {images.map((src, i) => (
          <div
            key={i}
            ref={el => (imgRefs.current[i] = el)}
            className="pdp__img-wrap"
          >
            <img
              src={src}
              alt={`${product.name} — view ${i + 1}`}
              className="pdp__img"
            />
          </div>
        ))}

        {/* dot indicators */}
        <div className="pdp__dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`pdp__dot ${activeImg === i ? 'pdp__dot--active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT: sticky info ── */}
      <div className="pdp__panel">
        <div ref={infoRef} className="pdp__info">

          <button ref={backRef} className="pdp__back" onClick={onBack}>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M0 5h15M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Return to Shop
          </button>

          <h1 className="pdp__name pdp__animate">{product.name}</h1>
          <p  className="pdp__price pdp__animate">{product.price}</p>
          <p  className="pdp__desc pdp__animate">{desc}</p>

          {/* size selector — uses actual sizes from product */}
          <div className="pdp__sizes pdp__animate">
            {sizes.map(sz => (
              <SizeBtn key={sz} label={sz} />
            ))}
          </div>

          {/* qty */}
          <div className="pdp__qty-row pdp__animate">
            <button
              className="pdp__qty-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              aria-label="Decrease"
            >−</button>
            <span className="pdp__qty-num">{qty}</span>
            <button
              className="pdp__qty-btn"
              onClick={() => setQty(q => q + 1)}
              aria-label="Increase"
            >+</button>
          </div>

          <div className="pdp__rule pdp__animate" />

          <button
            className="pdp__add pdp__animate"
            disabled={product.status === 'sold_out'}
            style={product.status === 'sold_out' ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
          >
            {product.status === 'sold_out' ? 'Sold Out' : 'Add to Bag'}
            <span className="pdp__add-line" />
          </button>

          {/* product meta */}
          <ul className="pdp__meta pdp__animate">
            <li><span>SKU</span><span>{sku}</span></li>
            <li><span>Category</span><span>{catLabel}</span></li>
            <li><span>Material</span><span>100% Natural Fibre</span></li>
            <li><span>Fit</span><span>Regular / Relaxed</span></li>
          </ul>

        </div>
      </div>

    </div>
  );
}

/* ── tiny size button ── */
function SizeBtn({ label }) {
  const [sel, setSel] = useState(false);
  return (
    <button
      className={`pdp__size ${sel ? 'pdp__size--active' : ''}`}
      onClick={() => setSel(s => !s)}
    >
      {label}
    </button>
  );
}