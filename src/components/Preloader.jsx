import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null);
  const lettersRef = useRef([]);
  const lineRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const els = lettersRef.current.filter(Boolean);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Letters appear
    tl.fromTo(els,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.7 }
    );

    // Counter
    const obj = { n: 0 };
    tl.to(obj, {
      n: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate() {
        if (counterRef.current)
          counterRef.current.textContent = Math.round(obj.n) + '%';
      }
    }, 0.2);

    // Line
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: 'power3.inOut', transformOrigin: 'left' },
      0.9
    );

    // Letters exit
    tl.to(els, { y: -80, opacity: 0, stagger: 0.04, duration: 0.45, ease: 'power3.in' }, 2.0);

    // Slide whole preloader up → done
    tl.to(rootRef.current, {
      yPercent: -100, duration: 0.8, ease: 'power4.inOut',
      onComplete,
    }, 2.5);

  }, [onComplete]);

  return (
    <div ref={rootRef} className="pre">
      <div className="pre__inner">
        <div className="pre__letters">
          {'IT OUTFIT'.split('').map((ch, i) =>
            ch === ' '
              ? <span key={i} className="pre__sp" />
              : <span key={i} className="pre__ch" ref={el => { lettersRef.current[i] = el; }}>{ch}</span>
          )}
        </div>
        <div ref={lineRef} className="pre__line" />
        <span ref={counterRef} className="pre__count">0%</span>
      </div>
    </div>
  );
}