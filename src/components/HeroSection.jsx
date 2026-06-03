import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './HeroSection.css';

export default function HeroSection({ onNavigate }) {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const brandRef    = useRef(null);
  const headlineRef = useRef(null);
  const subRef      = useRef(null);
  const btnRef      = useRef(null);

  const mouse   = useRef({ x: -999, y: -999 });
  const cur     = useRef({ x: -999, y: -999 });
  const rafRef  = useRef(null);
  const imagesRef = useRef({ bw: null, color: null, loaded: 0 });

  /* ── canvas effect ── */
  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext('2d');
    const section = sectionRef.current;

    const bwImg    = new Image();
    const colorImg = new Image();

    bwImg.src    = new URL('../assets/hero-bw.png',    import.meta.url).href;
    colorImg.src = new URL('../assets/hero-color.png', import.meta.url).href;

    const onLoad = () => {
      imagesRef.current.loaded++;
      if (imagesRef.current.loaded === 2) {
        imagesRef.current.bw    = bwImg;
        imagesRef.current.color = colorImg;
        startLoop();
      }
    };
    bwImg.onload    = onLoad;
    colorImg.onload = onLoad;

    const resize = () => {
      canvas.width  = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.current.x = -999; mouse.current.y = -999; };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);

    const startLoop = () => {
      const draw = () => {
        const { bw, color } = imagesRef.current;
        if (!bw || !color) { rafRef.current = requestAnimationFrame(draw); return; }

        const w = canvas.width;
        const h = canvas.height;

        cur.current.x += (mouse.current.x - cur.current.x) * 0.1;
        cur.current.y += (mouse.current.y - cur.current.y) * 0.1;

        const scale  = Math.max(w / bw.naturalWidth, h / bw.naturalHeight);
        const sw = bw.naturalWidth * scale;
        const sh = bw.naturalHeight * scale;
        const sx = (w - sw) / 2;
        const sy = (h - sh) / 2;

        const cScale = Math.max(w / color.naturalWidth, h / color.naturalHeight);
        const csw = color.naturalWidth  * cScale;
        const csh = color.naturalHeight * cScale;
        const csx = (w - csw) / 2;
        const csy = (h - csh) / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(bw, sx, sy, sw, sh);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cur.current.x, cur.current.y, 160, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(color, csx, csy, csw, csh);
        ctx.restore();

        rafRef.current = requestAnimationFrame(draw);
      };
      rafRef.current = requestAnimationFrame(draw);
    };

    return () => {
      window.removeEventListener('resize', resize);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── entrance animations — smooth clip-path reveals ── */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    // Brand slides down + fades
    tl.fromTo(brandRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )

    // Headline: each word clips up from below
    .fromTo(headlineRef.current,
      { opacity: 0, y: 50, clipPath: 'inset(100% 0% 0% 0%)' },
      { opacity: 1, y: 0,  clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0, ease: 'power4.out' },
      '-=0.2'
    )

    // Sub: fades + rises with slight blur
    .fromTo(subRef.current,
      { opacity: 0, y: 22, filter: 'blur(4px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)',
        duration: 0.85, ease: 'power3.out' },
      '-=0.5'
    )

    // Button: scales up from 0.88
    .fromTo(btnRef.current,
      { opacity: 0, y: 16, scale: 0.92 },
      { opacity: 1, y: 0,  scale: 1,
        duration: 0.7, ease: 'back.out(1.4)' },
      '-=0.4'
    );
  }, []);

  /* ── navigate to shop ── */
  const handleExplore = () => {
    // If parent passes onNavigate prop (like your App.jsx does)
    if (typeof onNavigate === 'function') {
      onNavigate('shop');
      return;
    }
    // Fallback: smooth scroll to .shop element
    const shop = document.querySelector('.shop') || document.querySelector('#shop');
    if (shop) shop.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="hero">
      <canvas ref={canvasRef} className="hero__canvas" />

      {/* Brand — top left */}
      <p ref={brandRef} className="hero__brand">IT OUTFIT</p>

      {/* Content — center left */}
      <div className="hero__content">
        <h1 ref={headlineRef} className="hero__headline">
          Wear the silence of those who never needed to prove a thing
        </h1>
        <p ref={subRef} className="hero__sub">
          Born from the era of true gentlemen and timeless taste — IT OUTFIT is where old school
          discipline meets quiet luxury. No trends. No noise. Just pieces that carry weight,
          history, and intention. Because a man who dresses with purpose never goes unnoticed.
        </p>
        <button ref={btnRef} className="hero__btn" onClick={handleExplore}>
          <span>Explore The Collection</span>
          <span className="hero__btn-line" />
        </button>
      </div>
    </section>
  );
}